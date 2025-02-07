import { createAppRegisterHandler } from "@saleor/app-sdk/handlers/aws-lambda";
import { saleorApp } from "./saleor-app";

export const handler = createAppRegisterHandler({
  apl: saleorApp.apl,
  async onRequestStart(request, context) {
    console.log("register onRequestStart", request, context);
  },
});
