"use client"

import {useStripe, useElements, PaymentElement, AddressElement} from '@stripe/react-stripe-js';

//@ts-ignore
const CheckoutForm = ({clientSecret}) => {

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
        confirmParams: {
          return_url: "https://example.com/order/123/complete",
        },
      });
  
      if (result.error) {
        // Show error to your customer (for example, payment details incomplete)
        console.log(result.error.message);
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    };
  return (
    <form onSubmit={handleSubmit} id='payment-form' className=' flex flex-col  justify-center gap-14 items-center '>
        <div className=' text-4xl text-gray-900 underline mb-4 font-bold'>E-Book Rental Checkout Form</div>
        <h2 className=' font-semibold'>Address Information</h2>
        <div className=' w-[40vw]'>
        <AddressElement options={{
            mode:"shipping",
            allowedCountries:["US","IN"]
        }} />
    <div className=' flex flex-col gap-10'>
      <PaymentElement id='payment-element' options={{layout:"tabs"}}  />
      </div>
      <div className=' text-3xl justify-end flex font-bold'>Total Price: $666.99  </div>
      <button onClick={()=> {}} className=' bg-black text-white p-3 hover:bg-slate-900 rounded-md'>Submit</button>
      </div>
    </form>
  );
};

export default CheckoutForm;