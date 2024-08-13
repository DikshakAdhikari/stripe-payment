"use client"
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from '../(Components)/CheckoutForm';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../(Components)/GlobalRedux/store';
import { BASE_URL } from '../(Components)/base';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51PjdabHaMXngjvddCslsW5iG4UdPyWrF1IGT8KOHLBhkljubXyec28cAqYl7eFOsX4xOORWWy5tZnxV48Dilt0gQ00uaIYQL0B');

export default function App() {
  const cartBooks = useSelector((state: RootState) => state.books);
  const [clientSecret, setClientSecret]= useState(null)
  
  const fun= useCallback(async()=> {
    try{
      // @ts-ignore
      const output= JSON.parse(localStorage.getItem("paymentIntentId"))
      // @ts-ignore
      const amount= parseInt(localStorage.getItem("amount"))
      console.log(amount);
      
      
      const res= await fetch(`${BASE_URL}/orders/create-payment`,{
        method:"POST",
        // @ts-ignore
        headers:{
          'Content-Type':"application/json",
          "authorization": localStorage.getItem('token')
        },
        body:JSON.stringify({items:cartBooks, amount:amount, payment_intent_id :(output? output.id : null)})
      });
  
      if(!res.ok){
        throw new Error("Network problem!")
      }
      
      const data = await res.json()
      if(data){
        setClientSecret(data.client_secret)
        localStorage.setItem("paymentIntentId", JSON.stringify(data))
      }
  
    }catch(err){
      console.log(err);
      
    }
  },[])

  useEffect(()=> {
    fun()
  },[])
    

  const options = {
    // passing the client secret obtained from the server
    clientSecret:clientSecret,
    appearance:{
        theme:'stripe',
        label:'floating'
    }
  };

  return (
    <div>
    {clientSecret &&
    <>
    {/* @ts-ignore */}
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
    </>
    }
    </div>
  );
};