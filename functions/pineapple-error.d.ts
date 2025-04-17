import { Context } from "aws-lambda";
export declare const handler: (event: any, context: Context) => Promise<{
    cause: string;
    error: string;
    input: any;
    name: any;
    startDate: any;
    status: string;
    stopDate: number;
}>;
