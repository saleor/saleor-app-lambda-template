# Saleor AWS Lambda App Template

This repository provides a template for building and deploying a Saleor App using AWS Lambda, AWS API Gateway, and AWS CDK for infrastructure management.

## Key Features
- **AWS Infrastructure-as-Code** using CDK v2
- **Saleor App SDK integration** for writing handlers for AWS Lambda
- **Example of webhook handling** with ORDER_CREATED event example
- **TypeScript** with strict type checking

## Architecture Overview

```
[API Gateway] (HTTP API)
│
├─ /api/manifest (GET) → [Manifest Lambda] (Node.js 22.x)
│   └─ Integrates with [Saleor App SDK]
│
├─ /api/register (POST) → [Register Lambda] (Node.js 22.x)
│   ├─ Handles Saleor app registration
│   └─ Uses [APL Storage] (File/Upstash)
│
└─ /api/webhook/order-created (POST) → [Webhook Lambda] (Node.js 22.x)
    └─ Processes ORDER_CREATED events from Saleor

[Environment Variables]
├─ APL=upstash/file
├─ UPSTASH_URL
└─ UPSTASH_TOKEN

[Shared Resources]
├─ [AWS IAM] (Least-privilege roles)
├─ [CloudWatch Logs]
└─ [CDK Stack] (lib/saleor-app-aws-lambda-template-stack.ts)
```

### AWS CDK Stack Components
1. **HTTP API Gateway** - Main entry point with three routes
2. **Lambda Functions**:
   - `ManifestHandler`: Serves app manifest at `/api/manifest`
   - `RegisterHandler`: Handles app registration at `/api/register`
   - `OrderCreatedHandler`: Processes ORDER_CREATED webhooks

3. **Environment Configuration**:
   ```bash
   APL=upstash  # Storage backend (file/upstash)
   UPSTASH_URL=  # Required for Upstash APL
   UPSTASH_TOKEN= # Required for Upstash APL
   ```

## Development Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Build project:
   ```bash
   pnpm run build
   ```
4. Deploy stack:
   ```bash
   cdk deploy
   ```

## Webhook Implementation Example
The template includes an `ORDER_CREATED` webhook handler that:
1. Receives order creation events from Saleor
2. Extracts order details using generated GraphQL types
3. Returns 200 OK response with simple logging

```typescript
// lambda/webhook/order-created.ts
export const handler = orderCreatedWebhook.createHandler((event, context, saleorContext) => {
  console.log('Webhook received:', saleorContext.event);
  return { statusCode: 200, body: 'OK' };
});
```

## Customization Points
1. Add new webhooks in `lambda/webhook/` directory
2. Modify GraphQL queries in `lambda/graphql/`
3. Extend CDK stack with additional AWS resources
4. Implement custom business logic in handlers
