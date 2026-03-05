"use client";
import { useState, useEffect } from "react";
import useProduct from "@/service/product";
import useUser from "@/service/user";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Logout } from "./action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const _user = useUser();
  const _product = useProduct();

  // 1. Loading State
  const [isLoading, setIsLoading] = useState(true);

  // 2. Data States
  const [revenue, setRevenue] = useState({
    total: 0,
    increaseAmount: 0,
    increasePercent: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
    cancelRate: 0,
  });

  const [orders, setOrders] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    change: 0,
    growthRate: 0,
    avgDaily: 0,
  });

  const [customers, setCustomers] = useState({
    total: 0,
    newThisMonth: 0,
    repeatRate: 0,
  });

  const [products, setProducts] = useState({
    bestSeller: { name: "-", sold: 0, growth: 0 },
    lowPerformer: { name: "-", sold: 0, growth: 0 },
  });

  // Calculate current month and year dynamically (e.g. "Mar 2026")
  const currentMonthYear = new Date().toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  // 3. Data Fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Safely map the API response to the state
        if (data.revenue) setRevenue(data.revenue);
        if (data.orders) setOrders(data.orders);
        if (data.customers) setCustomers(data.customers);
        if (data.products) setProducts(data.products);
      } catch (error) {
        console.error("Failed to load dashboard metrics:", error);
      } finally {
        // Stop loading whether the request succeeds or fails
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      {/* Header (Always Visible) */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl text-gray-600">
          <strong className="text-black">Dashboard</strong> Welcome to{" "}
          <strong className="text-black">ELVIOGROUP</strong> Admin
        </h1>
        <Button className="bg-black text-white px-6 py-2 rounded-md font-bold tracking-wide">
          LOGOUT
        </Button>
      </div>

      {/* Conditional Rendering: Spinner OR Dashboard Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          {/* Tailwind CSS Spinner */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-500 animate-pulse">
            Loading Dashboard Data...
          </h2>
        </div>
      ) : (
        <>
          {/* Top Row: 3 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Card 1: Revenue Comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Revenue Comparison
              </h2>
              <div className="text-4xl font-bold mb-2">
                {revenue?.total?.toLocaleString("en-US") || 0} THB
              </div>
              <div className="text-green-500 font-semibold mb-4">
                ↑ {revenue?.increasePercent || 0}%{" "}
                <span className="text-gray-400 text-sm font-normal">
                  last month
                </span>
              </div>
              <hr className="my-2 border-gray-200" />
              <p className="text-sm text-gray-500 mt-2">
                Revenue Increased by{" "}
                <strong className="text-gray-700">
                  {revenue?.increaseAmount?.toLocaleString("en-US") || 0} THB
                </strong>{" "}
                compared to last month.
              </p>
            </div>

            {/* Card 2: Financial Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Financial Breakdown
              </h2>
              <hr className="border-gray-200 mb-4" />
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Completed</span>
                <strong className="text-black">
                  {revenue?.completed?.toLocaleString("en-US") || 0} THB
                </strong>
              </div>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Pending</span>
                <strong className="text-black">
                  {revenue?.pending?.toLocaleString("en-US") || 0} THB
                </strong>
              </div>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Cancelled</span>
                <strong className="text-black">
                  {revenue?.cancelled?.toLocaleString("en-US") || 0} THB
                </strong>
              </div>
              <div className="mt-auto border border-gray-200 rounded-md p-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {/* <div className="w-4 h-4 bg-black rounded-sm"></div>  */}
                  <FontAwesomeIcon icon={faBagShopping} />
                  <span className="text-gray-600">Cancelled Rate :</span>
                </div>
                <strong>{revenue?.cancelRate || 0}%</strong>
              </div>
            </div>

            {/* Card 3: Orders Growth */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Orders Growth
                </h2>
                {/* Dynamically inserted Date here */}
                <span className="text-gray-400">{currentMonthYear}</span>
              </div>
              <div className="border border-gray-200 rounded-md flex flex-col mb-4">
                <div className="flex border-b border-gray-200">
                  <div className="w-1/3 p-4 border-r border-gray-200 flex flex-col justify-center items-center">
                    <span className="text-4xl font-bold">
                      {orders?.total || 0}
                    </span>
                    <span className="text-gray-600">Orders</span>
                    <span className="text-green-500 text-sm font-semibold mt-1">
                      ↑ {orders?.change || 0} increase
                    </span>
                  </div>
                  <div className="w-2/3 grid grid-cols-2">
                    <div className="p-3 border-r border-b border-gray-200 flex flex-col items-center">
                      <span className="text-xs text-gray-500">This Month</span>
                      <strong className="text-xl">
                        {orders?.thisMonth || 0}
                      </strong>
                    </div>
                    <div className="p-3 border-b border-gray-200 flex flex-col items-center">
                      <span className="text-xs text-gray-500">Last Month</span>
                      <strong className="text-xl">
                        {orders?.lastMonth || 0}
                      </strong>
                    </div>
                    <div className="p-3 border-r border-gray-200 flex flex-col items-center">
                      <span className="text-xs text-gray-500">Change</span>
                      <strong className="text-xl">{orders?.change || 0}</strong>
                    </div>
                    <div className="p-3 flex flex-col items-center">
                      <span className="text-xs text-gray-500">Growth Rate</span>
                      <strong className="text-xl text-green-500">
                        {orders?.growthRate || 0}%
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="border-gray-200 mb-2" />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Average Daily Orders: {orders?.avgDaily || 0} orders/day
              </p>
            </div>
          </div>

          {/* Bottom Row: 2 Columns (1/3 and 2/3 ratio) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 4: Customer Insight */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-1">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Customer Insight
              </h2>
              <hr className="border-gray-200 mb-4" />
              <div className="flex justify-between py-3 border-b border-gray-100 text-gray-600">
                <span>Total Customers</span>
                <strong className="text-black">{customers?.total || 0}</strong>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100 text-gray-600">
                <span>New this Month</span>
                <strong className="text-black">
                  +{customers?.newThisMonth || 0}
                </strong>
              </div>
              <div className="flex justify-between py-3 text-gray-600">
                <span>Repeat Purchase Rate</span>
                <strong className="text-black">
                  {customers?.repeatRate || 0}%
                </strong>
              </div>
            </div>

            {/* Card 5: Product Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2 flex flex-col">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Product Performance
              </h2>
              <hr className="border-gray-200 mb-4" />

              <div className="flex flex-1 divide-x divide-gray-200">
                {/* Best Seller */}
                <div className="w-1/2 pr-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-gray-700 font-semibold mb-2">
                      Best Seller
                    </h3>
                    <p className="text-lg font-bold">
                      {products?.bestSeller?.name || "-"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {products?.bestSeller?.sold || 0} units sold
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <span className="text-gray-600">Growth Rate</span>
                    <strong className="text-green-500">
                      {products?.bestSeller?.growth || 0}%
                    </strong>
                  </div>
                </div>

                {/* Low Performance */}
                <div className="w-1/2 pl-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-gray-700 font-semibold mb-2">
                      Low Performance
                    </h3>
                    <p className="text-lg font-bold">
                      {products?.lowPerformer?.name || "-"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {products?.lowPerformer?.sold || 0} units sold
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <span className="text-gray-600">Growth Rate</span>
                    <strong className="text-black">
                      {products?.lowPerformer?.growth || 0}%
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
