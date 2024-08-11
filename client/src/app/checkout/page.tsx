"use client"
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from '../(Components)/CheckoutForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51PjdabHaMXngjvddCslsW5iG4UdPyWrF1IGT8KOHLBhkljubXyec28cAqYl7eFOsX4xOORWWy5tZnxV48Dilt0gQ00uaIYQL0B');

export default function App() {
    
    // @ts-ignore
    const output= JSON.parse(localStorage.getItem("paymentIntentId"))
    console.log(output);
  const options = {
    // passing the client secret obtained from the server
    clientSecret: output.client_secret,
    appearance:{
        theme:'stripe',
        label:'floating'
    }
  };

  return (
    // @ts-ignore
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm clientSecret={output.client_secret} />
    </Elements>
  );
};