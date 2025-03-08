FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

RUN npm install -g ts-node typescript

# Copy the rest of your code into the container
COPY . .

# Run your main TypeScript file using ts-node
CMD ["ts-node", "./server.ts"]