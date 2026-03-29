"use client";
import { useState, useEffect, useActionState } from "react";
import useProduct from "@/service/product";
import useUser from "@/service/user";
import ImageById from "@/components/ImageById";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  postProductImage_handler,
  updateProduct_handler,
  deleteProduct_handler,
} from "./action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useImage from "@/service/image";
import useAuth from "@/service/auth";
import ShowEditProduct from "./ShowEditProduct";

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

export default function EditProduct({ product, onClose, onRefresh }) {
  const initStateProduct = {
    message: "",
  };
  const [stateProduct, formActionProduct] = useActionState(
    updateProduct_handler,
    initStateProduct,
  );
  useEffect(() => {
    if (stateProduct?.message === "success") {
      onRefresh();
    }
  }, [stateProduct]);

  const category = ["blazer", "coat", "dress", "pants", "skirt", "sweater"];

  const deleteHandle = async () => {
    const res = await deleteProduct_handler(product);
    if (res?.message === "success") {
      onRefresh();
      onClose();
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl">
      <div className="text-2xl font-bold border-b pb-2">
        Product Information
      </div>

      <form className="mt-5 space-y-4" action={formActionProduct}>
        {/* Product ID (int) */}
        <input
          type="hidden"
          name="productId"
          // defaultValue={product.productId}
          value={product.productId}
          required
        />

        {/* Product Name & Category Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Product Name (String) */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Product Name</label>
            <input
              type="text"
              name="productName"
              defaultValue={product.productName}
              className="w-full rounded-lg bg-transparent text-black text-lg border border-slate-200 pl-5 pr-3 py-2 focus:outline-none focus:border-slate-400"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Category</label>
            <select
              name="category"
              key={product?.category}
              defaultValue={product?.category || ""}
              className="w-full rounded-lg bg-transparent text-black text-lg border border-slate-200 pl-5 pr-3 py-2 focus:outline-none focus:border-slate-400 appearance-none bg-white"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
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
            defaultValue={product.description}
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
              defaultValue={product.price}
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
              defaultValue={product.quantity}
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
              defaultValue={product.sold}
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
              defaultValue={product.rating}
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
            defaultChecked={product?.active || false}
            className="w-5 h-5 accent-slate-600 transition-all ease-in-out duration-300"
          />
          <label htmlFor="active" className="font-semibold">
            Is Product Active?
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-3 mt-6">
          <Button
            type="submit"
            className="bg-black text-white px-6 py-5 text-xl cursor-pointer"
          >
            Save Changes
          </Button>

          {/* <Button
            onClick={() => {
              deleteHandle();
            }}
            className="bg-black text-white px-6 py-5 text-xl cursor-pointer"
          >
            Delete
          </Button> */}

          <AlertDialog>
            <AlertDialogTrigger className="bg-black text-white px-6 py-1 rounded-sm text-xl cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out">
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xl">
                  This action cannot be undone. This will permanently delete.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer text-xl">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer text-xl"
                  onClick={() => {
                    deleteHandle();
                  }}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </div>
  );
}
