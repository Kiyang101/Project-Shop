"use client";
import { useState, useEffect } from "react";
// import Auth from "./Auth";
import useUser from "@/service/user";
import useAuth from "@/service/auth";
import Link from "next/link";

export default function SideBar() {
  const [user, setUser] = useState({});
  const _user = useUser();
  const _auth = useAuth();

  const initUser = async () => {
    const user = await _user.getUser();
    setUser(user);
  };

  useEffect(() => {
    initUser();
  }, []);
  return (
    <>
      <div className="w-1/4 text-2xl flex justify-center select-none">
        <div className="text-center">
          <div className="py-7 px-7 border-b border-black">
            <Link href="/account/information">
              <h1 className="hover:cursor-pointer hover:scale-110 transition-all ease-in-out duration-300">
                ACCOUNT INFOMATION
              </h1>
            </Link>
          </div>
          <div className="py-7 px-7 border-b border-black">
            <Link href="/account/address">
              <h1 className="hover:cursor-pointer hover:scale-110 transition-all ease-in-out duration-300">
                ADDRESS BOOK
              </h1>
            </Link>
          </div>
          <div className="py-7 px-7 border-b border-black">
            <Link href="/account/order">
              <h1 className="hover:cursor-pointer hover:scale-110 transition-all ease-in-out duration-300">
                ORDER STATUS
              </h1>
            </Link>
          </div>
          {user.role === "admin" && (
            <div className="py-7 px-7 border-b border-black">
              <Link href="/account/admin">
                <h1 className="hover:cursor-pointer hover:scale-110 transition-all ease-in-out duration-300">
                  ADMIN DASHBOARD
                </h1>
              </Link>
            </div>
          )}

          <div className="py-7 px-7 border-b border-black">
            <h1
              onClick={Logout}
              className="hover:cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
            >
              LOGOUT
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}

const Logout = async () => {
  const _auth = useAuth();
  const res = await _auth.logout();
  if (res.logout) {
    window.location.href = "/login";
    return;
  }

  return;
};
