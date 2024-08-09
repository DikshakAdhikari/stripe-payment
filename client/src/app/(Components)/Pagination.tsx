import React from "react";
//@ts-ignore
const Pagination = ({ data, itemsPerPage, currentPage, setCurrentPage }) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };
  return (
    <div className="flex justify-center gap-2">
      <button
        onClick={handlePrev}
        className="bg-blue-300 px-2 py-2 rounded-md "
      >
        Prev
      </button>
      <div className=" px-2 py-2">{currentPage}</div>
      <button
        onClick={handleNext}
        className="bg-blue-300 px-2 py-2 rounded-md "
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
