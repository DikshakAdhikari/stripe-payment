"use client";
import Image from "next/image";
import React, { useState } from "react";
import bg from "../../../public/image.png";
import Cart from "./Cart";
import { useRouter } from "next/navigation";
//@ts-ignore
const Navbar = ({ count, setCount ,arr, setArr}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
// console.log(arr);
  const token=  localStorage.getItem('token')
  const router= useRouter()  
  const handleOpen = () => {
    setIsCartOpen(!isCartOpen);
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
        {count > 0 && (
          <div className="absolute top-[-12px] bg-red-500 rounded-full right-0 left-3  flex items-center justify-center w-6 h-6  text-white text-xs ">
            {count}
          </div>
        )}
      </div>
      {isCartOpen &&  <Cart isOpen={isCartOpen} toggleDrawer={handleOpen} arr={arr} setArr={setArr} setCount={setCount} />}
    </div>
  );
};

export default Navbar;
