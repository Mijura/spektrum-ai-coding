## ---------- builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

ARG GITHUB_TOKEN

# Configure GitHub Packages auth for @jigjoy-ai/* packages
RUN echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > .npmrc && \
    echo "@jigjoy-ai:registry=https://npm.pkg.github.com" >> .npmrc

COPY package.json package-lock.json ./
RUN npm ci

# Remove .npmrc so token doesn't leak into the final image
RUN rm -f .npmrc

## ---------- runtime ----------
FROM node:20-alpine

WORKDIR /app

# Install yarn (needed by YarnPackageManager for project builds) and tini
RUN apk add --no-cache yarn tini

# Copy production node_modules from builder (includes ts-node, typescript, tsconfig-paths)
COPY --from=builder /app/node_modules ./node_modules

# Copy app source
COPY . .

# Remove any .npmrc that might have been copied from context
RUN rm -f .npmrc

ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:8080/health || exit 1

ENTRYPOINT ["tini", "--"]
CMD ["npx", "ts-node", "-r", "tsconfig-paths/register", "src/infrastructure/http/index.ts"]
