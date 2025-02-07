import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { config } from 'dotenv';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";

config();

/** Creates each separate lambda for API route, routes between them using AWS API Gateway */
export class SaleorAppApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const environment = {
      APL: process.env.APL!,
      UPSTASH_URL: process.env.UPSTASH_URL!,
      UPSTASH_TOKEN: process.env.UPSTASH_TOKEN!,
    } as const;

    const manifestHandler = new NodejsFunction(this, 'ManifestHandler', {
      entry: 'lambda/manifest.ts',
      handler: 'handler',
      runtime: cdk.aws_lambda.Runtime.NODEJS_22_X,
      environment,
    });

    const registerHandler = new NodejsFunction(this, 'RegisterHandler', {
      entry: 'lambda/register.ts',
      handler: 'handler',
      runtime: cdk.aws_lambda.Runtime.NODEJS_22_X,
      environment,
    });

    const orderCreatedHandler = new NodejsFunction(this, 'OrderCreatedHandler', {
      entry: 'lambda/webhook/order-created.ts',
      handler: 'handler',
      runtime: cdk.aws_lambda.Runtime.NODEJS_22_X,
      environment,
    });

    const api = new apigwv2.HttpApi(this, 'HttpApi');

    api.addRoutes({
      path: '/api/manifest',
      methods: [apigwv2.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration(
        'ManifestIntegration',
        manifestHandler
      ),
    });

    api.addRoutes({
      path: '/api/register',
      methods: [apigwv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration(
        'RegisterIntegration',
        registerHandler
      ),
    });

    api.addRoutes({
      path: '/api/webhook/order-created',
      methods: [apigwv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration(
        'OrderCreatedIntegration',
        orderCreatedHandler
      ),
    });
  }
}
