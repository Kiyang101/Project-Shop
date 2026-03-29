"use client";
import { useState, useEffect } from "react";
import { getProduct } from "./action";
import ImageById from "@/components/ImageById";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { deleteProductFromBag, updateBag_handler } from "./action";

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
} from "@/components/animate-ui/components/radix/alert-dialog";

export default function ProductRow({
  item,
  onRefresh,
}: {
  item: any;
  onRefresh: () => void;
}) {
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

  const [product, setProduct] = useState<any>(null);
  const [bags, setBags] = useState<BagData | null>([]);
  const [Quantity, setQuantity] = useState(0);
  const [size, setSize] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      const data = await getProduct(item.productId);
      //   console.log(data[0]);
      setProduct(data[0]);
      setQuantity(item.quantity);
      setSize(item.size);
    };
    fetchDetail();
  }, [item.productId]);

  useEffect(() => {
    // Prevent the effect from running on the very first mount
    // if you don't want to re-save data that's already there.
    if (product && Quantity > 0) {
      updateBag_handler({
        productId: product.productId,
        quantity: Quantity,
        size: size,
      });
    }
  }, [Quantity, size, product]);

  if (!product) {
    return (
      <tr>
        <td colSpan={6}>Loading...</td>
      </tr>
    );
  }
  const handleDelete = async () => {
    await deleteProductFromBag(product.productId, size);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (Quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    setQuantity((prev) => prev + 1);
  };

  return (
    <tr className="border-b border-gray-200">
      <td className="py-6">
        <div className="w-60 h-52 bg-gray-100 border border-black">
          <ImageById
            imageId={product.images[0].imageId}
            className={""}
            orientation=""
          />
          <h1 className="text-center text-lg">{product.productName}</h1>
        </div>
      </td>
      <td className="py-6 px-4 align-top text-base leading-relaxed">
        <p>{product.description}</p>
      </td>
      <td className="py-6 text-center align-top text-base text-gray-500 uppercase">
        {size}
      </td>
      <td className="py-6 text-center align-top text-base">
        {product.price.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
        THB
      </td>
      <td className="py-6 text-center align-top">
        <div className="flex items-center justify-center inline-flex mx-auto">
          <button className="px-2 cursor-pointer" onClick={handleDecrement}>
            <FontAwesomeIcon icon={faMinus} />
            {""}
          </button>
          {/* <input
            type="text"
            value={Quantity}
            className="w-8 text-center outline-none"
            readOnly
          /> */}
          <h1>{Quantity}</h1>
          <button className="px-2 cursor-pointer" onClick={handleIncrement}>
            <FontAwesomeIcon icon={faPlus} />
            {""}
          </button>
        </div>
      </td>
      {/* Add 'relative' to the cell */}
      <td className="py-6 text-right align-top relative">
        <div className="font-bold mb-10 text-base">
          {(product.price * Quantity).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          THB
        </div>

        {/* Pin to bottom (bottom-6 matches your py-6) and right */}
        <div className="uppercase absolute bottom-6 right-0">
          <AlertDialog>
            <AlertDialogTrigger className="block ml-auto hover:underline cursor-pointer">
              Remove from Bag
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xl">
                  This action cannot be undone. This will permanently delete
                  from your bag.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer text-xl">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer text-xl"
                  onClick={async () => {
                    await handleDelete();
                    onRefresh();
                  }}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* <button
            className="block ml-auto hover:underline cursor-pointer"
          >
            Remove from Bag
          </button> */}
        </div>
      </td>
    </tr>
  );
}
