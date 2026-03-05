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
import EditProduct from "./EditProduct";
import EditImage from "./EditImage";

export default function ShowEditProduct({ product, onClose, onRefresh }) {
  const [toggle, setToggle] = useState(true);

  return (
    <>
      <div className="fixed w-1/2 min-h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white shadow-2xl rounded-lg">
        <div className="p-3">
          {product && (
            <div className="">
              <div className="absolute top-0 right-0 p-5 ">
                <button onClick={onClose} className="hover:cursor-pointer">
                  <FontAwesomeIcon icon={faXmark} className="text-2xl" />
                  {""}
                </button>
              </div>
              <div className="flex px-5 mt-5">
                <div className="w-1/5 text-2xl mt-5">
                  <h1
                    className="py-5 cursor-pointer"
                    onClick={() => setToggle(true)}
                  >
                    Infomation
                  </h1>
                  <h1
                    className="py-5 cursor-pointer"
                    onClick={() => setToggle(false)}
                  >
                    Images
                  </h1>
                </div>
                <div className="w-4/5 mt-5">
                  {toggle ? (
                    <EditProduct
                      product={product}
                      onClose={onClose}
                      onRefresh={onRefresh}
                    />
                  ) : (
                    <EditImage
                      imageIds={product.imageIds}
                      productId={product.productId}
                      onRefresh={onRefresh}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
