"use client";
import { useState, useEffect } from "react";
import useUser from "@/service/user";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faCity,
  faEnvelope,
  faGlobe,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { address_handler } from "./action";
import { useActionState } from "react";

const COUNTRIES = [
  "Australia",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Cambodia",
  "Canada",
  "Chile",
  "China",
  "Czech Republic",
  "Denmark",
  "Egypt",
  "Finland",
  "France",
  "Germany",
  "Hong Kong",
  "Hungary",
  "India",
  "Indonesia",
  "Israel",
  "Italy",
  "Japan",
  "Kenya",
  "Laos",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Myanmar",
  "Netherlands",
  "New Zealand",
  "Pakistan",
  "Peru",
  "Philippines",
  "Poland",
  "Qatar",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Taiwan",
  "Thailand",
  "Turkey",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
];

export default function Page() {
  const _user = useUser();
  const [user, setUser] = useState({});
  const [address, setAddress] = useState({});

  const initUser = async () => {
    const userz = await _user.getUser();
    const addressz = await _user.getAddress();
    setUser(userz);
    setAddress(addressz.data);
  };

  useEffect(() => {
    initUser();
  }, []);

  const initState = {
    message: "",
  };
  const [state, formAction] = useActionState(address_handler, initState);

  useEffect(() => {
    if (state?.message === "success") {
      window.location.reload();
    }
  }, [state]);
  return (
    <>
      <div className="w-full mt-5">
        {/* <h1 className="text-center underline text-xl">ADDRESS BOOK</h1> */}
        <div className="flex items-center justify-center mb-8">
          <hr className="w-20 border-gray-400" />
          <h1 className="mx-4 text-lg font-medium text-gray-700 tracking-widest uppercase">
            ADDRESS BOOK
          </h1>
          <hr className="w-20 border-gray-400" />
        </div>
        <div className="flex justify-center">
          <form action={formAction} className="w-1/2">
            <div className="relative my-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon icon={faUser} className="text-slate-400 " />
              </div>
              <input
                type="text"
                name="name"
                className="w-full peer bg-transparent placeholder:text-slate-400 text-black text-lg border border-slate-200  pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Name*"
                required
                defaultValue={address?.name || user?.name}
              />
            </div>
            <div className="relative my-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon icon={faUser} className="text-slate-400 " />
              </div>
              <input
                type="text"
                name="surName"
                className="w-full peer bg-transparent placeholder:text-slate-400 text-black text-lg border border-slate-200  pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="surName*"
                required
                defaultValue={address?.surName || user.surName}
              />
            </div>
            <div className="relative my-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon
                  icon={faAddressBook}
                  className="text-slate-400 "
                />
              </div>
              <input
                type="text"
                name="address"
                className="w-full peer bg-transparent placeholder:text-slate-400 text-black text-lg border border-slate-200  pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Address*"
                required
                defaultValue={address?.address || ""}
              />
            </div>
            <div className="relative my-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon icon={faCity} className="text-slate-400 " />
              </div>
              <input
                type="text"
                name="town"
                className="w-full peer bg-transparent placeholder:text-slate-400 text-black text-lg border border-slate-200  pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Town / City*"
                required
                defaultValue={address?.town || ""}
              />
            </div>
            <div className="relative my-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon icon={faCity} className="text-slate-400 " />
              </div>
              <input
                type="text"
                name="state"
                className="w-full peer bg-transparent placeholder:text-slate-400 text-black text-lg border border-slate-200  pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="State / Province*"
                required
                defaultValue={address?.state || ""}
              />
            </div>
            <div className="relative my-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-slate-400 "
                />
              </div>
              <input
                type="text"
                name="zipcode"
                className="w-full peer bg-transparent placeholder:text-slate-400 text-black text-lg border border-slate-200  pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Zip / Postal Code*"
                required
                defaultValue={address?.zipcode || ""}
              />
            </div>
            <div className="relative my-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon icon={faPhone} className="text-slate-400 " />
              </div>
              <input
                type="tel"
                name="telephone"
                className="w-full peer bg-transparent placeholder:text-slate-400 text-black text-lg border border-slate-200  pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Telephone*"
                inputMode="tel"
                required
                defaultValue={address?.telephone || ""}
              />
            </div>
            <div className="relative my-2 ">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon icon={faGlobe} className="text-slate-400 " />
              </div>
              <select
                key={address?.country || "default"}
                required
                name="country"
                defaultValue={address?.country || ""}
                className={`w-full peer bg-transparent text-slate-400 placeholder:text-slate-400 text-lg border border-slate-200 pl-10 pr-3 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
              >
                <option value="" disabled>
                  -- Please Select Country --
                </option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {/* <select
                key={address?.country || ""}
                required
                name="country"
                defaultValue={address?.country || ""}
                className="w-full peer bg-transparent text-slate-400 placeholder:text-slate-400 text-sm border border-slate-200 pl-10 pr-3 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              >
                <option value="">{"-- Please Select Country --"}</option>
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
                <option value="Thailand">Thailand</option>
                <option value="Turkey">Turkey</option>
                <option value="Ukraine">Ukraine</option>
                <option value="United Arab Emirates">
                  United Arab Emirates
                </option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Vietnam">Vietnam</option>
              </select> */}
            </div>
            <div className="w-full my-2">
              <Button className="w-full hover:cursor-pointer">SAVE</Button>
            </div>
          </form>
        </div>
        {state?.message && (
          <div className="mt-6 p-2 bg-blue-50 text-blue-700 text-center rounded">
            {state.message}
          </div>
        )}
      </div>
    </>
  );
}
