"use client";
import { useState, useEffect, useActionState } from "react";
import useProduct from "@/service/product";
import useUser from "@/service/user";
import ImageById from "@/components/ImageById";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { postProductImage_handler, updateProduct_handler } from "./action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useImage from "@/service/image";
import useAuth from "@/service/auth";

export default function AddImage({ imageId, onClose, onRefresh }) {
  const initStateProductImage = {
    message: "",
  };
  const [stateProductImage, formActionProductImage] = useActionState(
    postProductImage_handler,
    initStateProductImage,
  );
  useEffect(() => {
    if (stateProductImage?.message === "success") {
      onRefresh(); // Re-fetches the products
      onClose(); // Closes the Add Image modal
    }
  }, [stateProductImage, onRefresh, onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      {/* The Window Container */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-2xl border border-gray-200">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-4">Post Product</h1>
          <button
            onClick={onClose}
            className="hover:cursor-pointer -translate-y-5 translate-x-3"
          >
            <FontAwesomeIcon icon={faXmark} className="text-2xl" />
            {""}
          </button>
        </div>
        <form action={formActionProductImage} className="gap-4 flex flex-col">
          <input
            className="border border-gray-300 p-2 rounded w-full"
            type="file"
            accept="image/*"
            name="file"
          />

          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="Product ID"
            name="productId"
            value={imageId}
            readOnly
          />

          <select
            name="orientation"
            className="border border-gray-300 p-2 rounded w-full bg-white"
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>

          <Button className="w-full">Post Product</Button>
        </form>

        {/* Message Display */}
        {stateProductImage?.message && (
          <div className="mt-6 p-2 bg-blue-50 text-blue-700 text-center rounded">
            {stateProductImage.message}
          </div>
        )}
      </div>
    </div>
  );
}
