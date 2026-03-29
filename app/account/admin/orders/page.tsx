"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { useEffect, useState } from "react";
import useOrder from "@/service/order";
import useAuth from "@/service/auth";
import OrderPopup from "./OrderPopup";

const Logout = async () => {
  const _auth = useAuth();
  const res = await _auth.logout();
  if (res.logout) {
    window.location.href = "/login";
    return;
  }
  return;
};

export default function Page() {
  const [orders, setOrders] = useState([]);
  const _order = useOrder();

  const [search, setSearch] = useState<Number>();

  const [selectedOrder, setSelectedOrder] = useState(null);

  const initOrder = async () => {
    const freshOrders = await _order.getAllOrder();
    setOrders(freshOrders);
  };

  useEffect(() => {
    initOrder();
  }, []);

  const formatDate = (isoString) => {
    // const date = new Date(isoString);
    // return date.toLocaleDateString("en-GB", {
    //   day: "numeric",
    //   month: "short",
    //   year: "numeric",
    // });

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
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const res = await _order.updateStatus({
      orderId: orderId,
      status: newStatus,
    });

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order,
      ),
    );

    setSelectedOrder(null);
  };

  const color = (status: String) => {
    if (status === "pending") {
      return "bg-amber-300";
    } else if (status === "paid") {
      return "bg-green-500";
    } else if (status === "delivered") {
      return "bg-blue-500";
    } else if (status === "cancelled") {
      return "bg-red-500";
    } else if (status === "complete") {
      return "bg-green-500";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8 text-gray-800 rounded-2xl">
        <div className="flex justify-between">
          <h1 className="text-2xl">
            <strong>Order</strong>
            <br />
            Manage and Track customer orders.
          </h1>
          <Button className="text-lg p-5 cursor-pointer" onClick={Logout}>
            LOGOUT
          </Button>
        </div>
        <div className="w-9.5/10 mt-5 mx-2 text-black">
          <div className="relative">
            <input
              type="text"
              className=" block w-full p-3 ps-9 bg-neutral-secondary-medium border text-heading border-black
                    text-lg rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body rounded-3xl"
              placeholder="Search Order Id"
              onChange={() => {
                setSearch(Number(event.target.value));
              }}
              suppressHydrationWarning={true}
            />
            <button
              type="button"
              className="absolute inset-e-1.5 bottom-1.5 text-xl border-transparent shadow-xs font-medium leading-5 rounded px-3 py-1.5 focus:outline-none hover:cursor-pointer"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-1" />
              {""}
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <div className="w-full mx-auto bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100">
            <table className="w-full border-collapse">
              {/* ส่วนหัวตาราง (Table Header) */}
              <thead className="text-gray-400">
                <tr className="border-b  border-gray-300 h-16">
                  {/* กำหนดความสูงแถว */}
                  <th className="w-[10%] align-middle text-left pl-5">
                    Order Id
                  </th>
                  <th className="w-[10%] align-middle text-center">
                    Customer Id
                  </th>
                  <th className="w-[10%] align-middle text-center">Date</th>
                  <th className="w-[10%] align-middle text-center">Total</th>
                  <th className="w-[10%] align-middle text-center">Status</th>
                  <th className="w-[10%] align-middle text-center">Action</th>
                </tr>
              </thead>

              {/* ส่วนเนื้อหา (Table Body) */}
              {orders && (
                <tbody className="">
                  {orders
                    .sort((a, b) => b.orderId - a.orderId)
                    .filter((order) => {
                      if (!search) {
                        return order;
                      } else if (order.orderId === search) {
                        return order;
                      }
                    })
                    .map((order, index) => {
                      return (
                        <tr
                          className="border-b border-gray-200"
                          key={order.orderId}
                        >
                          <td className="py-6 px-5">
                            {/* <div>
                                <h1 className="">{product.productName}</h1>
                              </div> */}
                            <div className="flex">
                              {/* <div className="w-22 h-17">
                            <ImageById
                              imageId={product.imageIds[0]}
                              className={""}
                              orientation=""
                            />
                          </div> */}
                              <h1 className="ml-3 text-xl">{order.orderId}</h1>
                            </div>
                          </td>
                          <td className="py-6 px-4 align-top text-center text-xl leading-relaxed">
                            <p>{order.userId}</p>
                          </td>
                          <td className="py-6 text-center align-top text-xl text-gray-500">
                            {formatDate(order.date)}
                          </td>
                          <td className="py-6 text-center align-top text-xl">
                            {order.totalPrice.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-6 flex justify-center align-top text-xl ">
                            <div className="w-1/2 text-center ">
                              <div
                                className={`py-2 rounded-lg text-white text-sm
                              ${color(order.status)}
                            `}
                              >
                                {order.status}
                              </div>
                            </div>
                          </td>
                          <td className="py-6 text-center align-top text-xl">
                            <Button
                              className="hover:cursor-pointer select-none "
                              onClick={() => setSelectedOrder(order)}
                            >
                              View / Edit
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              )}
            </table>
            {orders.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No recent order found.
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="">
          <div className="fixed inset-0 z-20 bg-black/50"></div>
          <OrderPopup
            order={selectedOrder}
            onClose={() => {
              setSelectedOrder(null);
              initOrder();
            }}
            onSave={handleUpdateStatus}
          />
        </div>
      )}
    </>
  );
}
