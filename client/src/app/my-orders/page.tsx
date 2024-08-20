"use client";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../(Components)/base";
import Navbar from "../(Components)/Navbar";
import { useRouter } from "next/navigation";

const page = () => {
  const [orders, setOrders] = useState([]);
  const router= useRouter()
  const fun = async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/orders`, {
        method: "GET",
        // @ts-ignore
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });
      if (!res.ok) {
        throw new Error("Network problem!");
      }
      const data = await res.json();
      setOrders(data.myOrders);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fun();
  }, []);

  

  return (
    <div>
      <Navbar />
      { orders.length>0 ?
      <div className="m-5 pl-10 ">
  <div className="grid grid-cols-5 gap-4 mb-8 text-2xl font-semibold">
    <div>Book Info</div>
    <div>Price</div>
    <div>Quantity</div>
    <div>Payment Status</div>
    <div>Order Placed</div>
  </div>
  <div className="flex flex-col gap-6">
    {
      //@ts-ignore
      orders.map((item, i) => (
        <div className="flex flex-col gap-10" key={i}>
          
          {
            // @ts-ignore
            item.products.map((val, index) => (
              <div key={index} className=" flex flex-col gap-4">
                {/* @ts-ignore */}
                   <div className=" font-medium text-sm text-gray-700">OrderId: {item.orderId}</div>
              <div  className="grid grid-cols-5 gap-3 items-center text-center">
                <div className="flex items-center gap-4">
                  <img
                    src={val.image}
                    alt={val.bookname}
                    className="h-16 w-16 rounded object-cover"
                  />
                  <div className="font-medium text-sm">{val.bookname}</div>
                </div>
                <div>{val.price}</div>
                <div>{val.quantity}</div>
                {/* @ts-ignore */}
                <div className={`${item.status==="succeeded"?' text-green-700 font-semibold':' text-red-700 font-semibold'}`}>{item.status==="succeeded"? item.status : "Failed" }</div>
                <div>{val.createdAt.slice(0, 10)}</div>
              </div>
              </div>
            ))
          }
        </div>
      ))
    }
  </div>
</div>
 :
 <div className=" flex h-[70vh] justify-center items-center">
  <div className=" flex flex-col justify-center">
  <div className=" text-xl font-medium text-gray-800">No Orders Yet!! </div>
    <button onClick={()=> router.push('/')} className=" text-white hover:bg-green-500 bg-green-600 p-3 mt-10 rounded-md">Shop Books</button>
  </div>
 </div>
}
    </div>
  );
};

export default page;
