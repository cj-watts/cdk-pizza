import { Context } from "aws-lambda";
import {BodyRequest} from "./types";


// Implement Step #1 - #4 here.
const validateOrder = (body: BodyRequest): boolean => {
    const {toppings = [], size } = body;

    console.log(JSON.stringify(body));

    if(!size || !toppings || !toppings.length) {
        console.log(`size or toppings were missing.`);
        return true;
    }

    if (size !== "small" && size !== "medium" && size !== "large") {
        console.log(`size was not a valid value.`);
        return true;
    }

    return false;
}

const validateFlavor = (body: BodyRequest): boolean => {
    const { toppings = [] } = body;

    console.log(JSON.stringify(body));


    if(toppings.length) {
        return !!(toppings.find((topping) => topping === "pineapple"));
    }

    //no toppings!
    return false;
}

/**
 *
 * Just fetch the flavor from the request and put it into the response
 */
export const handler = async (event: any, context: Context) => {
    console.log("event: ", { event });
    console.log("context: ", { context });

    const containsPineapple = validateFlavor(event.body);
    const validationFailure = validateOrder(event.body)

    console.log("containsPineapple: ", containsPineapple);
    console.log("validationFailure: ", validationFailure);

    const response = {
        input: event.body,
        containsPineapple,
        validationFailure,
    };
    console.log("response: ", response);
    return response;
};
