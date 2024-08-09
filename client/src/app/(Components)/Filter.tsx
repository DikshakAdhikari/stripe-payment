"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
//@ts-ignore
const Filter = ({setData,currentItems}) => {
  const [categories, setCategories] = useState({
    fiction: false,
    nonfiction: false,
    drama: false,
    comics: false,
  });

  const router = useRouter();
  // console.log(router);
   {/*@ts-ignore*/ }
  const handleChange = (e, category) => {
    console.log(category);
    setCategories((prev) => {
      const options = { ...prev };
         {/*@ts-ignore*/ }
      options[category] = !options[category];
      router.replace(`?category=${category}`);
      return options;
    });

    
   
    // const arr = [];
    // for (let filteredItem in categories) {
    //   if (categories[filteredItem] === true) {
    //     const a = arr.find((value) => {
    //       value === filteredItem;
    //     });
        
    //       arr.push(filteredItem);
     
    //   }
    // }

    // arr.push(category);
    // console.log(arr);
  };
  console.log(categories);

  const filteredProduct=async()=>{
    const arry=[]
    for(let items in categories){
         {/*@ts-ignore*/ }
      if(categories[items]===true){
        arry.push(items)
      }
    }
    console.log(arry);
    let str = '';
    for(let i = 0; i < arry.length; i++){
      str += arry[i];
      str += ',';
    }
    
    console.log(str);
    
    try {
      const res=await fetch(`http://localhost:3002/books/allBooks?category=${str}`,{
        method:"GET"
      })
      const data=await res.json();
      // console.log(data);
      setData(data);
      
    } catch (error) {
      
    }
  }
useEffect(()=>{
filteredProduct()
},[categories])
  return (
    <div>
      {Object.keys(categories).map((category) => (
        <div key={category}>
          <label>
            <input
              type="checkbox"
              name="category"
              //@ts-ignore
              value={categories[category]}
              onChange={(e) => {
                handleChange(e, category);
              }}
            />
            {category}
          </label>
        </div>
      ))}
    </div>
  );
};
export default Filter;
