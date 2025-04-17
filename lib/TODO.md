## Preparations:

1. setup an AWS account
2. note down the REGION And AWS ACCOUNT ID
3. set the properties `CDK_DEFAULT_ACCOUNT` and `CDK_DEFAULT_REGION` in your environment
   1. see the `bin/interview-cdk-pizza.ts` file for details. 
4. After you deploy to AWS, your API will be visible at the URL:
   1. `https://<api-id>.execute-api.<region>.amazonaws.com/prod/pizza`
   2. The API currently exposes a single `POST` api call
 
## Changes Required

1. Change the API to request a body in this format:

```json
    {
        "name": "John Doe",
        "pizzas": [
            {
                "toppings": ["pepperoni"],
                "size": "medium",
                "name": "John's Pizza"
            }
        ]
    }
```     
   
2. Order Validation:
    1. name for both is optional
    2. pizzas is an array of objects
    3. toppings is an array of strings
    4. size is a string
3.  A Valid order is defined as:
    1. at least one pizza
    2. each pizza must have at least one topping
    3. each pizza must have a size
    4. the size of the pizza must be: `small`, `medium` or `large`
    5. if any pizza has a name, all pizzas must have a name
    6. if pizzas have names, they must be unique to the order
4. Retain existing validation:  Fail the call if `pineapple` is one of the toppings
    1. Extend this to support a list of banned toppings
    2. set up a second pizza topping, your pick, that will fail validation as well. 
5. Calculate the total price for the order, adding up the price for each pizza
    1. the price is calculated as follows: 
       1. small pizza: **$5**
       2. medium pizza: **$10**
       3. large pizza: **$15**
       4. each topping is an additional **$1.50 per topping**
       5. Example: a small pizza with 2 toppings would cost `$8.00`.
6. Return the price as a numerical value in minor units, so `$15.00` would show up as `1500` 

7. Questions to answer - no code, just talk about what you would do:
   1. Where would you store orders if you had to store them somewhere?
   2. What would you need to do to enable order lookups after the customer submitted a valid order
   3. How would you manage toppings inventory if you needed to? propose a simple example.
