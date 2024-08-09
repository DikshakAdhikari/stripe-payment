"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Modal from "./Modal";
import Filter from "./Filter";
import Pagination from "./Pagination";

const HomePage = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [count, setCount] = useState(0);
  const [storedBeer, setBeer] = useState({});
  const [getindex, setIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [arr, setArr] = useState([]);
  const [loggedIn, setIsLoggedIn] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3002/books/allBooks", {
        method: "GET",
      });
      const result = await res.json();
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
  const handleAdd = (beer) => {
    setArr((prev) => {
      const b = [...prev];
      //@ts-ignore
      b.push({ bookname: beer.bookname, price: beer.price, image: beer.image });
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
      <Navbar count={count} setCount={setCount} arr={arr} />
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
                  {/* {loggedIn && (
                    <div className="mt-6 flex justify-between items-center">
                      <button
                        onClick={() => handleDelete(beer.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded shadow-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleUpdate(beer, index)}
                        className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600"
                      >
                        Update
                      </button>
                    </div>
                  )} */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1">
                    <button
                      className="px-2 py-0 bg-gray-300 text-gray-700 rounded shadow-md hover:bg-gray-400"
                      onClick={handleSub}
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleAdd(beer)}
                      className="px-2 py-0 bg-green-500 text-white rounded shadow-md hover:bg-green-600"
                    >
                      +
                    </button>
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
