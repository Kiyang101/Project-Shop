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
      {toggleAdd && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50"></div>
          <ProductSelector
            onSelect={handleAddSeasonProduct}
            onClose={() => setToggleAdd(false)}
          />
        </>
      )}

      <div className="min-h-screen bg-gray-50 p-8 text-gray-800 rounded-2xl">
        <div className="flex justify-between">
          <h1 className="text-2xl">
            <strong>Season Products</strong>
            <br />
            Manage Season Products Listing
          </h1>
          <div className="gap-5 flex justify-around">
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
        <div className="flex justify-center mt-5">
          <div className="w-full mx-auto bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100">
            <table className="w-full border-collapse">
              <thead className="bg-white text-gray-400">
                <tr className="border-b  border-gray-300 h-16 ">
                  <th className="w-[25%] align-middle text-left pl-5">
                    Product
                  </th>
                  <th className="w-[65%] align-middle text-left pl-5">
                    Product Name
                  </th>
                  <th className="w-[10%] align-middle text-center">Action</th>
                </tr>
              </thead>
              {products && (
                <tbody className="">
                  {products.map((productId, index) => (
                    <ProductList
                      key={index}
                      id={productId}
                      onRefresh={initProduct}
                    />
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
