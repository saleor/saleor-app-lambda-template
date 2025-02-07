import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { config } from 'dotenv';

config();

export class SaleorAppApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const routerHandler = new NodejsFunction(this, 'ApiRouteHandler', {
      entry: "lambda/index.ts",
      handler: "handler",
      runtime: cdk.aws_lambda.Runtime.NODEJS_22_X,
      environment: {
        APL: process.env.APL!,
        UPSTASH_URL: process.env.UPSTASH_URL!,
        UPSTASH_TOKEN: process.env.UPSTASH_TOKEN!,
      }
    });

    const api = new cdk.aws_apigatewayv2.HttpApi(this, "HttpApi");
    const lambdaIntegration = new cdk.aws_apigatewayv2_integrations.HttpLambdaIntegration("LambdaIntegration", routerHandler);

    api.addRoutes({
      path: "/api/manifest",
      integration: lambdaIntegration,
      methods: [cdk.aws_apigatewayv2.HttpMethod.GET]
    })

    api.addRoutes({
      path: "/api/register",
      integration: lambdaIntegration,
      methods: [cdk.aws_apigatewayv2.HttpMethod.POST]
    })

    api.addRoutes({
      path: "/api/webhook/order-created",
      integration: lambdaIntegration,
      methods: [cdk.aws_apigatewayv2.HttpMethod.POST]
    })
  }
}
