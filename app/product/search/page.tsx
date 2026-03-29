"use client";
import { useState, useEffect } from "react";
import ImageById from "@/components/ImageById";
import { search } from "./action";
import { useSearchParams } from "next/navigation";
import useProduct from "@/service/product";
import Link from "next/link";

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const _product = useProduct();

  const [sort, setSort] = useState("");
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initProducts = async () => {
      setLoading(true);

      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const productData = await _product.searchProduct(query);
        setProducts(productData || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    initProducts();
  }, [query]);

  return (
    <div className="flex max-h-[75.5dvh] min-h-[75.5dvh]">
      <div className="p-5 w-1/7 bg-gray-200 ">
        <div className="text-xl">
          <h1 className="text-2xl my-2">Sort by</h1>
          <div className="h-px bg-black"></div>
          <h1 className="bg-[#F1AE1D] px-3 py-1 my-2 mt-4 text-white rounded-sm">
            Relevance
          </h1>
          <div className="my-3">
            <select
              name="price-sort"
              id="price-sort"
              className="focus:outline-none w-full"
              onChange={(e) => {
                setSort(e.target.value);
              }}
            >
              <option value="">Sort by</option>
              <option value="lh">Low to High</option>
              <option value="hl">High to Low</option>
              <option value="az">A - Z</option>
              <option value="za">Z - A</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-6/7 overflow-y-auto min-h-[75.5dvh]">
        {loading ? (
          <div className="min-h-[70dvh] p-10 text-xl text-gray-500 flex justify-center items-center">
            <h1>Loading products...</h1>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="min-h-[70dvh] p-10 text-xl text-gray-500 flex justify-center items-center">
            <span className="font-bold">
              <h1>Product not found for "{query}"</h1>
            </span>
          </div>
        ) : (
          <div>
            {[...products]
              .sort((a, b) => {
                if (sort === "lh") {
                  return a.price - b.price;
                } else if (sort === "hl") {
                  return b.price - a.price;
                } else if (sort === "az") {
                  return a.productName.localeCompare(b.productName);
                } else if (sort === "za") {
                  return b.productName.localeCompare(a.productName);
                } else {
                  return a.productId - b.productId;
                }
              })
              .map((product) => {
                return (
                  <Link
                    href={`/product/${product.productId}`}
                    key={product.productId}
                    className="flex my-5 mx-10 p-5 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200"
                  >
                    <div className="w-48 h-48 shrink-0 rounded-sm overflow-hidden">
                      <ImageById
                        imageId={product.images[0]?.imageId}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-5">
                      <h1>{product.productName}</h1>
                      <p>{product.description}</p>
                      <p>Price: {product.price} THB</p>
                    </div>
                  </Link>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
