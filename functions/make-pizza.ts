import {BodyRequest} from "./types";

const calculatePrice = (event: BodyRequest): number => {
    console.log(`faking price for now`);
    return Math.floor(Math.random() * 100);
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
