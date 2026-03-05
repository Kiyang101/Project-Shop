"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import useProduct from "@/service/product";
import ImageById from "@/components/ImageById";
import Link from "next/link";
export default function Page() {
  const params = useParams();
  const _product = useProduct();
  const [products, setProducts] = useState([]);
  const category = params.cate.toString();
  // console.log(category);

  const initProduct = async () => {
    const product = await _product.getProductByCategory(category);
    setProducts(product);
  };

  useEffect(() => {
    initProduct();
    // initProductImage();
  }, []);

  // productId productName desctiption price sold rating category quantity size active

  // console.log(category);
  return (
    <>
      <div className="flex justify-center">
        <div className="h-[8dvh] w-dvw flex justify-center items-center bg-[rgba(0,0,0,0.15)]">
          <h1 className="text-5xl">{category?.toUpperCase()}</h1>
        </div>
      </div>
      {ProductShow({ products: products })}
    </>
  );
}

export function ProductShow({ products }) {
  if (!products || products.length === 0) return null;
  // console.log(products);

  return (
    <div>
      {/* --- HERO SECTION (First 5 Products) --- */}
      <div className="flex justify-center gap-5 mt-5 my-4 px-4 ">
        {/* Left half: Product 0 */}
        <div className="flex justify-center w-[48%] ">
          {products[0] && (
            // Updated to exact 625px height
            <Link
              href={`/product/${products[0].productId}`}
              className="w-full h-[625px] group hover:cursor-pointer hover:scale-[102%] transition-all ease-in-out duration-300"
            >
              <ImageById
                imageId={products[0].imageIds[0]}
                orientation="horizontal"
              />
              <div className=""></div>
            </Link>
          )}
        </div>

        {/* Right half: Products 1, 2, 3, 4 */}
        <div className="flex gap-2.5 justify-center w-1/2 items-center ">
          {/* Column 1: Products 1 and 3 */}
          <div className="w-1/2 flex flex-col gap-2.5">
            {products[1] && (
              // Updated to 307.5px (625px - 10px gap / 2)
              <Link
                href={`/product/${products[1].productId}`}
                className="w-full h-[307.5px] hover:cursor-pointer hover:scale-[102%] transition-all ease-in-out duration-300"
              >
                <ImageById
                  imageId={products[1].imageIds[0]}
                  orientation="horizontal"
                />
              </Link>
            )}
            {products[3] && (
              <Link
                href={`/product/${products[3].productId}`}
                className="w-full h-[307.5px] hover:cursor-pointer hover:scale-[102%] transition-all ease-in-out duration-300"
              >
                <ImageById
                  imageId={products[3].imageIds[0]}
                  orientation="horizontal"
                />
              </Link>
            )}
          </div>

          {/* Column 2: Products 2 and 4 */}
          <div className="w-1/2 flex flex-col gap-2.5">
            {products[2] && (
              <Link
                href={`/product/${products[2].productId}`}
                className="w-full h-[307.5px] hover:cursor-pointer hover:scale-[102%] transition-all ease-in-out duration-300"
              >
                <ImageById
                  imageId={products[2].imageIds[0]}
                  orientation="horizontal"
                />
              </Link>
            )}
            {products[4] && (
              <Link
                href={`/product/${products[4].productId}`}
                className="w-full h-[307.5px] hover:cursor-pointer hover:scale-[102%] transition-all ease-in-out duration-300"
              >
                <ImageById
                  imageId={products[4].imageIds[0]}
                  orientation="horizontal"
                />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* --- GRID SECTION (Products 5 and beyond) --- */}
      {products.length > 5 && (
        <div className="grid grid-cols-4 gap-2.5 px-4 mt-5">
          {products.slice(5).map((product, index) => (
            <div key={product.productId || index}>
              {/* You can adjust this one to match your design taste, I left it at 250px */}
              <Link
                href={`/product/${product.productId}`}
                className="w-full h-[250px] hover:cursor-pointer hover:scale-[102%] transition-all ease-in-out duration-300"
              >
                <ImageById
                  imageId={product.imageIds[0]}
                  orientation="horizontal"
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
