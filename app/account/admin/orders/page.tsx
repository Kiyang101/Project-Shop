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

  const [selectedOrder, setSelectedOrder] = useState(null);

  const initOrder = async () => {
    const freshOrders = await _order.getAllOrder();
    setOrders(freshOrders);
  };

  useEffect(() => {
    initOrder();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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

  return (
    <>
      <div className="flex justify-between ml-10">
        <h1 className="text-2xl">
          <strong>Order</strong>
          <br />
          Manage and Track customer orders.
        </h1>
        <Button className="text-lg p-5" onClick={Logout}>
          LOGOUT
        </Button>
      </div>
      <div className="w-9.5/10 mt-5 mx-10">
        <form className="text-black">
          <div className="relative">
            <input
              type="text"
              id="search"
              className=" block w-full p-3 ps-9 bg-neutral-secondary-medium border text-heading border-black
                    text-lg rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body rounded-3xl"
              placeholder="Search Order"
              required
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
        </form>
      </div>
      <div className="flex justify-center mt-5">
        <div className="w-[95%] mx-auto bg-white">
          <table className="w-full border-collapse">
            {/* ส่วนหัวตาราง (Table Header) */}
            <thead className="bg-gray-300">
              <tr className="border-b  border-gray-300 h-16 uppercase">
                {/* กำหนดความสูงแถว */}
                <th className="w-[25%] align-middle text-left pl-5">
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
                {orders.map((order, index) => {
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
                      <td className="py-6 text-center align-top text-xl text-gray-500 uppercase">
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
                            className={`py-1 rounded-lg text-white
                          ${order.status === "cancel" ? "bg-red-500" : "bg-green-500"}
                            
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
        </div>
      </div>

      {selectedOrder && (
        <div className="">
          <div className="fixed inset-0 z-20 bg-black/50"></div>
          <OrderPopup
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onSave={handleUpdateStatus}
          />
        </div>
      )}
    </>
  );
}
