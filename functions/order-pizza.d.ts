import { Context } from "aws-lambda";
/**
 *
 * Just fetch the flavor from the request and put it into the response
 */
export declare const handler: (event: any, context: Context) => Promise<{
    input: any;
    containsPineapple: boolean;
    validationFailure: boolean;
}>;
