"use client";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../(Components)/base";
import Navbar from "../(Components)/Navbar";

const page = () => {
  const [orders, setOrders] = useState([]);
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
      console.log(data.myOrders);
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
      <div className=" m-5">
        <div className=" flex justify-between">
          <div>Image</div>
          <div>Price</div>
          <div>Quantity</div>
          <div>Payment Status</div>
          <div>Order Status</div>
        </div>
        <div className=" flex flex-col gap-6">
          {
            //@ts-ignore
            orders.map((item, i) => (
              <div className="flex flex-col gap-6">
                {
                  // @ts-ignore
                  item.products.map((val) => (
                    <div className=" flex justify-between">
                      <img
                        src={val.image}
                        alt={val.bookname}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <div>{val.price}</div>
                      <div>{val.quantity}</div>
                      <div>Success</div>
                      <div>Delivered</div>
                    </div>
                  ))
                }
                {/* <div className=" absolute top-36  h-1 w-[100vw] bg-black"></div> */}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default page;
