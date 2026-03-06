# Spektrum Deployment Guide

## Overview

Spektrum (AI Coding Engine) runs as a Docker container on an EC2 instance in AWS. The infrastructure is managed via CloudFormation (SAM), and Docker images are built with AWS CodeBuild pulling source from GitHub.

## Architecture

```
                     CodeBuild (GitHub source)
                          |
                          v
                     ECR Repository
                          |
                          v
EC2 (t3.medium) --- Docker container --- port 8080
     |
  Elastic IP: 52.49.179.242
```

- **Stack name**: `spektrum`
- **Region**: `eu-west-1`
- **AWS Profile**: `spektrum-dev`
- **Account**: `425946675747`

## Deployed Resources

| Resource          | Value                                                   |
| ----------------- | ------------------------------------------------------- |
| Elastic IP        | `52.49.179.242`                                         |
| Health endpoint   | `http://52.49.179.242:8080/health`                      |
| EC2 Instance      | `i-060ea510127959e5e` (t3.medium, Amazon Linux 2023)    |
| ECR Repository    | `425946675747.dkr.ecr.eu-west-1.amazonaws.com/spektrum` |
| DynamoDB Table    | `spektrum-Codebase` (PK: `projectId`)                   |
| CloudWatch Logs   | `/ec2/spektrum`                                         |
| CodeBuild Project | `spektrum-build`                                        |
| Security Group    | Inbound: 8080 (app), 22 (SSH)                           |
| SSH Key           | `spektrum-dev` (local: `~/.ssh/spektrum-dev.pem`)       |

## Environment Variables (container)

| Variable              | Source                                                   |
| --------------------- | -------------------------------------------------------- |
| `PORT`                | `8080`                                                   |
| `AWS_REGION`          | `eu-west-1`                                              |
| `CODEBASE_TABLE`      | `spektrum-Codebase` (from CloudFormation)                |
| `JIGJOY_API_ENDPOINT` | Platform API Gateway URL (from CloudFormation parameter) |

## How to Deploy

### 1. Infrastructure changes (template.yaml)

```bash
npm run deploy:dev
# or: sam deploy
```

This uses `samconfig.toml` which has the stack name, profile, region, and parameter overrides preconfigured.

### 2. Build and push Docker image (via CodeBuild)

CodeBuild pulls source directly from the GitHub repo. Trigger a build specifying the branch:

```bash
aws codebuild start-build \
  --project-name ai-coding-build \
  --source-version development \
  --profile spektrum-dev \
  --region eu-west-1
```

Check build status:

```bash
aws codebuild batch-get-builds \
  --ids "<build-id>" \
  --query 'builds[0].{status:buildStatus,phase:currentPhase}' \
  --output table \
  --profile spektrum-dev \
  --region eu-west-1
```

### 3. Deploy new image to EC2

The EC2 instance has a `/home/ec2-user/start-container.sh` script that pulls the latest image from ECR and restarts the container. Run it via SSM:

```bash
aws ssm send-command \
  --instance-ids "i-0a09c6422ec23f0af" \
  --document-name "AWS-RunShellScript" \
  --parameters 'commands=["/home/ec2-user/start-container.sh"]' \
  --profile spektrum-dev \
  --region eu-west-1
```

### Full deploy cycle (build + deploy)

```bash
# 1. Push your code to GitHub
git push

# 2. Trigger CodeBuild
BUILD_ID=$(aws codebuild start-build \
  --project-name spektrum-build \
  --source-version <branch-name> \
  --query 'build.id' \
  --output text \
  --profile spektrum-dev \
  --region eu-west-1)

# 3. Wait for build to complete
aws codebuild batch-get-builds --ids "$BUILD_ID" \
  --query 'builds[0].buildStatus' --output text \
  --profile spektrum-dev --region eu-west-1

# 4. Restart container on EC2
aws ssm send-command \
  --instance-ids "i-060ea510127959e5e" \
  --document-name "AWS-RunShellScript" \
  --parameters 'commands=["/home/ec2-user/start-container.sh"]' \
  --profile spektrum-dev --region eu-west-1

# 5. Verify
curl http://52.49.179.242:8080/health
```

## Alternative: Local Docker Build

If you have Docker running locally:

```bash
# Set your GitHub token (needed for @jigjoy-ai/* packages)
export GITHUB_TOKEN=$(gh auth token)

# Build
npm run docker:build

# Push to ECR
npm run docker:push
```

## Alternative: GitHub Actions CI/CD

The `.github/workflows/deploy.yml` workflow automatically builds and deploys on push to `main`. It:

1. Builds the Docker image
2. Pushes to ECR
3. Restarts the container on EC2 via SSM

Required GitHub secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `GH_PACKAGES_TOKEN`

## SSH Access

```bash
ssh -i ~/.ssh/spektrum-dev.pem ec2-user@52.49.179.242
```

Once connected:

```bash
docker ps                    # Check container status
docker logs spektrum         # View app logs
./start-container.sh         # Restart with latest image
```

## Troubleshooting

**Container keeps restarting:**

```bash
docker logs spektrum 2>&1 | tail -50
```

**Check if image exists in ECR:**

```bash
aws ecr describe-images --repository-name spektrum \
  --profile spektrum-dev --region eu-west-1
```

**CodeBuild logs:**

```bash
# Get log location from build
aws codebuild batch-get-builds --ids "<build-id>" \
  --query 'builds[0].logs.deepLink' --output text \
  --profile spektrum-dev --region eu-west-1
```

**View CloudWatch container logs:**

```bash
aws logs tail /ec2/spektrum --follow \
  --profile spektrum-dev --region eu-west-1
```

## Secrets Manager

| Secret         | Purpose                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `github-token` | GitHub PAT with `read:packages` scope, used by CodeBuild to pull `@jigjoy-ai/*` packages during Docker build |

## Cost (~$30/month)

- EC2 t3.medium on-demand: ~$30/month
- Elastic IP (attached to running instance): free
- ECR, DynamoDB on-demand, CloudWatch: negligible

## Files

| File                           | Purpose                                                 |
| ------------------------------ | ------------------------------------------------------- |
| `template.yaml`                | CloudFormation: EC2, ECR, DynamoDB, EIP, IAM, CodeBuild |
| `samconfig.toml`               | SAM deploy config (stack, profile, parameters)          |
| `Dockerfile`                   | Multi-stage build with GitHub Packages auth             |
| `.dockerignore`                | Excludes node_modules, .git, etc. from Docker context   |
| `buildspec.yml`                | CodeBuild spec (ECR login, docker build, push)          |
| `.github/workflows/deploy.yml` | GitHub Actions CI/CD                                    |
