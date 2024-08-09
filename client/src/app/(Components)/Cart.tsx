import React from "react";
//@ts-ignore
const Cart = ({ isOpen, toggleDrawer, arr }) => {
  let totalPrice = 0;
  for (let i = 0; i < arr.length; i++) {
    totalPrice += arr[i].price;
  }
  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"}`}style={{ zIndex: 9999 }}>

        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Cart</h2>

          {arr.length > 0 ? (
            //@ts-ignore
            arr.map((item, index) => (
              <div key={index} className="mb-2 flex items-center space-x-4">
              
                <div className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.bookname}
                    className="h-16 w-16 object-cover" 
                  />
                </div>
                <div>
                  <div className="font-bold">{item.bookname}</div>
                  <div className="text-gray-600">${item.price}</div>{" "}
               
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
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
