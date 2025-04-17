import { Context } from "aws-lambda";

export const handler = async (event: any, context: Context) => {
    console.log("Event Info...", { event });
    console.log({ context });

    const {
        startDate,
        input,
        name,
    } = event;
    return {
        cause: "They asked for Pineapple",
        error: "Failed To Make Pizza",
        input,
        name,
        startDate,
        status: "FAILED",
        stopDate: new Date().getTime(),
    };
};
