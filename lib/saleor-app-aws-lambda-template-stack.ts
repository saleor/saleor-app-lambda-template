import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class SaleorAppApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const routerHandler = new lambda.Function(this, 'ApiRouterHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler'
    });

    const endpoint = new apigw.LambdaRestApi(this, `ApiGwEndpoint`, {
      handler: routerHandler,
    });

    // Add /api route
    const apiResource = endpoint.root.addResource('api');

    apiResource.addResource('manifest').addMethod('GET', new apigw.LambdaIntegration(routerHandler));

    // Register endpoint
    apiResource.addResource('register')
      .addMethod('POST', new apigw.LambdaIntegration(routerHandler));

    // Webhook endpoint
    apiResource.addResource('webhook')
      .addResource('order-created')
      .addMethod('POST', new apigw.LambdaIntegration(routerHandler));
  }
}
