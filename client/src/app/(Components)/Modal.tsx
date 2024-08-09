
import React, { useState } from "react";
 {/*@ts-ignore*/ }
const Modal = ({ storedBeer, setData, getindex, data ,setIsOpen}) => {
  const [name, setName] = useState(storedBeer.name);
  const [price, setPrice] = useState(storedBeer.price);
 
 {/*@ts-ignore*/ }
  const handleSubmit = (e) => {
    e.preventDefault();
     {/*@ts-ignore*/ }
    setData((prev) => {
      const newArr = [...prev];
      const obj = { ...newArr[getindex] };
      obj.price = price;
      obj.name = name;
      console.log(obj);
      newArr[getindex] = obj;
      return newArr;
    });
    setIsOpen(false);
  };

const handleClose=()=>{
setIsOpen(false)
}

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full h-50% relative">
        <h2>Update Beer</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button type="submit">Save</button>
          <button onClick={handleClose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
