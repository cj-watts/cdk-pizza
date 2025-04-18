export type BodyRequest = {
    name?: string;
    pizzas: Pizza[];
};

type Pizza = {
    name?: string;
    size: 'small' | 'medium' | 'large' | undefined;
    toppings: string[];
}