import {BodyRequest} from "./types";

const calculatePrice = (event: BodyRequest): number => {
    let price = 0;
    for(let pizza of event.pizzas) {
        switch(pizza.size) {
            case "small":
                price += 500;
                break;
            case "medium":
                price += 1000;
                break;
            case "large":
                price += 1500;
        }
        price += pizza.toppings.length * 150;
    }
    return price;
}

export const handler = async (event:any, context:any) => {
    console.log("Event Info...", { event });
    console.log({ context });

    const {
        startDate,
        name,
        input,
    } = event;
    const stopDate = new Date().getTime();

    // Implement Step #5 here.
    const price = calculatePrice(input);

    return {
        name,
        startDate,
        status: "SUCCEEDED",
        price,
        stopDate,
    };
};
