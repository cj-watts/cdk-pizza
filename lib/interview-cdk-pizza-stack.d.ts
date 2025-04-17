import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Stack } from "aws-cdk-lib";
export declare class InterviewCdkPizzaStack extends cdk.Stack {
    protected stateMachine: sfn.StateMachine;
    constructor(scope: Construct, id: string, props?: cdk.StackProps);
    protected setupStateMachine(): void;
    protected makeLambdaFunctions(stack: Stack): {
        orderFailure: cdk.aws_stepfunctions_tasks.LambdaInvoke;
        orderPizza: cdk.aws_stepfunctions_tasks.LambdaInvoke;
        makePizza: cdk.aws_stepfunctions_tasks.LambdaInvoke;
        pineappleError: cdk.aws_stepfunctions_tasks.LambdaInvoke;
    };
    protected setupApiGateway(stateMachine: StateMachine): void;
}
