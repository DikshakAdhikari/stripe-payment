"use client"

import {useStripe, useElements, PaymentElement, AddressElement} from '@stripe/react-stripe-js';
import { AppDispatch } from './GlobalRedux/store';
import { useDispatch } from 'react-redux';
import { resetBooks } from './GlobalRedux/Features/BookSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

//@ts-ignore
const CheckoutForm = ({clientSecret, setClientSecret,setCheckoutSuccess}) => {
  const router= useRouter()
  const dispatch: AppDispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
  
    // @ts-ignore
    const handleSubmit = async (event) => {
      // We don't want to let default form submission happen here,
      // which would refresh the page.
      event.preventDefault();
  
      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
  
      const result = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        redirect:'if_required'
      });
  
      if(!result.error){
        toast.success("Checkout Successfull!")
        dispatch(resetBooks())
        setCheckoutSuccess(true)
        setClientSecret(null)
        localStorage.removeItem("paymentIntentId")
      }else{
        alert("Card Declined! Purchase again!")
        router.push('/')
        
      }
      
     
    };
  return (
    <form onSubmit={handleSubmit} id='payment-form' className=' flex flex-col  justify-center gap-14 items-center '>
      <div className=' mt-12 flex flex-col gap-6'>
        <h2 className=' font-semibold'>Address Information</h2>
        <div className=' w-[30vw]'>
        <AddressElement options={{
            mode:"shipping",
            allowedCountries:["US","IN"]
        }} />
    <div className=' flex flex-col gap-10'>
      <PaymentElement id='payment-element' options={{layout:"tabs"}}  />
      </div>
      <div className=' text-3xl justify-end flex font-bold'>Total Price: ${localStorage.getItem('amount')}  </div>
      <button onClick={()=> {}} className=' bg-black text-white p-3 hover:bg-slate-900 rounded-md'>Submit</button>
      </div>
      </div>
    </form>
  );
};

export default CheckoutForm;