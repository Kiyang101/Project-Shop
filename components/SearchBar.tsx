"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, redirect } from "next/navigation";

export default function SearchBar() {
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get the search term from the form
    const formData = new FormData(e.currentTarget);
    const term = formData.get("search") as string;

    // Update the URL parameters safely
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    // Replace the current URL without a full page reload
    redirect(`/product/search?${params.toString()}`);
    // window.location.href = `/product/search?${params.toString()}`;
  };

  return (
    <>
      <div className="w-[80%] h-full">
        <form onSubmit={handleSearch} className="text-black">
          <div className="relative">
            <input
              type="text"
              name="search"
              className=" block w-full p-3 ps-9 bg-neutral-secondary-medium border text-heading border-black
              text-lg rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body rounded-3xl"
              placeholder="WHAT ARE YOU LOOKING FOR?"
              required
              suppressHydrationWarning={true}
            />
            <button
              type="submit"
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
