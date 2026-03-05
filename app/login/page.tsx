"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { use, useActionState } from "react";
import Link from "next/link";
import { login_handler } from "./action";

export default function Page() {
  const [peek, setPeek] = useState(false);
  const initState = {
    message: "",
  };
  const [state, formAction] = useActionState(login_handler, initState);
  const [remember, setRemember] = useState(false);

  return (
    <>
      <div className="flex justify-center">
        <div>
          <div className="h-[10dvh] w-dvw flex justify-center items-center bg-[rgba(0,0,0,0.15)]">
            <h1 className="text-3xl">SIGN IN</h1>
          </div>

          <div className="flex justify-center py-7 text-slate-400">
            <h1>ALREADY HAVE AN ACCOUNT ?</h1>
          </div>
          <form action={formAction} className="gap-4 flex flex-col select-none">
            <div className="flex justify-center">
              <div className="relative w-1/3">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-slate-400 "
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  className="w-full peer bg-transparent placeholder:text-slate-400 text-black text-sm border border-slate-200  pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Email*"
                  required
                />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-1/3">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-slate-400 " />
                </div>
                <input
                  type={peek ? "text" : "password"}
                  name="password"
                  className="w-full peer bg-transparent placeholder:text-slate-400 text-black text-sm border border-slate-200  pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Password*"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 hover:cursor-pointer">
                  {peek && (
                    <FontAwesomeIcon
                      icon={faEye}
                      className="text-slate-400"
                      onClick={() => setPeek(false)}
                    />
                  )}
                  {!peek && (
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      className="text-slate-400"
                      onClick={() => setPeek(true)}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center ">
              <div className="w-1/3 flex justify-between">
                <div className="relative flex gap-3.5">
                  <Checkbox
                    checked={remember}
                    onCheckedChange={() => setRemember(!remember)}
                    className="hover:cursor-pointer"
                  />
                  <h1>Remember Me</h1>
                </div>
                <div className="hover:cursor-pointer">
                  <h1 className="underline">Forgot Password?</h1>
                </div>
              </div>
            </div>
            <div className="flex justify-center" type="submit">
              <Button className="w-1/3 py-2 px-5 text-xl hover:cursor-pointer">
                SIGN IN
              </Button>
            </div>
            <div className="flex justify-center my-5 text-lg text-slate-400">
              <h1>Don't have an account?</h1>

              {/* <h1 className="ml-3 underline hover:cursor-pointer">Register</h1> */}
              <Link
                href="/register"
                className="ml-3 underline hover:cursor-pointer"
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
