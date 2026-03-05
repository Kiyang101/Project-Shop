"use client";
import { useState, useEffect, useActionState } from "react";
import useProduct from "@/service/product";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { postProduct_handler } from "./action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useImage from "@/service/image";

export default function AddProduct({ onClose }) {
  const category = ["blazer", "coat", "dress", "pants", "skirt", "sweater"];

  const initStateProduct = {
    message: "",
  };
  const [stateProduct, formActionProduct] = useActionState(
    postProduct_handler,
    initStateProduct,
  );

  useEffect(() => {
    if (stateProduct?.message === "success") {
      onClose();
      window.location.reload();
    }
  }, [stateProduct, onClose]);

  return (
    <>
      <div className="fixed w-1/2 min-h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white shadow-2xl rounded-lg">
        <div className="p-6 bg-white rounded-xl">
          <div className="flex justify-between">
            <div className="text-2xl font-bold border-b pb-2">
              Product Information
            </div>
            <button className="cursor-pointer" onClick={() => onClose()}>
              <FontAwesomeIcon icon={faXmark} className="text-2xl" />
              {""}
            </button>
          </div>

          <form className="mt-5 space-y-4" action={formActionProduct}>
            {/* Product Name & Category Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Product Name (String) */}
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  //   defaultValue={product.productName}
                  className="w-full rounded-lg bg-transparent text-black text-lg border border-slate-200 pl-5 pr-3 py-2 focus:outline-none focus:border-slate-400"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Category</label>
                <select
                  name="category"
                  //   key={product?.category}
                  //   defaultValue={product?.category || ""}
                  className="w-full rounded-lg bg-transparent text-black text-lg border border-slate-200 pl-5 pr-3 py-2 focus:outline-none focus:border-slate-400 appearance-none bg-white"
                  required
                >
                  <option value="">Select a category</option>
                  {category.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description (String) */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Description</label>
              <textarea
                name="description"
                // defaultValue={product.description}
                className="w-full rounded-lg bg-transparent text-black text-lg border border-slate-200 pl-5 pr-3 py-2 focus:outline-none"
                rows="3"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Price (Double) */}
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Price (฿)</label>
                <input
                  type="number"
                  step="1"
                  name="price"
                  //   defaultValue={product.price}
                  className="w-full rounded-lg border border-slate-200 pl-5 pr-3 py-2"
                  required
                />
              </div>

              {/* Quantity (Int) */}
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Stock</label>
                <input
                  type="number"
                  name="quantity"
                  //   defaultValue={product.quantity}
                  className="w-full rounded-lg border border-slate-200 pl-5 pr-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Sold (Int) */}
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Sold</label>
                <input
                  type="number"
                  name="sold"
                  //   defaultValue={product.sold}
                  className="w-full rounded-lg border border-slate-200 pl-5 pr-3 py-2"
                  required
                />
              </div>

              {/* Rating (Double) */}
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Rating (0-5)</label>
                <input
                  type="number"
                  step="0.1"
                  max="5"
                  min="0"
                  name="rating"
                  //   defaultValue={product.rating}
                  className="w-full rounded-lg border border-slate-200 pl-5 pr-3 py-2"
                  required
                />
              </div>
            </div>

            {/* Active (Boolean) */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                name="active"
                id="active"
                defaultChecked={true}
                className="w-5 h-5 accent-slate-600 transition-all ease-in-out duration-300"
              />
              <label htmlFor="active" className="font-semibold">
                Is Product Active?
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 mt-6">
              <Button
                type="submit"
                className="bg-black text-white px-6 py-5 text-xl cursor-pointer"
              >
                Add Product
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
