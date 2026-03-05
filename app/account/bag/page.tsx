"use client";
import ImageById from "@/components/ImageById";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import useBag from "@/service/bag";
import { getProduct } from "./action";
import ProductRow from "./ProductRow";
import { Button } from "@/components/animate-ui/components/buttons/button";
import CheckoutPopup from "./CheckoutPopup";

export default function Page() {
  const _bag = useBag();
  const [bags, setBags] = useState<BagData | null>([]);
  const [Quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  interface BagData {
    bagId: number;
    userId: number;
    products: {
      productId: number;
      quantity: number;
      size: string;
    };
  }
  interface Bag {
    data: BagData;
    message: string;
    status: number;
  }

  const initBag = async () => {
    const bag: Bag = await _bag.getBag();
    // console.log(bag.data);
    setBags(bag.data);
  };

  useEffect(() => {
    initBag();
  }, []);

  return (
    <>
      <div className="flex justify-center">
        <div className="h-[10dvh] w-dvw flex justify-center items-center bg-[rgba(0,0,0,0.15)]">
          <h1 className="text-5xl">SHOPPING BAG</h1>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <div className="w-[95%] mx-auto bg-white p-5">
          <table className="w-full border-collapse">
            {/* ส่วนหัวตาราง (Table Header) */}
            <thead>
              <tr className="border-b border-t border-gray-300 h-16 uppercase">
                {/* กำหนดความสูงแถว */}
                <th className="w-[20%] align-middle text-left">Product</th>
                <th className="w-[35%] align-middle text-center">
                  Description
                </th>
                <th className="w-[10%] align-middle text-center">Size</th>
                <th className="w-[10%] align-middle text-center">Price</th>
                <th className="w-[10%] align-middle text-center">Quantity</th>
                <th className="w-[15%] align-middle text-right ">Total</th>
              </tr>
            </thead>

            {/* ส่วนเนื้อหา (Table Body) */}
            {bags && bags.products && (
              <tbody>
                {bags.products.map((_product, index) => {
                  const product = getProduct(_product.productId);
                  // console.log(product);
                  return <ProductRow item={_product} key={index} />;
                })}
              </tbody>
            )}
          </table>
          {bags && bags.products && bags.products.length > 0 && (
            <div className="sticky bottom-10 flex justify-center z-20 my-10">
              <Button
                className="p-7 px-15 text-3xl cursor-pointer"
                onClick={() => setCheckoutOpen(true)}
              >
                Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
      {checkoutOpen && bags && (
        <>
          <div className="fixed inset-0 z-20 bg-black/50"></div>

          <CheckoutPopup
            isOpen={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            bagData={bags}
          />
        </>
      )}
    </>
  );
}
