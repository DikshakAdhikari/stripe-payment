"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Modal from "./Modal";
import Filter from "./Filter";
import Pagination from "./Pagination";

const HomePage = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [count, setCount] = useState(0);
  const [storedBeer, setBeer] = useState({});
  const [getindex, setIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [arr, setArr] = useState([]);
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [getDisable, setDisable]= useState([])

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3002/books/allBooks", {
        method: "GET",
      });
      const result = await res.json();
      console.log(result);
      const arr= new Array(result.length).fill(false)
      // @ts-ignore
      setDisable(arr)
      setData(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
//@ts-ignore
  const handleAdd = (beer, index) => {
    setArr((prev) => {
      const b = [...prev];
      //@ts-ignore
      b.push({ bookname: beer.bookname, price: beer.price, image: beer.image, quantity:1 });
      // @ts-ignore
      setDisable((prev)=> {
        let newArr= [...prev]
        // @ts-ignore
        prev[index]= true
        return prev;
      })
      return b;
    });
    setCount(count + 1);
  };

  const handleSub = () => {
    setCount(count > 0 ? count - 1 : 0);
  };
//@ts-ignore
  const handleDelete = (id) => {
    //@ts-ignore
    setData((prev) => prev.filter((item) => item.id !== id));
  };
//@ts-ignore
  const handleUpdate = (beer, index) => {
    setBeer(beer);
    setIndex(index);
    setIsOpen(true);
  };

  return (
    <div>
      <Navbar count={count} setCount={setCount} arr={arr} setArr={setArr} />
      <div className="flex h-[100vh]">
        <div className="w-[15%] p-6 bg-gray-100">
          <Filter setData={setData} currentItems={currentItems} />
        </div>
        <div className="w-[85%] bg-gray-50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((beer, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 flex h-40"
              >
                <div className="w-2/5">
                  <img
                  //@ts-ignore
                    src={beer.image}
                    className="h-[100%] w-[120%]"
                    //@ts-ignore
                    alt={beer.bookname}
                  />
                </div>
                <div className="w-3/5 p-1">
                  <h2 className="text-xl font-bold text-gray-800 mt-4 text-center">
                   {/* @ts-ignore*/}
                    {beer.bookname}
                  </h2>
                  <p className="mt-4 text-lg font-semibold text-gray-800 text-center">
                      {/* @ts-ignore*/}
                    ${beer.price}
                  </p>
                  <div className={` absolute bottom-2 right-2 flex items-center gap-1`}>
                    <button disabled={getDisable[index] && true} onClick={() => handleAdd(beer, index)} className={`  ${getDisable[index] ? 'bg-gray-600' : "bg-blue-600"} bg-blue-600 p-3 rounded-lg text-white`}> {getDisable[index] ? "Added to Cart" : "Add To Cart" } </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Pagination
        data={data}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      {isOpen && (
        <Modal
          storedBeer={storedBeer}
          setData={setData}
          getindex={getindex}
          data={data}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};

export default HomePage;
