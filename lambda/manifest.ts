import { createManifestHandler } from "@saleor/app-sdk/handlers/aws-lambda";
import { orderCreatedWebhook } from "./webhook/order-created";

export const handler = createManifestHandler({
  manifestFactory({ appBaseUrl, schemaVersion, request }) {
    console.log("manifest", appBaseUrl, schemaVersion, request.requestContext.stage)
    return {
      name: "AWS Lambda Template",
      id: "saleor.app.aws-lambda-template",
      tokenTargetUrl: `${appBaseUrl}/api/register`,
      author: "Jonatan Witoszek",
      appUrl: appBaseUrl,
      version: "0.0.1",
      extensions: [],
      permissions: ["MANAGE_ORDERS"],
      webhooks: [orderCreatedWebhook.getWebhookManifest(appBaseUrl)],
    }
  }
})
