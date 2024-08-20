"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { BASE_URL } from '../(Components)/base';
import { useDispatch } from 'react-redux';
import { resetBooks } from '../(Components)/GlobalRedux/Features/BookSlice';

const Login = () => {
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch= useDispatch()

  const router=useRouter();
//@ts-ignore
  const handleLogin=async(e)=>{
    e.preventDefault();
    try {
      const res=await fetch(`${BASE_URL}/user/login`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({email,password})
      })
      const data=await res.json();
      dispatch(resetBooks())
  localStorage.setItem("token",data.token);
  
  router.push("/")
    } catch (error) {
      console.log(error);
      
    }
    
  }
  return (
    <div className="flex flex-col  h-[100vh]">
      <div className="flex justify-center items-center h-[86vh] ">
        <div className="bg-white p-8 py-10 shadow-md rounded-md w-[26%]">
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 focus:outline-none"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login