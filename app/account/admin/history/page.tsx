"use client";
import React, { useEffect, useState } from "react";
import useHistory from "@/service/history";
import useAuth from "@/service/auth";
import { Button } from "@/components/animate-ui/primitives/buttons/button";

export default function Page() {
  const _history = useHistory();

  // Initialize state to hold the fetched dashboard data
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalOrders: 0,
      totalCustomers: 0,
      completedTotalTHB: 0,
      cancelledTotalTHB: 0,
    },
    orders: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch data when the component mounts
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await _history.getDashboard();
      // console.log(data);

      // Assuming your getDashboard() returns { summary: {...}, orders: [...] }
      if (data) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const Logout = async () => {
    const _auth = useAuth();
    const res = await _auth.logout();
    if (res.logout) {
      window.location.href = "/login";
      return;
    }
    return;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []); // Empty dependency array ensures this runs once on mount

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center font-sans">
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  function convertToThaiDateTime(isoString) {
    const date = new Date(isoString);

    const formatted = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Bangkok",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Forces 24-hour format
    }).format(date);

    // Removes the comma that en-GB adds by default
    return formatted.replace(",", "");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-gray-700">
          <span className="font-semibold text-gray-900">Sale History</span>{" "}
          Welcome to <span className="font-bold text-gray-900">ELVIOGROUP</span>{" "}
          Admin
        </h1>
        <Button
          onClick={Logout}
          className="bg-black cursor-pointer text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          LOGOUT
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Sales Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <h2 className="text-gray-600 font-medium mb-1">Total Sales</h2>
          <div className="text-gray-500 text-lg mb-1">
            <span className="text-2xl font-semibold text-gray-800">
              {dashboardData.summary.totalOrders}
            </span>{" "}
            Orders
          </div>
          <div className="text-xl font-bold text-gray-800">
            {dashboardData.summary.completedTotalTHB.toLocaleString()}{" "}
            <span className="text-gray-500 font-normal text-lg">THB</span>
          </div>
        </div>

        {/* Status Breakdown Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <div className="mb-2">
            <div className="text-green-600 font-medium text-lg">Completed</div>
            <div className="text-2xl font-bold text-gray-800">
              {dashboardData.summary.completedTotalTHB.toLocaleString()}{" "}
              <span className="text-gray-500 font-normal text-lg">THB</span>
            </div>
          </div>
          <div>
            <div className="text-red-500 text-sm">cancelled</div>
            <div className="text-red-400 text-sm">
              {dashboardData.summary.cancelledTotalTHB.toLocaleString()} THB
            </div>
          </div>
        </div>

        {/* Total Customers Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <h2 className="text-gray-600 font-medium mb-1">Total Customers</h2>
          <div className="text-gray-500 text-lg">
            <span className="text-2xl font-semibold text-gray-800">
              {dashboardData.summary.totalCustomers}
            </span>{" "}
            Customers
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-6 text-gray-400 font-normal w-32">
                  Order ID
                </th>
                <th className="py-4 px-6 text-gray-400 font-normal w-32">
                  Date
                </th>
                <th className="py-4 px-6 text-gray-400 font-normal w-48">
                  Customer
                </th>
                <th className="py-4 px-6 text-gray-400 font-normal">Item</th>
                <th className="py-4 px-6 text-gray-400 font-normal w-32">
                  Total
                </th>
                <th className="py-4 px-6 text-gray-400 font-normal w-32">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="py-4 px-6 font-medium text-gray-800">
                    {order.orderId}
                  </td>
                  <td className="py-4 px-6 text-gray-800 text-center">
                    {convertToThaiDateTime(order.sold_at)}
                  </td>
                  <td className="py-4 px-6 text-gray-800">
                    {/* customerName is now directly provided by the API backend */}
                    {order.customerName || "Unknown"}
                  </td>
                  <td className="py-4 px-6">
                    {order.products?.map((product, idx) => (
                      <div key={idx} className="mb-1 last:mb-0">
                        <span className="text-gray-800 font-medium">
                          {product.productName}{" "}
                          <span className="text-gray-400 font-normal text-sm">
                            X{product.quantity}
                          </span>
                        </span>
                        {/* <div className="text-gray-400 text-sm">
                          {product.category || "Item"}
                        </div> */}
                      </div>
                    ))}
                  </td>
                  <td className="py-4 px-6 text-gray-800 font-medium">
                    {Number(order.totalPrice).toLocaleString()}{" "}
                    <span className="text-gray-500 font-normal text-sm">
                      THB
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`${
                        order.status === "complete"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Fallback if no orders exist */}
          {dashboardData.orders.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No recent sales history found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
