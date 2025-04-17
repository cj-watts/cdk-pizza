"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewCdkPizzaStack = void 0;
const cdk = require("aws-cdk-lib");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const tasks = require("aws-cdk-lib/aws-stepfunctions-tasks");
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const path_1 = require("path");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
const logs = require("aws-cdk-lib/aws-logs");
class InterviewCdkPizzaStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.setupStateMachine();
        this.setupApiGateway(this.stateMachine);
    }
    setupStateMachine() {
        const { orderPizza, orderFailure, makePizza, pineappleError } = this.makeLambdaFunctions(this);
        const failState = new sfn.Succeed(this, "PineappleErrorFailState");
        pineappleError.next(failState);
        const checkPineappleChoice = new sfn.Choice(this, "CheckPineappleChoice", {
            inputPath: "$",
        });
        checkPineappleChoice
            .when(sfn.Condition.booleanEquals("$.orderAnalysis.containsPineapple", true), pineappleError)
            .when(sfn.Condition.booleanEquals("$.orderAnalysis.validationFailure", true), orderFailure)
            .otherwise(makePizza);
        /** ------------------ State Machine Definition ------------------ */
        const logGroup = new logs.LogGroup(this, "PizzaRequestLogGroup", {
            retention: logs.RetentionDays.ONE_DAY,
        });
        const definition = sfn.Chain.start(orderPizza).next(checkPineappleChoice);
        // Create state machine
        this.stateMachine = new sfn.StateMachine(this, "PizzaRequestStateMachine", {
            // definition,
            definitionBody: sfn.DefinitionBody.fromChainable(definition),
            stateMachineType: sfn.StateMachineType.EXPRESS,
            timeout: aws_cdk_lib_1.Duration.minutes(5),
            logs: {
                destination: logGroup,
                level: sfn.LogLevel.ALL,
            },
            tracingEnabled: true,
        });
    }
    makeLambdaFunctions(stack) {
        const basePath = (0, path_1.join)(__dirname, "..", "functions");
        const runtime = aws_lambda_1.Runtime.NODEJS_18_X;
        const handler = "handler";
        /** ------------------ Lambda Function Definition ------------------ */
        const orderPizzaLambdaPath = (0, path_1.join)(basePath, "order-pizza.ts");
        const orderPizzaLambda = new aws_lambda_nodejs_1.NodejsFunction(stack, "OrderPizzaLambda", {
            runtime,
            handler,
            functionName: 'interview-dev-order-pizza',
            entry: orderPizzaLambdaPath,
        });
        const orderFailureLambdaPath = (0, path_1.join)(basePath, "order-failure.ts");
        const orderFailureLambda = new aws_lambda_nodejs_1.NodejsFunction(stack, "OrderFailureLambda", {
            runtime,
            handler,
            functionName: 'interview-dev-order-failure',
            entry: orderFailureLambdaPath,
        });
        const pineappleErrorLambdaPath = (0, path_1.join)(basePath, "pineapple-error.ts");
        const pineappleErrorLambda = new aws_lambda_nodejs_1.NodejsFunction(stack, "PineappleErrorLambda", {
            runtime,
            handler,
            functionName: 'interview-dev-pizza-error',
            entry: pineappleErrorLambdaPath,
        });
        const makePizzaLambdaPath = (0, path_1.join)(basePath, "make-pizza.ts");
        const makePizzaLambda = new aws_lambda_nodejs_1.NodejsFunction(stack, "MakePizzaLambda", {
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
    setupApiGateway(stateMachine) {
        /**
         * API Gateway
         */
        const api = new aws_apigateway_1.RestApi(this, "PizzaApi", {
            restApiName: "Pizza Service",
            description: "The best place to have a pizza!",
        });
        /**
         * API Gateway Resources (POST /pizza)
         */
        const spacesResource = api.root.addResource("pizza");
        spacesResource.addMethod("POST", aws_apigateway_1.StepFunctionsIntegration.startExecution(stateMachine));
    }
}
exports.InterviewCdkPizzaStack = InterviewCdkPizzaStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2aWV3LWNkay1waXp6YS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVydmlldy1jZGstcGl6emEtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLHFEQUFxRDtBQUVyRCw2REFBNkQ7QUFDN0QsK0RBQTZFO0FBQzdFLHVEQUErQztBQUMvQywrQkFBNEI7QUFDNUIsNkNBQTRDO0FBQzVDLHFFQUE2RDtBQUM3RCw2Q0FBNkM7QUFFN0MsTUFBYSxzQkFBdUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUluRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBR3hCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFUyxpQkFBaUI7UUFFekIsTUFBTSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUvRixNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLHlCQUF5QixDQUFDLENBQUM7UUFDbkUsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUUvQixNQUFNLG9CQUFvQixHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDeEUsU0FBUyxFQUFFLEdBQUc7U0FDZixDQUFDLENBQUM7UUFFSCxvQkFBb0I7YUFDZixJQUFJLENBQ0QsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQ3ZCLG1DQUFtQyxFQUNuQyxJQUFJLENBQ1AsRUFDRCxjQUFjLENBQ2pCO2FBQ0EsSUFBSSxDQUNELEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUN2QixtQ0FBbUMsRUFDbkMsSUFBSSxDQUNQLEVBQ0QsWUFBWSxDQUNmO2FBQ0EsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTFCLHFFQUFxRTtRQUNyRSxNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLHNCQUFzQixFQUFFO1lBQy9ELFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU87U0FDdEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFMUUsdUJBQXVCO1FBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSwwQkFBMEIsRUFBRTtZQUN6RSxjQUFjO1lBQ2QsY0FBYyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztZQUM1RCxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTztZQUM5QyxPQUFPLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksRUFBRTtnQkFDSixXQUFXLEVBQUUsUUFBUTtnQkFDckIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRzthQUN4QjtZQUNELGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFHUyxtQkFBbUIsQ0FBQyxLQUFZO1FBQ3hDLE1BQU0sUUFBUSxHQUFHLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDcEQsTUFBTSxPQUFPLEdBQUcsb0JBQU8sQ0FBQyxXQUFXLENBQUM7UUFDcEMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO1FBRTFCLHVFQUF1RTtRQUV2RSxNQUFNLG9CQUFvQixHQUFHLElBQUEsV0FBSSxFQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlELE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxrQ0FBYyxDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtZQUNyRSxPQUFPO1lBQ1AsT0FBTztZQUNQLFlBQVksRUFBRSwyQkFBMkI7WUFDekMsS0FBSyxFQUFFLG9CQUFvQjtTQUM1QixDQUFDLENBQUM7UUFFSCxNQUFNLHNCQUFzQixHQUFHLElBQUEsV0FBSSxFQUFDLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxrQ0FBYyxDQUFDLEtBQUssRUFBRSxvQkFBb0IsRUFBRTtZQUN6RSxPQUFPO1lBQ1AsT0FBTztZQUNQLFlBQVksRUFBRSw2QkFBNkI7WUFDM0MsS0FBSyxFQUFFLHNCQUFzQjtTQUM5QixDQUFDLENBQUM7UUFFSCxNQUFNLHdCQUF3QixHQUFHLElBQUEsV0FBSSxFQUFDLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxrQ0FBYyxDQUMzQyxLQUFLLEVBQ0wsc0JBQXNCLEVBQ3RCO1lBQ0UsT0FBTztZQUNQLE9BQU87WUFDUCxZQUFZLEVBQUUsMkJBQTJCO1lBQ3pDLEtBQUssRUFBRSx3QkFBd0I7U0FDaEMsQ0FDSixDQUFDO1FBRUYsTUFBTSxtQkFBbUIsR0FBRyxJQUFBLFdBQUksRUFBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDNUQsTUFBTSxlQUFlLEdBQUcsSUFBSSxrQ0FBYyxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtZQUNuRSxPQUFPO1lBQ1AsT0FBTztZQUNQLFlBQVksRUFBRSwwQkFBMEI7WUFDeEMsS0FBSyxFQUFFLG1CQUFtQjtTQUMzQixDQUFDLENBQUM7UUFFSCxtRUFBbUU7UUFDbkUsTUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtZQUNuRSxjQUFjLEVBQUUsZ0JBQWdCO1lBQ2hDLHdCQUF3QixFQUFFLEtBQUs7WUFDL0IsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixtQkFBbUIsRUFBRSxJQUFJO1NBQzFCLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUU7WUFDckUsY0FBYyxFQUFFLGtCQUFrQjtZQUNsQyx3QkFBd0IsRUFBRSxLQUFLO1lBQy9CLFVBQVUsRUFBRSxpQkFBaUI7WUFDN0IsbUJBQW1CLEVBQUUsSUFBSTtTQUMxQixDQUFDLENBQUM7UUFFSCxNQUFNLGNBQWMsR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLHNCQUFzQixFQUFFO1lBQzNFLGNBQWMsRUFBRSxvQkFBb0I7WUFDcEMsd0JBQXdCLEVBQUUsS0FBSztZQUMvQixTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLG9CQUFvQjtZQUNwQixtQkFBbUIsRUFBRSxJQUFJO1NBQzFCLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQUU7WUFDakUsY0FBYyxFQUFFLGVBQWU7WUFDL0Isd0JBQXdCLEVBQUUsS0FBSztZQUMvQixTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLG9CQUFvQjtZQUNwQixtQkFBbUIsRUFBRSxJQUFJO1NBQzFCLENBQUMsQ0FBQztRQUVILE9BQU87WUFDTCxZQUFZO1lBQ1osVUFBVTtZQUNWLFNBQVM7WUFDVCxjQUFjO1NBQ2YsQ0FBQztJQUVKLENBQUM7SUFFUyxlQUFlLENBQUMsWUFBMEI7UUFDbEQ7O1dBRUc7UUFDSCxNQUFNLEdBQUcsR0FBRyxJQUFJLHdCQUFPLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN4QyxXQUFXLEVBQUUsZUFBZTtZQUM1QixXQUFXLEVBQUUsaUNBQWlDO1NBQy9DLENBQUMsQ0FBQztRQUVIOztXQUVHO1FBQ0gsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckQsY0FBYyxDQUFDLFNBQVMsQ0FDcEIsTUFBTSxFQUNOLHlDQUF3QixDQUFDLGNBQWMsQ0FDbkMsWUFBWSxDQUNmLENBQ0osQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXRLRCx3REFzS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHtDb25zdHJ1Y3R9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgc2ZuIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zJztcbmltcG9ydCB7IFN0YXRlTWFjaGluZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zJztcbmltcG9ydCAqIGFzIHRhc2tzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zdGVwZnVuY3Rpb25zLXRhc2tzJztcbmltcG9ydCB7UmVzdEFwaSwgU3RlcEZ1bmN0aW9uc0ludGVncmF0aW9ufSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXlcIjtcbmltcG9ydCB7UnVudGltZX0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGFcIjtcbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHtEdXJhdGlvbiwgU3RhY2t9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHtOb2RlanNGdW5jdGlvbn0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGEtbm9kZWpzXCI7XG5pbXBvcnQgKiBhcyBsb2dzIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbG9nc1wiO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJ2aWV3Q2RrUGl6emFTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG5cbiAgcHJvdGVjdGVkIHN0YXRlTWFjaGluZTogc2ZuLlN0YXRlTWFjaGluZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cblxuICAgIHRoaXMuc2V0dXBTdGF0ZU1hY2hpbmUoKTtcbiAgICB0aGlzLnNldHVwQXBpR2F0ZXdheSh0aGlzLnN0YXRlTWFjaGluZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0dXBTdGF0ZU1hY2hpbmUoKSB7XG5cbiAgICBjb25zdCB7IG9yZGVyUGl6emEsIG9yZGVyRmFpbHVyZSwgbWFrZVBpenphLCBwaW5lYXBwbGVFcnJvciB9ID0gdGhpcy5tYWtlTGFtYmRhRnVuY3Rpb25zKHRoaXMpO1xuXG4gICAgY29uc3QgZmFpbFN0YXRlID0gbmV3IHNmbi5TdWNjZWVkKHRoaXMsIFwiUGluZWFwcGxlRXJyb3JGYWlsU3RhdGVcIik7XG4gICAgcGluZWFwcGxlRXJyb3IubmV4dChmYWlsU3RhdGUpO1xuXG4gICAgY29uc3QgY2hlY2tQaW5lYXBwbGVDaG9pY2UgPSBuZXcgc2ZuLkNob2ljZSh0aGlzLCBcIkNoZWNrUGluZWFwcGxlQ2hvaWNlXCIsIHtcbiAgICAgIGlucHV0UGF0aDogXCIkXCIsXG4gICAgfSk7XG5cbiAgICBjaGVja1BpbmVhcHBsZUNob2ljZVxuICAgICAgICAud2hlbihcbiAgICAgICAgICAgIHNmbi5Db25kaXRpb24uYm9vbGVhbkVxdWFscyhcbiAgICAgICAgICAgICAgICBcIiQub3JkZXJBbmFseXNpcy5jb250YWluc1BpbmVhcHBsZVwiLFxuICAgICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBwaW5lYXBwbGVFcnJvclxuICAgICAgICApXG4gICAgICAgIC53aGVuKFxuICAgICAgICAgICAgc2ZuLkNvbmRpdGlvbi5ib29sZWFuRXF1YWxzKFxuICAgICAgICAgICAgICAgIFwiJC5vcmRlckFuYWx5c2lzLnZhbGlkYXRpb25GYWlsdXJlXCIsXG4gICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIG9yZGVyRmFpbHVyZVxuICAgICAgICApXG4gICAgICAgIC5vdGhlcndpc2UobWFrZVBpenphKTtcblxuICAgIC8qKiAtLS0tLS0tLS0tLS0tLS0tLS0gU3RhdGUgTWFjaGluZSBEZWZpbml0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IGxvZ3MuTG9nR3JvdXAodGhpcywgXCJQaXp6YVJlcXVlc3RMb2dHcm91cFwiLCB7XG4gICAgICByZXRlbnRpb246IGxvZ3MuUmV0ZW50aW9uRGF5cy5PTkVfREFZLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IHNmbi5DaGFpbi5zdGFydChvcmRlclBpenphKS5uZXh0KGNoZWNrUGluZWFwcGxlQ2hvaWNlKTtcblxuICAgIC8vIENyZWF0ZSBzdGF0ZSBtYWNoaW5lXG4gICAgdGhpcy5zdGF0ZU1hY2hpbmUgPSBuZXcgc2ZuLlN0YXRlTWFjaGluZSh0aGlzLCBcIlBpenphUmVxdWVzdFN0YXRlTWFjaGluZVwiLCB7XG4gICAgICAvLyBkZWZpbml0aW9uLFxuICAgICAgZGVmaW5pdGlvbkJvZHk6IHNmbi5EZWZpbml0aW9uQm9keS5mcm9tQ2hhaW5hYmxlKGRlZmluaXRpb24pLFxuICAgICAgc3RhdGVNYWNoaW5lVHlwZTogc2ZuLlN0YXRlTWFjaGluZVR5cGUuRVhQUkVTUyxcbiAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgICBsb2dzOiB7XG4gICAgICAgIGRlc3RpbmF0aW9uOiBsb2dHcm91cCxcbiAgICAgICAgbGV2ZWw6IHNmbi5Mb2dMZXZlbC5BTEwsXG4gICAgICB9LFxuICAgICAgdHJhY2luZ0VuYWJsZWQ6IHRydWUsXG4gICAgfSk7XG4gIH1cblxuXG4gIHByb3RlY3RlZCBtYWtlTGFtYmRhRnVuY3Rpb25zKHN0YWNrOiBTdGFjaykge1xuICAgIGNvbnN0IGJhc2VQYXRoID0gam9pbihfX2Rpcm5hbWUsIFwiLi5cIiwgXCJmdW5jdGlvbnNcIik7XG4gICAgY29uc3QgcnVudGltZSA9IFJ1bnRpbWUuTk9ERUpTXzE4X1g7XG4gICAgY29uc3QgaGFuZGxlciA9IFwiaGFuZGxlclwiO1xuXG4gICAgLyoqIC0tLS0tLS0tLS0tLS0tLS0tLSBMYW1iZGEgRnVuY3Rpb24gRGVmaW5pdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgIGNvbnN0IG9yZGVyUGl6emFMYW1iZGFQYXRoID0gam9pbihiYXNlUGF0aCwgXCJvcmRlci1waXp6YS50c1wiKTtcbiAgICBjb25zdCBvcmRlclBpenphTGFtYmRhID0gbmV3IE5vZGVqc0Z1bmN0aW9uKHN0YWNrLCBcIk9yZGVyUGl6emFMYW1iZGFcIiwge1xuICAgICAgcnVudGltZSxcbiAgICAgIGhhbmRsZXIsXG4gICAgICBmdW5jdGlvbk5hbWU6ICdpbnRlcnZpZXctZGV2LW9yZGVyLXBpenphJyxcbiAgICAgIGVudHJ5OiBvcmRlclBpenphTGFtYmRhUGF0aCxcbiAgICB9KTtcblxuICAgIGNvbnN0IG9yZGVyRmFpbHVyZUxhbWJkYVBhdGggPSBqb2luKGJhc2VQYXRoLCBcIm9yZGVyLWZhaWx1cmUudHNcIik7XG4gICAgY29uc3Qgb3JkZXJGYWlsdXJlTGFtYmRhID0gbmV3IE5vZGVqc0Z1bmN0aW9uKHN0YWNrLCBcIk9yZGVyRmFpbHVyZUxhbWJkYVwiLCB7XG4gICAgICBydW50aW1lLFxuICAgICAgaGFuZGxlcixcbiAgICAgIGZ1bmN0aW9uTmFtZTogJ2ludGVydmlldy1kZXYtb3JkZXItZmFpbHVyZScsXG4gICAgICBlbnRyeTogb3JkZXJGYWlsdXJlTGFtYmRhUGF0aCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBpbmVhcHBsZUVycm9yTGFtYmRhUGF0aCA9IGpvaW4oYmFzZVBhdGgsIFwicGluZWFwcGxlLWVycm9yLnRzXCIpO1xuICAgIGNvbnN0IHBpbmVhcHBsZUVycm9yTGFtYmRhID0gbmV3IE5vZGVqc0Z1bmN0aW9uKFxuICAgICAgICBzdGFjayxcbiAgICAgICAgXCJQaW5lYXBwbGVFcnJvckxhbWJkYVwiLFxuICAgICAgICB7XG4gICAgICAgICAgcnVudGltZSxcbiAgICAgICAgICBoYW5kbGVyLFxuICAgICAgICAgIGZ1bmN0aW9uTmFtZTogJ2ludGVydmlldy1kZXYtcGl6emEtZXJyb3InLFxuICAgICAgICAgIGVudHJ5OiBwaW5lYXBwbGVFcnJvckxhbWJkYVBhdGgsXG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgY29uc3QgbWFrZVBpenphTGFtYmRhUGF0aCA9IGpvaW4oYmFzZVBhdGgsIFwibWFrZS1waXp6YS50c1wiKTtcbiAgICBjb25zdCBtYWtlUGl6emFMYW1iZGEgPSBuZXcgTm9kZWpzRnVuY3Rpb24oc3RhY2ssIFwiTWFrZVBpenphTGFtYmRhXCIsIHtcbiAgICAgIHJ1bnRpbWUsXG4gICAgICBoYW5kbGVyLFxuICAgICAgZnVuY3Rpb25OYW1lOiAnaW50ZXJ2aWV3LWRldi1tYWtlLXBpenphJyxcbiAgICAgIGVudHJ5OiBtYWtlUGl6emFMYW1iZGFQYXRoLFxuICAgIH0pO1xuXG4gICAgLyoqIC0tLS0tLS0tLS0tLS0tLS0tLSBTdGVwIEZ1bmN0aW9ucyBJbnZva2VzIC0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgIGNvbnN0IG9yZGVyUGl6emEgPSBuZXcgdGFza3MuTGFtYmRhSW52b2tlKHN0YWNrLCBcIk9yZGVyUGl6emFJbnZva2VcIiwge1xuICAgICAgbGFtYmRhRnVuY3Rpb246IG9yZGVyUGl6emFMYW1iZGEsXG4gICAgICByZXRyeU9uU2VydmljZUV4Y2VwdGlvbnM6IGZhbHNlLFxuICAgICAgcmVzdWx0UGF0aDogXCIkLm9yZGVyQW5hbHlzaXNcIixcbiAgICAgIHBheWxvYWRSZXNwb25zZU9ubHk6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBvcmRlckZhaWx1cmUgPSBuZXcgdGFza3MuTGFtYmRhSW52b2tlKHN0YWNrLCBcIk9yZGVyRmFpbHVyZVRhc2tcIiwge1xuICAgICAgbGFtYmRhRnVuY3Rpb246IG9yZGVyRmFpbHVyZUxhbWJkYSxcbiAgICAgIHJldHJ5T25TZXJ2aWNlRXhjZXB0aW9uczogZmFsc2UsXG4gICAgICByZXN1bHRQYXRoOiBcIiQub3JkZXJBbmFseXNpc1wiLFxuICAgICAgcGF5bG9hZFJlc3BvbnNlT25seTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBpbmVhcHBsZUVycm9yID0gbmV3IHRhc2tzLkxhbWJkYUludm9rZShzdGFjaywgXCJQaW5lYXBwbGVFcnJvckludm9rZVwiLCB7XG4gICAgICBsYW1iZGFGdW5jdGlvbjogcGluZWFwcGxlRXJyb3JMYW1iZGEsXG4gICAgICByZXRyeU9uU2VydmljZUV4Y2VwdGlvbnM6IGZhbHNlLFxuICAgICAgaW5wdXRQYXRoOiBcIiQub3JkZXJBbmFseXNpc1wiLFxuICAgICAgLy8gcmVzdWx0UGF0aDogXCIkLlwiLFxuICAgICAgcGF5bG9hZFJlc3BvbnNlT25seTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1ha2VQaXp6YSA9IG5ldyB0YXNrcy5MYW1iZGFJbnZva2Uoc3RhY2ssIFwiTWFrZVBpenphSW52b2tlXCIsIHtcbiAgICAgIGxhbWJkYUZ1bmN0aW9uOiBtYWtlUGl6emFMYW1iZGEsXG4gICAgICByZXRyeU9uU2VydmljZUV4Y2VwdGlvbnM6IGZhbHNlLFxuICAgICAgaW5wdXRQYXRoOiBcIiQub3JkZXJBbmFseXNpc1wiLFxuICAgICAgLy8gcmVzdWx0UGF0aDogXCIkLlwiLFxuICAgICAgcGF5bG9hZFJlc3BvbnNlT25seTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICBvcmRlckZhaWx1cmUsXG4gICAgICBvcmRlclBpenphLFxuICAgICAgbWFrZVBpenphLFxuICAgICAgcGluZWFwcGxlRXJyb3IsXG4gICAgfTtcblxuICB9XG5cbiAgcHJvdGVjdGVkIHNldHVwQXBpR2F0ZXdheShzdGF0ZU1hY2hpbmU6IFN0YXRlTWFjaGluZSkge1xuICAgIC8qKlxuICAgICAqIEFQSSBHYXRld2F5XG4gICAgICovXG4gICAgY29uc3QgYXBpID0gbmV3IFJlc3RBcGkodGhpcywgXCJQaXp6YUFwaVwiLCB7XG4gICAgICByZXN0QXBpTmFtZTogXCJQaXp6YSBTZXJ2aWNlXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJUaGUgYmVzdCBwbGFjZSB0byBoYXZlIGEgcGl6emEhXCIsXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBBUEkgR2F0ZXdheSBSZXNvdXJjZXMgKFBPU1QgL3BpenphKVxuICAgICAqL1xuICAgIGNvbnN0IHNwYWNlc1Jlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoXCJwaXp6YVwiKTtcblxuICAgIHNwYWNlc1Jlc291cmNlLmFkZE1ldGhvZChcbiAgICAgICAgXCJQT1NUXCIsXG4gICAgICAgIFN0ZXBGdW5jdGlvbnNJbnRlZ3JhdGlvbi5zdGFydEV4ZWN1dGlvbihcbiAgICAgICAgICAgIHN0YXRlTWFjaGluZVxuICAgICAgICApXG4gICAgKTtcbiAgfVxufVxuXG4iXX0=