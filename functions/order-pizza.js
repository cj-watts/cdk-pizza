"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const validateOrder = (body) => {
    const { toppings = [], size } = body;
    if (!size || !toppings || !toppings.length) {
        return false;
    }
    return !(size !== "small" && size !== "medium" && size !== "large");
};
const validateFlavor = (body) => {
    const { toppings = [] } = body;
    if (toppings.length) {
        return !!(toppings.find((topping) => topping === "pineapple"));
    }
    //no toppings!
    return false;
};
/**
 *
 * Just fetch the flavor from the request and put it into the response
 */
const handler = async (event, context) => {
    console.log("event: ", { event });
    console.log("context: ", { context });
    const containsPineapple = validateFlavor(event.body);
    const validationFailure = validateOrder(event.body);
    const response = {
        input: event.body,
        containsPineapple,
        validationFailure,
    };
    console.log("response: ", response);
    return response;
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItcGl6emEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvcmRlci1waXp6YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFRQSxNQUFNLGFBQWEsR0FBRyxDQUFDLElBQWlCLEVBQVcsRUFBRTtJQUNqRCxNQUFNLEVBQUMsUUFBUSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFFcEMsSUFBRyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN4QyxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsT0FBTyxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU8sSUFBSSxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQztBQUN4RSxDQUFDLENBQUE7QUFFRCxNQUFNLGNBQWMsR0FBRyxDQUFDLElBQWlCLEVBQVcsRUFBRTtJQUNsRCxNQUFNLEVBQUUsUUFBUSxHQUFHLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQztJQUUvQixJQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQixPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCxjQUFjO0lBQ2QsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQyxDQUFBO0FBRUQ7OztHQUdHO0FBQ0ksTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUFFLEtBQVUsRUFBRSxPQUFnQixFQUFFLEVBQUU7SUFDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUV0QyxNQUFNLGlCQUFpQixHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckQsTUFBTSxpQkFBaUIsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRW5ELE1BQU0sUUFBUSxHQUFHO1FBQ2IsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJO1FBQ2pCLGlCQUFpQjtRQUNqQixpQkFBaUI7S0FDcEIsQ0FBQztJQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sUUFBUSxDQUFDO0FBQ3BCLENBQUMsQ0FBQztBQWRXLFFBQUEsT0FBTyxXQWNsQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuXG5cbnR5cGUgQm9keVJlcXVlc3QgPSB7XG4gICAgc2l6ZTogJ3NtYWxsJyB8ICdtZWRpdW0nIHwgJ2xhcmdlJyB8IHVuZGVmaW5lZCxcbiAgICB0b3BwaW5nczogc3RyaW5nW107XG59O1xuXG5jb25zdCB2YWxpZGF0ZU9yZGVyID0gKGJvZHk6IEJvZHlSZXF1ZXN0KTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3Qge3RvcHBpbmdzID0gW10sIHNpemUgfSA9IGJvZHk7XG5cbiAgICBpZighc2l6ZSB8fCAhdG9wcGluZ3MgfHwgIXRvcHBpbmdzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuICEoc2l6ZSAhPT0gXCJzbWFsbFwiICYmIHNpemUgIT09IFwibWVkaXVtXCIgJiYgc2l6ZSAhPT0gXCJsYXJnZVwiKTtcbn1cblxuY29uc3QgdmFsaWRhdGVGbGF2b3IgPSAoYm9keTogQm9keVJlcXVlc3QpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCB7IHRvcHBpbmdzID0gW10gfSA9IGJvZHk7XG5cbiAgICBpZih0b3BwaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuICEhKHRvcHBpbmdzLmZpbmQoKHRvcHBpbmcpID0+IHRvcHBpbmcgPT09IFwicGluZWFwcGxlXCIpKTtcbiAgICB9XG5cbiAgICAvL25vIHRvcHBpbmdzIVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKlxuICogSnVzdCBmZXRjaCB0aGUgZmxhdm9yIGZyb20gdGhlIHJlcXVlc3QgYW5kIHB1dCBpdCBpbnRvIHRoZSByZXNwb25zZVxuICovXG5leHBvcnQgY29uc3QgaGFuZGxlciA9IGFzeW5jIChldmVudDogYW55LCBjb250ZXh0OiBDb250ZXh0KSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJldmVudDogXCIsIHsgZXZlbnQgfSk7XG4gICAgY29uc29sZS5sb2coXCJjb250ZXh0OiBcIiwgeyBjb250ZXh0IH0pO1xuXG4gICAgY29uc3QgY29udGFpbnNQaW5lYXBwbGUgPSB2YWxpZGF0ZUZsYXZvcihldmVudC5ib2R5KTtcbiAgICBjb25zdCB2YWxpZGF0aW9uRmFpbHVyZSA9IHZhbGlkYXRlT3JkZXIoZXZlbnQuYm9keSlcblxuICAgIGNvbnN0IHJlc3BvbnNlID0ge1xuICAgICAgICBpbnB1dDogZXZlbnQuYm9keSxcbiAgICAgICAgY29udGFpbnNQaW5lYXBwbGUsXG4gICAgICAgIHZhbGlkYXRpb25GYWlsdXJlLFxuICAgIH07XG4gICAgY29uc29sZS5sb2coXCJyZXNwb25zZTogXCIsIHJlc3BvbnNlKTtcbiAgICByZXR1cm4gcmVzcG9uc2U7XG59O1xuIl19