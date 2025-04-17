import { Context } from "aws-lambda";

export const handler = async (event: any, context: Context) => {
    console.log("Event Info...", { event });
    console.log({ context });

    const {
        startDate,
        input,
        inputDetails,
        name,
    } = event;
    return {
        cause: "The order did not pass validations",
        error: "Failed To Make Pizza",
        input,
        inputDetails,
        name,
        startDate,
        status: "FAILED",
        stopDate: new Date().getTime(),
    };
};
