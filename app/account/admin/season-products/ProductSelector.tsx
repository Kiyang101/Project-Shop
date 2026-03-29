"use client";

import { useState, useEffect } from "react";
import ImageById from "@/components/ImageById";
import useProduct from "@/service/product";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ProductSelectorProps {
  onSelect: (productId: number) => void;
  onClose: () => void;
}

export default function ProductSelectorModal({
  onSelect,
  onClose,
}: ProductSelectorProps) {
  const _product = useProduct();
  const [products, setProducts] = useState(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await _product.getAllProduct();
        // console.log(data);
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleOk = () => {
    if (selectedId !== null) {
      onSelect(selectedId);
      onClose();
    }
  };

  // useEffect(() => {
  //   console.log(selectedId);
  // }, [selectedId]);

  return (
    <>
      <div className="fixed w-2/3 h-[60vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white shadow-2xl rounded-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex justify-center relative">
          <h1 className="font-bold text-2xl"> Select Product</h1>
          <div className="absolute right-0 top-0 mt-5 mx-5">
            <button className="cursor-pointer">
              <FontAwesomeIcon
                icon={faXmark}
                onClick={onClose}
                className="text-2xl"
              />
              {""}
            </button>
          </div>
        </div>

        {/* Body - flex-1 makes this section grow to fill all available space */}
        <div className="h-[400px] overflow-y-auto p-6">
          {/* <p>Your scrollable product list goes here...</p> */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {products.map((product) => {
                return (
                  // ${selectedId === product.productId ? "border-2 border-red-500" : ""}
                  <div
                    key={product.productId}
                    onClick={() => setSelectedId(product.productId)}
                  >
                    {/* <h1>{product.productName}</h1> */}
                    <ImageById
                      imageId={product.imageIds[0]}
                      className={`cursor-pointer rounded-lg ${selectedId === product.productId ? "border-3 border-green-500" : ""}`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <div className="flex justify-end ">
            <Button onClick={handleOk} className="cursor-pointer px-6">
              Ok
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
