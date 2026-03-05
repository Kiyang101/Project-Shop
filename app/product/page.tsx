"use client";
import { useState, useEffect } from "react";
import useProduct from "@/service/product";
import useUser from "@/service/user";
import ImageById from "@/components/ImageById";
import { Button } from "@/components/animate-ui/components/buttons/button";
import Link from "next/link";

export default function Page() {
  const _product = useProduct();
  const [products, setProducts] = useState([]);

  const initProduct = async () => {
    const freshProducts = await _product.getAllProduct();
    // console.log(freshProducts);
    setProducts(freshProducts);
  };

  useEffect(() => {
    initProduct();
  }, []);
  return (
    <>
      <div className="">
        <div className="h-[10dvh] flex justify-center items-center bg-[rgba(0,0,0,0.15)]">
          <h1 className="text-5xl">All Products</h1>
        </div>

        <div className="px-10">
          <h1 className="uppercase text-4xl mt-5 pl-5">blazer</h1>
          <div className="grid grid-cols-4 gap-5 px-4 mt-5">
            {products
              .filter((product) => product.category === "blazer")
              .map((product) => {
                return (
                  <Link
                    key={product.productId}
                    href={`/product/${product.productId}`}
                    className="relative group overflow-hidden cursor-pointer shadow-2xl hover:scale-[102%] transition-all ease-in-out duration-300"
                  >
                    <ImageById imageId={product.imageIds[0]} />
                    {/* <h1>{product.productName}</h1> */}
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="px-10">
          <h1 className="uppercase text-4xl mt-5 pl-5">coat</h1>
          <div className="grid grid-cols-4 gap-5 px-4 mt-5">
            {products
              .filter((product) => product.category === "coat")
              .map((product) => {
                return (
                  <Link
                    key={product.productId}
                    href={`/product/${product.productId}`}
                    className="relative group overflow-hidden cursor-pointer shadow-2xl hover:scale-[102%] transition-all ease-in-out duration-300"
                  >
                    <ImageById imageId={product.imageIds[0]} />
                    {/* <h1>{product.productName}</h1> */}
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="px-10">
          <h1 className="uppercase text-4xl mt-5 pl-5">dress</h1>
          <div className="grid grid-cols-4 gap-5 px-4 mt-5">
            {products
              .filter((product) => product.category === "dress")
              .map((product) => {
                return (
                  <Link
                    key={product.productId}
                    href={`/product/${product.productId}`}
                    className="relative group overflow-hidden cursor-pointer shadow-2xl hover:scale-[102%] transition-all ease-in-out duration-300"
                  >
                    <ImageById imageId={product.imageIds[0]} />
                    {/* <h1>{product.productName}</h1> */}
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="px-10">
          <h1 className="uppercase text-4xl mt-5 pl-5">pants</h1>
          <div className="grid grid-cols-4 gap-5 px-4 mt-5">
            {products
              .filter((product) => product.category === "pants")
              .map((product) => {
                return (
                  <Link
                    key={product.productId}
                    href={`/product/${product.productId}`}
                    className="relative group overflow-hidden cursor-pointer shadow-2xl hover:scale-[102%] transition-all ease-in-out duration-300"
                  >
                    <ImageById imageId={product.imageIds[0]} />
                    {/* <h1>{product.productName}</h1> */}
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="px-10">
          <h1 className="uppercase text-4xl mt-5 pl-5">skirt</h1>
          <div className="grid grid-cols-4 gap-5 px-4 mt-5">
            {products
              .filter((product) => product.category === "skirt")
              .map((product) => {
                return (
                  <Link
                    key={product.productId}
                    href={`/product/${product.productId}`}
                    className="relative group overflow-hidden cursor-pointer shadow-2xl hover:scale-[102%] transition-all ease-in-out duration-300"
                  >
                    <ImageById imageId={product.imageIds[0]} />
                    {/* <h1>{product.productName}</h1> */}
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="px-10">
          <h1 className="uppercase text-4xl mt-5 pl-5">sweater</h1>
          <div className="grid grid-cols-4 gap-5 px-4 mt-5">
            {products
              .filter((product) => product.category === "sweater")
              .map((product) => {
                return (
                  <Link
                    key={product.productId}
                    href={`/product/${product.productId}`}
                    className="relative group overflow-hidden cursor-pointer shadow-2xl hover:scale-[102%] transition-all ease-in-out duration-300"
                  >
                    <ImageById imageId={product.imageIds[0]} />
                    {/* <h1>{product.productName}</h1> */}
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
