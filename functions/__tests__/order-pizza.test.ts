import { BodyRequest } from '../types';
import { validateOrder } from '../order-pizza';

describe('validateOrder', () => {
  // Test case 1: Missing pizzas array
  test('should return true (validation failure) when pizzas array is missing', () => {
    const body = {} as BodyRequest;
    expect(validateOrder(body)).toBe(true);
  });

  // Test case 2: Empty pizzas array
  test('should return true (validation failure) when pizzas array is empty', () => {
    const body: BodyRequest = {
      pizzas: []
    };
    expect(validateOrder(body)).toBe(true);
  });

  // Test case 3: Missing size
  test('should return true (validation failure) when size is missing', () => {
    const body: BodyRequest = {
      pizzas: [
        {
          toppings: ['cheese']
        } as any // Using 'as any' to bypass TypeScript type checking for this test
      ]
    };
    expect(validateOrder(body)).toBe(true);
  });

  // Test case 4: Missing toppings
  test('should return true (validation failure) when toppings is missing', () => {
    const body: BodyRequest = {
      pizzas: [
        {
          size: 'medium'
        } as any // Using 'as any' to bypass TypeScript type checking for this test
      ]
    };
    expect(validateOrder(body)).toBe(true);
  });

  // Test case 5: Empty toppings array
  test('should return true (validation failure) when toppings array is empty', () => {
    const body: BodyRequest = {
      pizzas: [
        {
          size: 'medium',
          toppings: []
        }
      ]
    };
    expect(validateOrder(body)).toBe(true);
  });

  // Test case 6: Invalid size value
  test('should return true (validation failure) when size is not valid', () => {
    const body: BodyRequest = {
      pizzas: [
        {
          size: 'extra-large' as any, // Using 'as any' to bypass TypeScript type checking for this test
          toppings: ['cheese']
        }
      ]
    };
    expect(validateOrder(body)).toBe(true);
  });

  // Test case 7: Missing name when other pizzas have names
  test('should return true (validation failure) when a pizza is missing a name but others have names', () => {
    const body: BodyRequest = {
      pizzas: [
        {
          name: 'Margherita',
          size: 'medium',
          toppings: ['cheese']
        },
        {
          size: 'large',
          toppings: ['pepperoni']
        }
      ]
    };
    expect(validateOrder(body)).toBe(true);
  });

  // Test case 8: Duplicate pizza names
  test('should return true (validation failure) when there are duplicate pizza names', () => {
    const body: BodyRequest = {
      pizzas: [
        {
          name: 'Margherita',
          size: 'medium',
          toppings: ['cheese']
        },
        {
          name: 'Margherita',
          size: 'large',
          toppings: ['cheese', 'basil']
        }
      ]
    };
    expect(validateOrder(body)).toBe(true);
  });

  // Test case 9: Valid order with no names
  test('should return false (valid order) when all validations pass with no names', () => {
    const body: BodyRequest = {
      pizzas: [
        {
          size: 'medium',
          toppings: ['cheese']
        },
        {
          size: 'large',
          toppings: ['pepperoni', 'mushrooms']
        }
      ]
    };
    expect(validateOrder(body)).toBe(false);
  });

  // Test case 10: Valid order with names
  test('should return false (valid order) when all validations pass with names', () => {
    const body: BodyRequest = {
      pizzas: [
        {
          name: 'Margherita',
          size: 'medium',
          toppings: ['cheese']
        },
        {
          name: 'Pepperoni',
          size: 'large',
          toppings: ['pepperoni', 'mushrooms']
        }
      ]
    };
    expect(validateOrder(body)).toBe(false);
  });
});