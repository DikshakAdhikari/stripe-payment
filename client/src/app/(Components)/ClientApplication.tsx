"use client";

import { useEffect } from "react";
import { verifyToken } from "./verifyToken";

//@ts-ignore
export default function ClientApplication({ children }) {
  useEffect(() => {
    try{
       verifyToken().then(()=>{ console.log("Token verification successul!")}).catch((err)=> console.log(err))    
    }catch(err){
        console.log(err);
        
    }
  },[]);

  return children;
}