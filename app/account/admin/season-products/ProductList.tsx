import ImageById from "@/components/ImageById";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { useState, useEffect } from "react";
import useProduct from "@/service/product";
export default function Page({ id }) {
  const productId = id.productId;
  const _product = useProduct();
  const [product, setProduct] = useState(null);

  const initProduct = async () => {
    const freshProduct = await _product.getProductById(productId);
    // console.log(freshProduct[0]);
    setProduct(freshProduct[0]);
  };

  useEffect(() => {
    initProduct();
  }, []);

  if (!product) {
    return (
      <tr>
        <td colSpan={6}>Loading...</td>
      </tr>
    );
  }

  const handelDelete = async (productId: Number) => {
    // console.log(productId);
    const id = productId;
    await _product.deleteSeasonProduct(id);

    window.location.reload();
  };

  return (
    <>
      <tr className="border-b border-gray-200">
        <td className="py-6 px-5">
          <div className="flex">
            <div className="">
              <ImageById
                imageId={product.images[0].imageId}
                className={""}
                orientation=""
              />
            </div>
          </div>
        </td>
        <td className="py-6 px-4 align-top text-left text-xl leading-relaxed">
          <h1 className="ml-3 text-xl">{product.productName}</h1>
        </td>
        {/* <td className="py-6 text-center align-top text-xl text-gray-500 uppercase">
          {product.price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </td> */}
        {/* <td className="py-6 text-center align-top text-xl">
          {product.quantity}
        </td> */}
        {/* <td className="py-6 flex justify-center align-top text-xl">
          <div className="w-1/2 text-center">
            {product.active ? (
              <div className="bg-green-500 py-1 rounded-lg text-white">
                Active
              </div>
            ) : (
              <div className="bg-red-500 py-1 rounded-lg text-white">
                Inactive
              </div>
            )}
          </div>
        </td> */}
        <td className="py-6 text-center align-top text-xl">
          <Button
            className="hover:cursor-pointer select-none"
            onClick={() => handelDelete(productId)}
          >
            Delete
          </Button>
        </td>
      </tr>
    </>
  );
}
