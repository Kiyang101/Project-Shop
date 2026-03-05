"use client";
import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { regist_handler } from "./action";
import { use, useActionState } from "react";
import Link from "next/link";

export default function Page() {
  const [peek, setPeek] = useState(false);
  const [peekConf, setPeekConf] = useState(false);
  const initState = {
    message: "",
  };
  const [state, formAction] = useActionState(regist_handler, initState);
  return (
    <>
      <div className="flex justify-center">
        <div>
          <div className="h-[10dvh] w-dvw flex justify-center items-center bg-[rgba(0,0,0,0.15)]">
            <h1 className="text-3xl">REGISTER</h1>
          </div>

          <div className="flex justify-center py-7 text-slate-400">
            <h1>NEW CUSTOMER</h1>
          </div>

          <form action={formAction} className="gap-4 flex flex-col select-none">
            <div className="flex justify-center">
              <div className="relative w-1/3">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon icon={faUser} className="text-slate-400 " />
                </div>
                <input
                  type="text"
                  name="name"
                  className="w-full peer bg-transparent text-black placeholder:text-slate-400  text-sm border border-slate-200  pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Name*"
                  required
                />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-1/3">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon icon={faUser} className="text-slate-400 " />
                </div>
                <input
                  type="text"
                  name="surName"
                  className="w-full peer bg-transparent placeholder:text-slate-400 text-black text-sm border border-slate-200  pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Surname*"
                  required
                />
              </div>
            </div>
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
            <div className="flex justify-center">
              <div className="relative w-1/3">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-slate-400 " />
                </div>
                <input
                  type={peekConf ? "text" : "password"}
                  name="confirm_password"
                  className="w-full peer bg-transparent placeholder:text-slate-400 text-black text-sm border border-slate-200  pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Confirm Password*"
                  required
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
            <div className="flex justify-center">
              <select
                name="country"
                className="w-1/3 peer bg-transparent text-slate-400 placeholder:text-slate-400 text-sm border border-slate-200 pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              >
                {/* Do not Hard Code like this */}
                <option value="">{"-- Please Select --"}</option>
                <option value="Australia">Australia</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Belgium">Belgium</option>
                <option value="Brazil">Brazil</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Canada">Canada</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Denmark">Denmark</option>
                <option value="Egypt">Egypt</option>
                <option value="Finland">Finland</option>
                <option value="France">France</option>
                <option value="Germany">Germany</option>
                <option value="Hong Kong">Hong Kong</option>
                <option value="Hungary">Hungary</option>
                <option value="India">India</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Israel">Israel</option>
                <option value="Italy">Italy</option>
                <option value="Japan">Japan</option>
                <option value="Kenya">Kenya</option>
                <option value="Laos">Laos</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Mexico">Mexico</option>
                <option value="Morocco">Morocco</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Netherlands">Netherlands</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Peru">Peru</option>
                <option value="Philippines">Philippines</option>
                <option value="Poland">Poland</option>
                <option value="Qatar">Qatar</option>
                <option value="Russia">Russia</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Singapore">Singapore</option>
                <option value="South Africa">South Africa</option>
                <option value="South Korea">South Korea</option>
                <option value="Spain">Spain</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Taiwan">Taiwan</option>
                <option value="Taiwan">Thailand</option>
                <option value="Turkey">Turkey</option>
                <option value="Ukraine">Ukraine</option>
                <option value="United Arab Emirates">
                  United Arab Emirates
                </option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Vietnam">Vietnam</option>
              </select>
            </div>
            <div className="flex justify-center" type="submit">
              <Button className="w-1/3 py-2 px-5 text-xl hover:cursor-pointer">
                Register
              </Button>
            </div>
          </form>
          <div className="flex justify-center my-10 text-lg text-slate-400">
            <h1>Already have an account?</h1>
            {/* <h1 className="ml-3 underline hover:cursor-pointer">Login</h1> */}
            <Link href="/login" className="ml-3 underline hover:cursor-pointer">
              Login
            </Link>
          </div>
          <div className="flex justify-center my-10 text-xl">
            {state?.message && <p>Message: {state?.message}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
