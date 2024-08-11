import React from "react";

interface Book {
  id: number;
  bookname: string;
  price: number;
  image: string;
  bookCount: number;
}

interface CartProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  arr: Book[];
  setArr: React.Dispatch<React.SetStateAction<Book[]>>;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

const Cart = ({ isOpen, toggleDrawer, arr, setArr, setCount }: CartProps) => {
  // Calculate total price based on quantities
  const totalPrice = arr.reduce((acc, item) => acc + item.price * item.bookCount, 0);

  // Handle increment for a specific book
  const handleIncrement = (index: number) => {
    const updatedArr = arr.map((item, idx) =>
      idx === index ? { ...item, bookCount: item.bookCount + 1 } : item
    );
    setArr(updatedArr);
    setCount((prevCount) => prevCount + 1); // Update total count if needed
  };

  // Handle decrement for a specific book
  const handleDecrement = (index: number) => {
    const updatedArr = arr.map((item, idx) => {
      if (idx === index) {
        const newCount = item.bookCount - 1;
        return { ...item, bookCount: newCount };
      }
      return item;
    }).filter((item) => item.bookCount > 0); // Filter out items with 0 count

    setArr(updatedArr);
    setCount(updatedArr.reduce((acc, item) => acc + item.bookCount, 0)); // Update total count
  };

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-[70%] bg-white transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Cart</h2>

          {/* Scrollable content */}
          <div className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
            {arr.length > 0 ? (
              arr.map((item, index) => (
                <div key={item.id} className="mb-2 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img src={item.image} alt={item.bookname} className="h-16 w-16 object-cover" />
                  </div>
                  <div>
                    <div className="font-bold">{item.bookname}</div>
                    <div className="text-gray-600">${item.price}</div>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleDecrement(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                      >
                        -
                      </button>
                      <span>{item.bookCount}</span>
                      <button
                        onClick={() => handleIncrement(index)}
                        className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>

          {arr.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={toggleDrawer}
          style={{ zIndex: 1000 }}
        ></div>
      )}
    </>
  );
};

export default Cart;
