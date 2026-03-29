import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { CancelOrder_handler, CompleteOrder_handler } from "./action";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  type AlertDialogContentProps,
} from "@/components/animate-ui/components/radix/alert-dialog";
// --- MODAL COMPONENT ---
export default function OrderPopup({ order, onClose, onSave }) {
  // Local state to track the dropdown selection before saving
  const [currentStatus, setCurrentStatus] = useState(order.status);

  // console.log(order);

  if (!order) return null;

  const handleSave = () => {
    onSave(order.orderId, currentStatus);
  };

  const handleComplete = async () => {
    const res = await CompleteOrder_handler(order);
    if (res?.message === "success") {
      onClose();
      // window.location.reload();
    }
  };
  const handleCancel = async () => {
    const res = await CancelOrder_handler(order);
    if (res?.message === "success") {
      onClose();
      // window.location.reload();
    }
  };

  return (
    <div className="fixed w-full inset-0 z-20 flex items-center justify-center">
      {/* Changed: max-w-2xl to max-w-lg, and max-h-[90vh] to max-h-[75vh] */}
      <div className="bg-white rounded-lg shadow-xl w-1/3 p-6 m-4 max-h-[75vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Order #{order.orderId}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faXmark}
              onClick={onClose}
              className="text-2xl"
            />
            {""}
          </button>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="text-gray-500">User ID</p>
            <p className="font-semibold text-gray-800">{order.userId}</p>
          </div>
          <div>
            <p className="text-gray-500">Date</p>
            <p className="font-semibold text-gray-800">
              {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Total Price</p>
            <p className="font-semibold text-green-600">
              ฿{" "}
              {order.totalPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Products List */}
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-3 text-gray-800">
            Products
          </h3>
          <div className="bg-gray-50 rounded-lg p-3 border text-sm">
            {order.products.map((prod, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {prod.productName}{" "}
                    <span className="text-gray-500 text-xs">
                      (Size: {prod.size})
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">ID: {prod.productId}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-800">
                    {prod.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    THB x {prod.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Update & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label
              htmlFor="status"
              className="font-semibold text-gray-700 text-sm"
            >
              Status:
            </label>
            <select
              id="status"
              value={currentStatus}
              disabled={
                order.status === "cancelled" || order.status === "complete"
              }
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled" disabled>
                cancelled
              </option>
              <option value="complete" disabled>
                Complete
              </option>
            </select>
          </div>
          {!["cancelled", "complete"].includes(order.status) && (
            <>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <AlertDialog>
                  <AlertDialogTrigger className="cursor-pointer px-2 py-2 border border-gray-300 rounded-md text-red-500 text-xs">
                    Cancel Order
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl">
                        Cancel Order?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-xl">
                        This action will be cancel order.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction className="text-xl cursor-pointer">
                        Close
                      </AlertDialogAction>
                      <AlertDialogAction
                        className="text-xl cursor-pointer"
                        onClick={handleCancel}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger className="cursor-pointer px-2 py-2 text-green-500 border border-gray-300 rounded-md text-xs">
                    Complete Order
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl">
                        Complete Order?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-xl">
                        This action will be complete order.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction className="text-xl cursor-pointer">
                        Close
                      </AlertDialogAction>
                      <AlertDialogAction
                        className="text-xl cursor-pointer"
                        onClick={handleComplete}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={onClose}
                  className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="cursor-pointer px-4 py-2 text-gray-700 text-sm border border-gray-300 rounded-md"
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
