import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { handler as manifestHandler } from './manifest'
import { handler as registerHandler } from "./register";
import { handler as orderCreatedHandler } from "./webhook/order-created";

// This is request router passing events to a function that should handle the response
export async function handler(
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> {
  try {
    console.log(event);
    switch (event.routeKey) {
      case 'GET /api/manifest':
        return manifestHandler(event, context);
      case 'POST /api/register':
        return registerHandler(event, context);
      case 'POST /api/webhook/order-created':
        return orderCreatedHandler(event, context);
      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Route not found" }),
          headers: { 'Content-Type': 'application/json' }
        }
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
      headers: { 'Content-Type': 'application/json' }
    }
  }
}
