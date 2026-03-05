"use client";

import { Button } from "@/components/animate-ui/components/buttons/button";
import { useActionState, useState } from "react";
import { postProduct_handler, postProductImage_handler } from "./action";

export default function Page() {
  const initStateProduct = {
    message: "",
  };
  const [stateProduct, formActionProduct] = useActionState(
    postProduct_handler,
    initStateProduct,
  );
  const initStateProductImage = {
    message: "",
  };
  const [stateProductImage, formActionProductImage] = useActionState(
    postProductImage_handler,
    initStateProductImage,
  );
  return (
    <>
      <div className="m-10 flex gap-5">
        <div className="w-1/3">
          <h1>Post Product</h1>
          <form action={formActionProduct} className="gap-2 flex flex-col">
            <input
              type="text"
              className="border border-black"
              placeholder="productName"
              name="productName"
            />
            <input
              type="text"
              className="border border-black"
              placeholder="description"
              name="description"
            />
            <input
              type="text"
              className="border border-black"
              placeholder="price"
              name="price"
            />
            <input
              type="text"
              className="border border-black"
              placeholder="sold"
              name="sold"
              defaultValue={0}
            />
            <input
              type="text"
              className="border border-black"
              placeholder="rating"
              name="rating"
              defaultValue={5}
            />
            <input
              type="text"
              className="border border-black"
              placeholder="category"
              name="category"
              defaultValue={"sweater"}
            />
            <input
              type="text"
              className="border border-black"
              placeholder="quantity"
              name="quantity"
              defaultValue={100}
            />
            <input
              type="text"
              className="border border-black"
              placeholder="size"
              name="size"
            />
            <Button>post</Button>
          </form>
          <div className="flex justify-center my-10 text-xl">
            {stateProduct?.message && <p>Message: {stateProduct?.message}</p>}
          </div>
        </div>
        <div className="w-1/3">
          <h1>Post Product</h1>
          <form action={formActionProductImage} className="gap-2 flex flex-col">
            <input
              className="border border-black p-2"
              type="file"
              accept="image/*"
              name="file"
              //   onChange={(e) => setFile(e.target.files[0])}
            />
            <input
              type="text"
              className="border border-black"
              placeholder="productId"
              name="productId"
            />
            <select name="orientation" id="">
              <option value="horizontal">horizontal</option>
              <option value="vertical">vertical</option>
            </select>
            <Button>post</Button>
          </form>
          <div className="flex justify-center my-10 text-xl">
            {stateProductImage?.message && (
              <p>Message: {stateProductImage?.message}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
