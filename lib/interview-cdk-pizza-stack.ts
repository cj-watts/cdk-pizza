import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import {RestApi, StepFunctionsIntegration} from "aws-cdk-lib/aws-apigateway";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import {Duration, Stack} from "aws-cdk-lib";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";

export class InterviewCdkPizzaStack extends cdk.Stack {

  protected stateMachine: sfn.StateMachine;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    this.setupStateMachine();
    this.setupApiGateway(this.stateMachine);
  }

  protected setupStateMachine() {

    const { orderPizza, orderFailure, makePizza, pineappleError } = this.makeLambdaFunctions(this);

    const failState = new sfn.Succeed(this, "PineappleErrorFailState");
    pineappleError.next(failState);

    const checkPineappleChoice = new sfn.Choice(this, "CheckPineappleChoice", {
      inputPath: "$",
    });

    checkPineappleChoice
        .when(
            sfn.Condition.booleanEquals(
                "$.orderAnalysis.containsPineapple",
                true
            ),
            pineappleError
        )
        .when(
            sfn.Condition.booleanEquals(
                "$.orderAnalysis.validationFailure",
                true
            ),
            orderFailure
        )
        .otherwise(makePizza);

    /** ------------------ State Machine Definition ------------------ */
    const logGroup = new logs.LogGroup(this, "PizzaRequestLogGroup", {
      retention: logs.RetentionDays.ONE_DAY,
    });

    const definition = sfn.Chain.start(orderPizza).next(checkPineappleChoice);

    // Create a state machine
    this.stateMachine = new sfn.StateMachine(this, "PizzaRequestStateMachine", {
      // definition,
      definitionBody: sfn.DefinitionBody.fromChainable(definition),
      stateMachineType: sfn.StateMachineType.EXPRESS,
      timeout: Duration.minutes(5),
      logs: {
        destination: logGroup,
        level: sfn.LogLevel.ALL,
      },
      tracingEnabled: true,
    });
  }


  protected makeLambdaFunctions(stack: Stack) {
    const basePath = join(__dirname, "..", "functions");
    const runtime = Runtime.NODEJS_18_X;
    const handler = "handler";

    /** ------------------ Lambda Function Definition ------------------ */

    const orderPizzaLambdaPath = join(basePath, "order-pizza.ts");
    const orderPizzaLambda = new NodejsFunction(stack, "OrderPizzaLambda", {
      runtime,
      handler,
      functionName: 'interview-dev-order-pizza',
      entry: orderPizzaLambdaPath,
    });

    const orderFailureLambdaPath = join(basePath, "order-failure.ts");
    const orderFailureLambda = new NodejsFunction(stack, "OrderFailureLambda", {
      runtime,
      handler,
      functionName: 'interview-dev-order-failure',
      entry: orderFailureLambdaPath,
    });

    const pineappleErrorLambdaPath = join(basePath, "pineapple-error.ts");
    const pineappleErrorLambda = new NodejsFunction(
        stack,
        "PineappleErrorLambda",
        {
          runtime,
          handler,
          functionName: 'interview-dev-pizza-error',
          entry: pineappleErrorLambdaPath,
        }
    );

    const makePizzaLambdaPath = join(basePath, "make-pizza.ts");
    const makePizzaLambda = new NodejsFunction(stack, "MakePizzaLambda", {
      runtime,
      handler,
      functionName: 'interview-dev-make-pizza',
      entry: makePizzaLambdaPath,
    });

    /** ------------------ Step Functions Invokes ------------------ */
    const orderPizza = new tasks.LambdaInvoke(stack, "OrderPizzaInvoke", {
      lambdaFunction: orderPizzaLambda,
      retryOnServiceExceptions: false,
      resultPath: "$.orderAnalysis",
      payloadResponseOnly: true,
    });

    const orderFailure = new tasks.LambdaInvoke(stack, "OrderFailureTask", {
      lambdaFunction: orderFailureLambda,
      retryOnServiceExceptions: false,
      resultPath: "$.orderAnalysis",
      payloadResponseOnly: true,
    });

    const pineappleError = new tasks.LambdaInvoke(stack, "PineappleErrorInvoke", {
      lambdaFunction: pineappleErrorLambda,
      retryOnServiceExceptions: false,
      inputPath: "$.orderAnalysis",
      // resultPath: "$.",
      payloadResponseOnly: true,
    });

    const makePizza = new tasks.LambdaInvoke(stack, "MakePizzaInvoke", {
      lambdaFunction: makePizzaLambda,
      retryOnServiceExceptions: false,
      inputPath: "$.orderAnalysis",
      // resultPath: "$.",
      payloadResponseOnly: true,
    });

    return {
      orderFailure,
      orderPizza,
      makePizza,
      pineappleError,
    };

  }

  protected setupApiGateway(stateMachine: StateMachine) {
    /**
     * API Gateway
     */
    const api = new RestApi(this, "PizzaApi", {
      restApiName: "Pizza Service",
      description: "The best place to have a pizza!",
    });

    /**
     * API Gateway Resources (POST /pizza)
     */
    const spacesResource = api.root.addResource("pizza");

    spacesResource.addMethod(
        "POST",
        StepFunctionsIntegration.startExecution(
            stateMachine
        )
    );
  }
}

