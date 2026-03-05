import { getProduct, getTotalPrice, postOrder_handler } from "./action";
import { useState, useEffect, use } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function CheckoutPopup({ isOpen, onClose, bagData }) {
  const [totalPrice, setTotalPrice] = useState(0);

  if (!isOpen) return null;

  const calculateTotalPrice = async () => {
    const total = await getTotalPrice(bagData);
    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [bagData]);

  // console.log(bagData);

  const handleConfirm = async () => {
    const res = await postOrder_handler({
      bagId: bagData.bagId,
      products: bagData.products,
      totalPrice: totalPrice,
    });
    if (res?.message === "success") {
      onClose();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center ">
      <div className="bg-white w-full max-w-lg p-6 shadow-xl sm:rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Order Summary
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-800 text-xl font-bold"
          >
            <FontAwesomeIcon icon={faXmark} />
            {""}
          </button>
        </div>

        {/* Product List */}
        <div className="max-h-64 overflow-y-auto pr-2 mb-4 space-y-4">
          {bagData.products.map((product, index) => (
            <ProductList
              key={index}
              productId={product.productId}
              size={product.size}
              quantity={product.quantity}
            />
          ))}
        </div>

        {/* Total Price Section */}
        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between items-center text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>
              {totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
              THB
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => handleConfirm()}
            className="cursor-pointer px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );
}

const ProductList = ({ productId, size, quantity }) => {
  const [product, setProduct] = useState([]);

  const initProduct = async () => {
    const data = await getProduct(productId);
    setProduct(data[0]);
  };

  useEffect(() => {
    initProduct();
  }, []);

  return (
    <div className="flex justify-between items-center text-sm">
      <div className="flex flex-col w-2/3">
        <span className="font-medium text-gray-800 line-clamp-1">
          {product.productName}
        </span>
        <span className="text-gray-500 uppercase">
          Size: {size} | Qty: {quantity}
        </span>
      </div>
      <div className="text-right text-gray-800">
        {(product.price * quantity).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}{" "}
        THB
      </div>
    </div>
  );
};
