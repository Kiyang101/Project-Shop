"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./animate-ui/components/buttons/button";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { regist_handler } from "./action_auth";
import { use, useActionState } from "react";

export default function Register() {
  const initState = {
    message: "",
  };
  const [state, formAction] = useActionState(regist_handler, initState);
  const [peek, setPeek] = useState(false);
  const [peekConf, setPeekConf] = useState(false);
  return (
    <>
      <form
        action={formAction}
        className="w-[400px] h-[400px] bg-[#262626] rounded-2xl"
      >
        <div className="p-5 pt-10 text-white">
          <h1 className="text-center text-xl">Register</h1>
          <div className="mt-5">
            <div className="m-3 flex justify-center">
              <div className="relative w-[85%]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-slate-400"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  className="w-full peer bg-transparent placeholder:text-slate-400 text-white text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  required
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="m-3 flex justify-center">
              <div className="relative w-[85%]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon icon={faUser} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  className="w-full peer bg-transparent placeholder:text-slate-400 text-white text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  required
                  placeholder="Username"
                />
              </div>
            </div>
            <div className="m-3 flex justify-center">
              <div className="relative w-[85%]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-slate-400" />
                </div>
                <input
                  type={peek ? "text" : "password"}
                  name="password"
                  className="w-full peer bg-transparent placeholder:text-slate-400 text-white text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  required
                  placeholder="Password"
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
            <div className="m-3 flex justify-center">
              <div className="relative w-[85%]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-slate-400" />
                </div>
                <input
                  type={peekConf ? "text" : "password"}
                  name="confirm_password"
                  className="w-full peer bg-transparent placeholder:text-slate-400 text-white text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  required
                  placeholder="Confirm Password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 hover:cursor-pointer">
                  {peekConf && (
                    <FontAwesomeIcon
                      icon={faEye}
                      className="text-slate-400"
                      onClick={() => setPeekConf(false)}
                    />
                  )}
                  {!peekConf && (
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      className="text-slate-400"
                      onClick={() => setPeekConf(true)}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="m-3 flex justify-center mt-5 select-none">
              <Button type="submit" className="hover:cursor-pointer">
                Regist
              </Button>
            </div>
            <div className="flex justify-center ">
              {state.message && <p>Message: {state.message}</p>}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
