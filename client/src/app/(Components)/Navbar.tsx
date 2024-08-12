"use client";
import Image from "next/image";
import React, { useState } from "react";
import bg from "../../../public/image.png";
import Cart from "./Cart";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./GlobalRedux/store";
import { reset } from "./GlobalRedux/Features/CounterSlice";
//@ts-ignore
const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartCount = useSelector((state: RootState) => state.count);
  const dispatch: AppDispatch = useDispatch();
  const token=  localStorage.getItem('token')
  const router= useRouter()  
  const handleOpen = () => {
    
    if(token){
      dispatch(reset())
      setIsCartOpen(!isCartOpen);
    }else{
      router.push('/login')
    }
  };

  return (
    <div className="p-4 sticky top-0 bg-black flex justify-between items-center "style={{ zIndex: 9999 }}>
      <div className="text-white">Books</div>
      <div className="relative cursor-pointer" onClick={handleOpen}>
        <Image        
          src={bg}
          alt="Cart"
          width={30}
          height={30}
        />
        {cartCount.value > 0 && (
          <div className="absolute top-[-12px] bg-red-500 rounded-full right-0 left-3  flex items-center justify-center w-6 h-6  text-white text-xs ">
            {cartCount.value}
          </div>
        )}
      </div>
      {(isCartOpen && token) && <Cart isOpen={isCartOpen} toggleDrawer={handleOpen} />}
    </div>
  );
};

export default Navbar;
