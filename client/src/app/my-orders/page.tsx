"use client"
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../(Components)/base'
import Navbar from '../(Components)/Navbar'

const page = () => {
    const [orders, setOrders]= useState([])
    const fun= async()=> {
        try{
            const res= await fetch(`${BASE_URL}/user/orders`,{
                method:"GET",
                // @ts-ignore
                headers:{
                    "Content-Type":"application/json",
                    "authorization": localStorage.getItem('token')
                }
            });
            if(!res.ok){
                throw new Error("Network problem!")
            }
            const data= await res.json()
            console.log(data.myOrders);
            setOrders(data.myOrders)
            
        }catch(err){
            console.log(err);  
        }
    }
    useEffect(()=> {
       fun()
    },[])
  return (
    <div>
      <Navbar />
    </div>
  )
}

export default page
