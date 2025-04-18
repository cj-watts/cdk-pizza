import { Context } from "aws-lambda";
import {BodyRequest} from "./types";
const BANNED_TOPPINGS = ["pineapple", "anchovies"];

// Implement Step #1 - #4 here.
export const validateOrder = (body: BodyRequest): boolean => {
    console.log(JSON.stringify(body));
    const names: string[] = [];
    if(!Array.isArray(body.pizzas) || !body.pizzas.length) {
        console.log(`pizzas were missing.`);
        return true;
    }
    for(let pizza of body.pizzas) {

        const {toppings = [], size} = pizza;

        if (!size || !toppings || !Array.isArray(toppings) || !toppings.length) {
            console.log(`size or toppings were missing.`);
            return true;
        }

        if (size !== "small" && size !== "medium" && size !== "large") {
            console.log(`size was not a valid value.`);
            return true;
        }
        if(names.length && !pizza.name){
            return true;
        }
        if(pizza.name) {
            if(names.includes(pizza.name)) {return true;}
            names.push(pizza.name);
        }

    }
    return false;
}

const validateFlavor = (body: BodyRequest): boolean => {
    let hasBannedToppings = false;
    for(let pizza of body.pizzas) {
        if (pizza.toppings.length) {
            hasBannedToppings = pizza.toppings.some((topping: string) => BANNED_TOPPINGS.includes(topping));
        }
        if(hasBannedToppings) {
            break;
        }
    }

    return hasBannedToppings;
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
