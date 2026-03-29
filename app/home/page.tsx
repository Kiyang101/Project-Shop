"use client";
import { useState, useEffect } from "react";
import useProduct from "@/service/product";
import ImageById from "@/components/ImageById";
import Link from "next/link";
export default function Page() {
  const _product = useProduct();
  const [products, setProducts] = useState(null);

  const initProduct = async () => {
    const freshProducts = await _product.getSeasonProduct();
    // console.log(freshProducts);
    setProducts(freshProducts);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      await initProduct();
    };
    fetchProducts();
  }, []);

  if (!products) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {/* <div className="mx-10 h-[10dvh] flex items-center">
        <h1 className="text-5xl">SEASON PRODUCT</h1>
      </div> */}

      <div className="mx-10 mt-5 h-[10dvh] flex items-center select-none">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-500 drop-shadow-2xl tracking-wide">
          SEASON PRODUCT
        </h1>
      </div>

      {/* <div className="mx-10 h-[10dvh] flex items-center">
        <h1 className="text-5xl font-black text-gray-900 drop-shadow-lg tracking-tight">
          SEASON PRODUCT
        </h1>
      </div> */}

      <div className="min-h-[58.5dvh] flex items-center justify-center">
        <div className="flex justify-center gap-5">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((productItem, index) => (
              <List key={index} id={productItem} />
            ))
          ) : (
            <div>No products available.</div>
          )}
        </div>
      </div>
    </>
  );
}

const List = ({ id }) => {
  const productId = id.productId;
  const _product = useProduct();
  const [product, setProduct] = useState(null);

  const initProduct = async () => {
    const freshProduct = await _product.getProductById(productId);
    // console.log(freshProduct[0]);
    setProduct(freshProduct[0]);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      await initProduct();
    };
    fetchProduct();
  }, []);

  if (!product) {
    return <div>Loading...</div>;
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

  return (
    <Link
      href={`/product/${product.productId}`}
      className="w-[23.5%] relative group overflow-hidden hover:cursor-pointer"
    >
      <img
        src={`${apiUrl}/api/products/image/view/${product.images[0].imageId}`}
        alt=""
        className="w-full h-[500px] object-cover block transition duration-300 group-hover:blur "
      />
      {/* <div className="">
        <ImageById imageId={product.images[0].imageId} />
      </div> */}
      {/* <ImageById imageId={product.images[0].imageId} /> */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 flex items-center bg-black/60 text-white text-center py-4 translate-y-full group-hover:translate-y-0 transition duration-300 px-10 ">
        <p className="whitespace-pre-line text-start text-xl">
          {product.productName}
          <br />฿
          {product.price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          <br />
          {product.category}
        </p>
      </div>
    </Link>
  );
};
