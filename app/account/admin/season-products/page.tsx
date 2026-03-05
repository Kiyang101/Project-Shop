"use client";
import { useState, useEffect } from "react";
import useProduct from "@/service/product";
import useUser from "@/service/user";
import ImageById from "@/components/ImageById";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import ProductList from "./ProductList";
import ProductSelector from "./ProductSelector";
import useAuth from "@/service/auth";

const Logout = async () => {
  const _auth = useAuth();
  const res = await _auth.logout();
  if (res.logout) {
    window.location.href = "/login";
    return;
  }
  return;
};

export default function Page() {
  const _product = useProduct();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const [toggleAdd, setToggleAdd] = useState(false);

  const initProduct = async () => {
    const freshProducts = await _product.getSeasonProduct();
    // console.log(freshProducts);
    setProducts(freshProducts);
  };

  useEffect(() => {
    initProduct();
  }, []);

  const handleAddSeasonProduct = async (productId: number) => {
    // console.log("Selected Product ID to add:", productId);

    try {
      const chk = await _product.getSeasonProduct();
      // console.log(chk);
      if (chk.length < 4) {
        await _product.postSeasonProduct({ productId: productId });
        setToggleAdd(false);
      }

      initProduct();
    } catch (error) {
      console.error("Failed to add product", error);
    }
  };

  return (
    <>
      {/* 1. Render as a React Component and ensure products[0] exists before rendering */}
      {/* {editingProduct && (
        <ShowEditProduct
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null);
            sessionStorage.setItem("scrollPosition", window.scrollY);
            window.location.reload();
          }}
          onRefresh={initProduct}
        />
      )} */}

      {toggleAdd && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50"></div>
          <ProductSelector
            onSelect={handleAddSeasonProduct}
            onClose={() => setToggleAdd(false)}
          />
        </>
      )}
      <div className="flex justify-between ml-10">
        <h1 className="text-2xl">
          <strong>Season Products</strong>
          <br />
          Manage Season Products Listing
        </h1>
        <div className="gap-5 w-1/3 flex justify-around">
          <Button
            className="text-lg p-5 cursor-pointer"
            onClick={() => setToggleAdd(true)}
          >
            Add Product
          </Button>
          <Button className="text-lg p-5 cursor-pointer" onClick={Logout}>
            LOGOUT
          </Button>
        </div>
      </div>
      {/* <div className="w-9.5/10 mt-5 mx-10">
        <form className="text-black">
          <div className="relative">
            <input
              type="text"
              id="search"
              className=" block w-full p-3 ps-9 bg-neutral-secondary-medium border text-heading border-black
                    text-lg rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body rounded-3xl"
              placeholder="Search Product"
              required
              suppressHydrationWarning={true}
            />
            <button
              type="button"
              className="absolute inset-e-1.5 bottom-1.5 text-xl border-transparent shadow-xs font-medium leading-5 rounded px-3 py-1.5 focus:outline-none hover:cursor-pointer"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-1" />
              {""}
            </button>
          </div>
        </form>
      </div> */}
      <div className="flex justify-center mt-5">
        <div className="w-[95%] mx-auto bg-white">
          <table className="w-full border-collapse">
            {/* ส่วนหัวตาราง (Table Header) */}
            <thead className="bg-gray-300">
              <tr className="border-b  border-gray-300 h-16 uppercase">
                {/* กำหนดความสูงแถว */}
                <th className="w-[25%] align-middle text-left pl-5">Product</th>
                <th className="w-[65%] align-middle text-left pl-5">
                  Product Name
                </th>
                {/* <th className="w-[10%] align-middle text-center">Price</th>
                <th className="w-[10%] align-middle text-center">Stock</th>
                <th className="w-[10%] align-middle text-center">Status</th> */}
                <th className="w-[10%] align-middle text-center">Delete</th>
              </tr>
            </thead>
            {/* ส่วนเนื้อหา (Table Body) */}
            {products && (
              <tbody className="">
                {products.map((productId, index) => (
                  <ProductList key={index} id={productId} />
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
}
