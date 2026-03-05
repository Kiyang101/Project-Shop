"use client";
import { use, useState, useEffect } from "react";
import OrderCard from "./OrderCard";
import useOrder from "@/service/order";

export default function Page() {
  const _order = useOrder();
  const [orders, setOrders] = useState(null);

  const [activeTab, setActiveTab] = useState("all");
  const tabs = ["all", "pending", "paid", "delivered", "cancel"];

  const initOrder = async () => {
    const order = await _order.getOrder();
    console.log(order);
    setOrders(order);
  };

  useEffect(() => {
    initOrder();
  }, []);

  if (!orders) {
    return <div>Loading...</div>;
  }

  // Mock data matching the screenshot
  // const orders = [
  //   {
  //     id: "001",
  //     date: "20 Apr 2026",
  //     status: "Delivered",
  //     items: [
  //       { name: "Rayna Pleated Midi Dress", qty: 1, price: "16,000 THB" },
  //     ],
  //     total: "16,000 THB",
  //   },
  //   {
  //     id: "05",
  //     date: "27 Apr 2026",
  //     status: "Paid",
  //     items: [
  //       { name: "Cecelia Sculpted Seam Dress", qty: 1, price: "14,000 THB" },
  //       {
  //         name: "Asava Floral-lace Cropped Jacket",
  //         qty: 1,
  //         price: "28,000 THB",
  //       },
  //     ],
  //     total: "42,000 THB",
  //   },
  // ];

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans">
      {/* Custom Header with Side Lines */}
      <div className="flex items-center justify-center mb-8">
        <hr className="w-20 border-gray-400" />
        <h1 className="mx-4 text-lg font-medium text-gray-700 tracking-widest uppercase">
          Order Status
        </h1>
        <hr className="w-20 border-gray-400" />
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#e5e5e5] inline-flex rounded-t-md mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "border-b-2 border-black text-black"
                : "text-gray-600 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders
          .filter((order) => activeTab === "all" || order.status === activeTab)
          .map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
      </div>
    </div>
  );
}
