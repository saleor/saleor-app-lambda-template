import { SaleorAsyncWebhook } from '@saleor/app-sdk/handlers/aws-lambda';
import { gql } from 'urql';
import { saleorApp } from '../saleor-app';
import { OrderCreatedWebhookPayloadFragment } from '../generated/graphql';

/**
 * Example payload of the webhook. It will be transformed with graphql-codegen to Typescript type: OrderCreatedWebhookPayloadFragment
 */
export const OrderCreatedWebhookPayload = gql`
  fragment OrderCreatedWebhookPayload on OrderCreated {
    order {
      userEmail
      id
      number
      user {
        email
        firstName
        lastName
      }
    }
  }
`;

/**
 * Top-level webhook subscription query, that will be attached to the Manifest.
 * Saleor will use it to register webhook.
 */
const OrderCreatedGraphqlSubscription = gql`
  # Payload fragment must be included in the root query
  ${OrderCreatedWebhookPayload}
  subscription OrderCreated {
    event {
      ...OrderCreatedWebhookPayload
    }
  }
`;

export const orderCreatedWebhook = new SaleorAsyncWebhook<
  OrderCreatedWebhookPayloadFragment
>({
  name: "Order Created in Saleor",
  webhookPath: "api/webhooks/order-created",
  event: "ORDER_CREATED",
  apl: saleorApp.apl,
  query: OrderCreatedGraphqlSubscription,
});

export const handler = orderCreatedWebhook.createHandler((_event, _lambdaContext, saleorContext) => {
  console.log(saleorContext.event);

  return {
    body: "ok",
    statusCode: 200,
  }
})
