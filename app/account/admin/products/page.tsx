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
import ShowEditProduct from "./ShowEditProduct";
import AddProduct from "./AddProduct";

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

  const [toggleAddProduct, setToggleAddProduct] = useState(false);

  const initProduct = async () => {
    // 1. Fetch the brand new data from the database
    const freshProducts = await _product.getAllProduct();

    // 2. Update the main products table using 'prev'
    setProducts((prevProducts) => {
      // If the table was empty, just use the fresh data
      if (!prevProducts || prevProducts.length === 0) return freshProducts;

      // Otherwise, map through the old products and update them with the fresh data
      return prevProducts.map((oldProduct) => {
        const updatedProduct = freshProducts.find(
          (fresh) => fresh.productId === oldProduct.productId,
        );
        return updatedProduct || oldProduct;
      });
    });

    // 3. Update the Edit Window
    setEditingProduct((prev) => {
      if (!prev) return null;
      return freshProducts.find((p) => p.productId === prev.productId) || prev;
    });

    setTimeout(() => {
      const savedScrollPosition = sessionStorage.getItem("scrollPosition");

      if (savedScrollPosition) {
        // Scroll the user back down
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
        // Delete the saved position so it doesn't trigger on normal page visits
        sessionStorage.removeItem("scrollPosition");
      }
    }, 100);
  };
  useEffect(() => {
    initProduct();
  }, []);

  return (
    <>
      {/* 1. Render as a React Component and ensure products[0] exists before rendering */}
      {editingProduct && (
        <>
          <div className="fixed inset-0 z-20 bg-black/50"></div>
          <ShowEditProduct
            product={editingProduct}
            onClose={() => {
              setEditingProduct(null);
              sessionStorage.setItem("scrollPosition", window.scrollY);
              window.location.reload();
            }}
            onRefresh={initProduct}
          />
        </>
      )}

      {toggleAddProduct && (
        <>
          <div className="fixed inset-0 z-20 bg-black/50"></div>
          <AddProduct
            onClose={() => {
              setToggleAddProduct(false);
            }}
          />
        </>
      )}

      <div className="flex justify-between ml-10">
        <h1 className="text-2xl">
          <strong>Products</strong>
          <br />
          Manage Products Listing
        </h1>
        <div className="flex justify-around gap-5">
          <Button
            className="text-lg p-5 cursor-pointer"
            onClick={() => setToggleAddProduct(true)}
          >
            Add Product
          </Button>
          <Button className="text-lg p-5 cursor-pointer" onClick={Logout}>
            LOGOUT
          </Button>
        </div>
      </div>
      <div className="w-9.5/10 mt-5 mx-10">
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
      </div>
      <div className="flex justify-center mt-5">
        <div className="w-[95%] mx-auto bg-white">
          <table className="w-full border-collapse">
            {/* ส่วนหัวตาราง (Table Header) */}
            <thead className="bg-gray-300">
              <tr className="border-b  border-gray-300 h-16 uppercase">
                {/* กำหนดความสูงแถว */}
                <th className="w-[25%] align-middle text-left pl-5">Product</th>
                <th className="w-[10%] align-middle text-center">Category</th>
                <th className="w-[10%] align-middle text-center">Price</th>
                <th className="w-[10%] align-middle text-center">Stock</th>
                <th className="w-[10%] align-middle text-center">Status</th>
                <th className="w-[10%] align-middle text-center">Action</th>
              </tr>
            </thead>

            {/* ส่วนเนื้อหา (Table Body) */}
            {products && (
              <tbody className="">
                {products.map((product, index) => {
                  return (
                    <tr
                      className="border-b border-gray-200"
                      key={product.productId}
                    >
                      <td className="py-6 px-5">
                        {/* <div>
                          <h1 className="">{product.productName}</h1>
                        </div> */}
                        <div className="flex">
                          <div className="w-22 h-17">
                            <ImageById
                              imageId={product.imageIds[0]}
                              className={""}
                              orientation=""
                            />
                          </div>
                          <h1 className="ml-3 text-xl">
                            {product.productName}
                          </h1>
                        </div>
                      </td>
                      <td className="py-6 px-4 align-top text-center text-xl leading-relaxed">
                        <p>{product.category}</p>
                      </td>
                      <td className="py-6 text-center align-top text-xl text-gray-500 uppercase">
                        {product.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-6 text-center align-top text-xl">
                        {product.quantity}
                      </td>
                      <td className="py-6 flex justify-center align-top text-xl">
                        <div className="w-1/2 text-center">
                          {product.active ? (
                            <div className="bg-green-500 py-1 rounded-lg text-white">
                              Active
                            </div>
                          ) : (
                            <div className="bg-red-500 py-1 rounded-lg text-white">
                              Inactive
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-6 text-center align-top text-xl">
                        <Button
                          className="hover:cursor-pointer select-none"
                          onClick={() => setEditingProduct(product)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
}
