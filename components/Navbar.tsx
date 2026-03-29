"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useActionState } from "react";
// import Auth from "./Auth";
import useUser from "@/service/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar";
import useBag from "@/service/bag";

export default function Navbar() {
  interface BagData {
    bagId: number;
    userId: number;
    products: {
      productId: number;
      quantity: number;
      size: string;
    }[];
  }
  interface Bag {
    data: BagData;
    message: string;
    status: number;
  }
  const [toogleAuth, setToogleAuth] = useState(false);
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bags, setBags] = useState<BagData | null>(null);
  const [amount, setAmount] = useState(0);

  const _user = useUser();
  const _bag = useBag();

  const initUser = async () => {
    const user = await _user.getUser();
    // console.log(user);
    if (user.login) {
      setLogin(true);
      setUser(user);
    } else {
      setLogin(false);
    }
  };
  const initBag = async () => {
    const bag: Bag = await _bag.getBag();
    setBags(bag.data);
  };

  useEffect(() => {
    initUser();
    initBag();

    // Set up a listener for our custom event
    const handleUpdate = () => {
      initBag();
    };

    window.addEventListener("update-bag", handleUpdate);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener("update-bag", handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (bags?.products) {
      const sum = bags.products.reduce((total, item) => {
        // Force both to numbers to prevent string concatenation
        return Number(total) + Number(item.quantity);
      }, 0);

      setAmount(sum);
    }
  }, [bags]);

  const Catagory = [
    "BLAZER",
    "COAT",
    "DRESS",
    "PANTS",
    "SKIRT",
    "SWEATER",
    "ALL",
  ];

  return (
    <>
      <div className="h-[24.5dvh] sticky top-0 z-10 bg-white">
        <div className="items-center flex h-1/2 px-[2%] pt-2 justify-between text-black">
          <div className="">
            <Link href="/" className="hover:cursor-pointer p-2 py-2 text-5xl">
              ELVIOGROUP
            </Link>
          </div>
          <div className="">
            {login ? (
              <div className="flex items-center gap-4 mr-10 text-xl">
                <h1 className="hover:cursor-pointer">
                  <Link href="/account" className="hover:cursor-pointer">
                    ACCOUNT
                  </Link>
                </h1>
                <h1 className="hover:cursor-pointer">
                  <Link
                    href="/account/wishlist"
                    className="hover:cursor-pointer"
                  >
                    WISHLIST
                  </Link>
                </h1>
                <h1 className="hover:cursor-pointer">
                  <Link href="/account/bag" className="hover:cursor-pointer">
                    BAG : {amount || 0}
                  </Link>
                </h1>
              </div>
            ) : (
              <Link
                href={`/login`}
                className="hover:cursor-pointer p-2 select-none text-2xl flex h-full items-center"
              >
                <FontAwesomeIcon icon={faUser} className="mr-1" />
                <h1>Sign In</h1>
              </Link>
            )}
          </div>
        </div>
        <div className="items-center h-1/2">
          <div className="flex justify-center">
            <SearchBar />
          </div>
          <div className="flex justify-around bg-black text-white py-2 text-xl mt-5">
            {Catagory.map((item) => (
              <Link
                href={
                  item === "ALL"
                    ? "/product"
                    : `/product/category/${item.toLowerCase()}`
                }
                key={item}
                className="relative hover:cursor-pointer w-[10%] flex justify-center overflow-hidden group"
              >
                <span className="relative z-10 select-none w-full h-full flex justify-center">
                  {item}
                </span>
                <div className="absolute bottom-0 left-0 w-full h-0 bg-white transition-all ease-in-out duration-300 group-hover:h-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
