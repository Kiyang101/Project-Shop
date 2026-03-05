"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar() {
  return (
    <>
      <div className="w-[80%] h-full">
        <form className="text-black">
          <div className="relative">
            <input
              type="text"
              id="search"
              className=" block w-full p-3 ps-9 bg-neutral-secondary-medium border text-heading border-black
              text-lg rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body rounded-3xl"
              placeholder="WHAT ARE YOU LOOKING FOR?"
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
    </>
  );
}
