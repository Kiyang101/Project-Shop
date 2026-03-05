"use client";
import { useEffect, useState } from "react";
import useAuth from "@/service/auth";
import useWishlist from "@/service/wishlist";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faMagnifyingGlass,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import ImageById from "@/components/ImageById";
import useProduct from "@/service/product";

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
  const [wishlist, setWishlist] = useState([]);
  const _wishlist = useWishlist();

  const [items, setItems] = useState([]);

  const initWishlist = async () => {
    const wishlist = await _wishlist.getAllWishlist();

    console.log(wishlist);
    setWishlist(wishlist);
  };

  useEffect(() => {
    initWishlist();
  }, []);

  useEffect(() => {
    if (wishlist && wishlist.length > 0) {
      // 1. Group and count the productIds
      const counts = wishlist.reduce((acc, item) => {
        const { productId } = item;
        // If the productId exists in our accumulator, add 1. Otherwise, start at 1.
        acc[productId] = (acc[productId] || 0) + 1;
        return acc;
      }, {});

      // 2. Convert the counts object into an array of objects
      // Example output: [{ productId: 26, count: 3 }, { productId: 19, count: 1 }]
      const formattedItems = Object.entries(counts).map(
        ([productId, count]) => ({
          productId: Number(productId), // Object keys are strings, so we convert it back to a number
          count: count,
        }),
      );

      //   console.log(formattedItems);

      // 3. Update the state
      setItems(formattedItems);
    }
  }, [wishlist]);

  return (
    <>
      <div className="flex justify-between ml-10">
        <h1 className="text-2xl">
          <strong>Wish List</strong> Welcome to <strong>ELVIOGROUP</strong>{" "}
          Admin
        </h1>
        <div className="gap-5 w-1/3 flex justify-end">
          <Button className="text-lg p-5 cursor-pointer" onClick={Logout}>
            LOGOUT
          </Button>
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <div className="w-[95%] mx-auto bg-white">
          <table className="w-full border-collapse">
            {/* ส่วนหัวตาราง (Table Header) */}
            <thead className="bg-gray-300">
              <tr className="border-b  border-gray-300 h-16 uppercase">
                {/* กำหนดความสูงแถว */}
                <th className="w-[40%] align-middle text-left pl-5">
                  Product Name
                </th>
                <th className="w-[20%] align-middle text-center pl-5">
                  Category
                </th>
                <th className="w-[20%] align-middle text-center">Price</th>
                {/* <th className="w-[10%] align-middle text-center">Stock</th>
                      <th className="w-[10%] align-middle text-center">Status</th> */}
                <th className="w-[20%] align-middle text-center">
                  Wishlist Added
                </th>
              </tr>
            </thead>
            {/* ส่วนเนื้อหา (Table Body) */}
            {items && items.length > 0 && (
              <tbody className="">
                {items
                  .sort((a, b) => b.count - a.count)
                  .map((item, index) => (
                    <ProductList
                      key={index}
                      productId={item.productId}
                      count={item.count}
                    />
                  ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
}

const ProductList = ({ productId, count }) => {
  const _product = useProduct();
  const [product, setProduct] = useState(null);

  const initProduct = async () => {
    const freshProduct = await _product.getProductById(productId);
    // console.log(freshProduct[0]);
    setProduct(freshProduct[0]);
  };

  useEffect(() => {
    initProduct();
  }, []);

  if (!product) {
    return (
      <tr>
        <td colSpan={6}>Loading...</td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="py-6 px-5">
        <div className="flex items-center">
          <div className="w-1/3 shadow-xl">
            <ImageById
              imageId={product.images[0].imageId}
              className={""}
              orientation=""
            />
          </div>
          <h1 className="ml-3 text-xl">{product.productName}</h1>
        </div>
      </td>
      <td className="py-6 px-4 ">
        <div className="flex justify-center items-center text-xl">
          <h1 className="">{product.category}</h1>
        </div>
      </td>
      <td className="py-6 px-4 ">
        <div className="flex justify-center items-center text-xl">
          <h1>
            {product.price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            THB
          </h1>
        </div>
      </td>
      <td className="py-6 px-4">
        <div className="flex justify-center items-center gap-1 text-xl">
          <FontAwesomeIcon icon={faStar} className="text-amber-300" />
          <h1>{count}</h1>
        </div>
      </td>
    </tr>
  );
};
