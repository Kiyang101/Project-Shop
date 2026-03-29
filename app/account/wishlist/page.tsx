"use client";
import { use, useEffect, useState } from "react";
import useUser from "@/service/user";
import useWishlist from "@/service/wishlist";
import ProductList from "./ProductList";

export default function Page() {
  const [user, setUser] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const _user = useUser();
  const _wishlist = useWishlist();

  const initUser = async () => {
    const user = await _user.getUser();
    setUser(user);
  };

  const initWishlist = async () => {
    const wishlist = await _wishlist.getWishlist();
    // console.log(wishlist);
    setWishlist(wishlist);
  };

  useEffect(() => {
    initUser();
    initWishlist();
  }, []);

  return (
    <>
      <div>
        <div className="h-[10dvh] flex justify-center items-center bg-[rgba(0,0,0,0.15)]">
          <h1 className="text-3xl">My Wish List</h1>
        </div>
        <div className="flex justify-center items-center my-5">
          <div className="text-center">
            <h1 className="text-2xl">
              WELCOME {user.name} {user.surName}
            </h1>
            <h1 className="text-lg text-gray-400">
              here you can keep track of your recent activity. view and edit
              your account, and view or edit your list of faverite products.
            </h1>
          </div>
        </div>
        <div className="flex justify-center p-10">
          {wishlist && (
            <div className="grid grid-cols-2 justify-items-center gap-y-7">
              {wishlist.map((item) => {
                return (
                  <ProductList
                    productId={item.productId}
                    key={item.id}
                    id={item.id}
                    onRefresh={() => {
                      initWishlist();
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
