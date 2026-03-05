import React from "react";

export default function OrderCard({ order }) {
  // Default fallback data to demonstrate the component if no prop is passed
  const currentOrder = order;

  const orderSteps = ["order Placed", "pending", "paid", "delivered"];

  // Find the index of the current status to calculate progress
  const currentStatusIndex = orderSteps.indexOf(currentOrder.status);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <div className="max-w-md w-full bg-[#f0f0f0] p-6 rounded-lg font-sans text-gray-800 shadow-sm border border-gray-200">
      {/* Header Section */}
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Order #{currentOrder.orderId}
        </h2>
        <span className="text-sm text-gray-500">
          {formatDate(currentOrder.date)}
        </span>
      </div>

      <hr className="border-gray-300 pb-4" />

      {/* Status Section */}
      <div className="pb-6">
        <h3 className="text-sm text-gray-700 mb-4 font-medium">Status</h3>

        {/* Progress Bar Container */}
        <div className="relative flex justify-between items-center px-2 sm:px-4">
          {/* Background Line (Inactive) */}
          <div className="absolute top-[6px] left-8 right-8 h-0.5 bg-gray-300 z-0">
            {/* Foreground Line (Active) */}
            <div
              className="h-full bg-black transition-all duration-500 ease-in-out"
              style={{
                width: `${(Math.max(0, currentStatusIndex) / (orderSteps.length - 1)) * 100}%`,
              }}
            ></div>
          </div>

          {/* Status Nodes */}
          {orderSteps.map((step, index) => {
            const isCompleted = index <= currentStatusIndex;

            return (
              <div key={index} className="flex flex-col items-center z-10 w-16">
                <div
                  className={`w-3.5 h-3.5 rounded-full mb-2 outline outline-2 outline-[#f0f0f0] transition-colors duration-500 
                    ${isCompleted ? "bg-black" : "bg-gray-300"}`}
                ></div>
                <span
                  className={`text-[11px] sm:text-xs text-center capitalize whitespace-nowrap transition-colors duration-500
                    ${isCompleted ? "text-gray-900 font-medium" : "text-gray-500"}`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <hr className="border-gray-300 pb-4" />

      {/* Item Section */}
      <div className="pb-8">
        <h3 className="text-sm text-gray-700 mb-3 font-medium">Item</h3>
        {currentOrder.products.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-sm mb-2 last:mb-0"
          >
            <div>
              <span className="text-gray-900">{item.productName} </span>
              <span className="text-gray-400">x{item.quantity}</span>
            </div>
            <span className="text-gray-900 font-medium">
              {item.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
      </div>

      <hr className="border-gray-300 pb-4" />

      {/* Total Section */}
      <div className="flex justify-between items-center text-sm font-bold text-gray-900">
        <span>Total</span>
        <span>
          {currentOrder.totalPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );
}
