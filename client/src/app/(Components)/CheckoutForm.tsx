"use client"
import {PaymentElement} from '@stripe/react-stripe-js';
import { useState } from 'react';

const CheckoutForm = () => {

    const [loading, setLoading]= useState(false)

    //@ts-ignore
    const handleSubmit = (e)=> {
        e.preventDefault();

        setLoading(false)

    }
  return (
    <form onSubmit={handleSubmit} className=' flex flex-col justify-center gap-14 items-center h-[70vh]'>
        <div className=' text-4xl text-gray-900 underline mb-4 font-bold'>E-Book Rental Checkout Form</div>
    <div className=' flex flex-col gap-10'>
      <PaymentElement className=' w-[40vw]' />
      <div className=' text-3xl justify-end flex font-bold'>Total Price: $666.99  </div>
      <button className=' bg-black text-white p-3 hover:bg-slate-900 rounded-md'>Submit</button>
      </div>
    </form>
  );
};

export default CheckoutForm;