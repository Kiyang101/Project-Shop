"use client";
import { MotionCarousel } from "@/components/animate-ui/components/community/motion-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import RatingStar from "@/components/RatingStar";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useProduct from "@/service/product";
import { postBag_handler, postWishlist_handler } from "./action";
import { useActionState } from "react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  type AlertDialogContentProps,
} from "@/components/animate-ui/components/radix/alert-dialog";

export default function Page() {
  const params = useParams();
  const id = params.id;
  const _product = useProduct();
  const [products, setProducts] = useState([]);

  const initStateBag = {
    message: "",
  };

  const initStateWishlist = {
    message: "",
  };
  const [stateBag, formActionBag] = useActionState(
    postBag_handler,
    initStateBag,
  );
  const [stateWishlist, formActionWishlist] = useActionState(
    postWishlist_handler,
    initStateWishlist,
  );

  const initProduct = async () => {
    const product = await _product.getProductById(id);
    setProducts(product);
  };

  useEffect(() => {
    initProduct();
  }, []);

  const [Quantity, setQuantity] = useState(0);
  const [size, setSize] = useState("");

  const addQuantity = () => {
    if (size) {
      setQuantity((prev) => prev + 1);
    }
  };
  useEffect(() => {
    if (size) {
      setQuantity(1);
    } else {
      setQuantity(0);
    }
  }, [size]);

  // const handle = () => {
  //   formActionBag({
  //     productId: id,
  //     quantity: Quantity,
  //     size: size,
  //   });
  // };

  // const handleWishlist = () => {
  //   formActionWishlist({
  //     productId: id,
  //   });
  // };

  return (
    <>
      <div className="">
        {products && (
          <div className="">
            {products.map((product) => {
              return (
                <div
                  key={product.productId}
                  className="flex justify-around pt-[3%]"
                >
                  <div className="w-[60%]">
                    <MotionCarousel
                      slides={product.images}
                      options={{ loop: true }}
                    />
                  </div>
                  <div className="ml-10 my-10 w-[25%] text-2xl ">
                    {/* <div>
                      <h1>Product Id: {product.productId}</h1>
                    </div> */}
                    <div className="text-3xl">
                      <h1>{product.productName}</h1>
                      <div className="text-xl text-gray-400 flex gap-3">
                        <p>ID{product.productId}</p>
                        <RatingStar rating={product.rating} />
                      </div>
                    </div>
                    <div className="mt-5">
                      <h1>
                        ฿
                        {product.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </h1>
                    </div>
                    <div className="mt-5 text-xl">
                      <h1>{product.description}</h1>
                    </div>
                    <div className="mt-5 text-xl">
                      <h1>SIZE</h1>
                      <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full border border-gray-500 mt-2 py-2"
                      >
                        <option value="">-- Please Select --</option>
                        <option value="s">S</option>
                        <option value="m">M</option>
                        <option value="l">L</option>
                        <option value="free size">FREE SIZE</option>
                      </select>
                    </div>
                    <div className="mt-5 text-xl">
                      <h1>QUANTITY</h1>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <button
                        type="button"
                        className="hover:cursor-pointer hover:scale-125 transition-all duration-200 ease-in-out"
                        onClick={(e) => {
                          e.preventDefault();
                          if (Quantity > 1) {
                            setQuantity(Quantity - 1);
                          }
                        }}
                        disabled={!size}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                        {""}
                      </button>
                      <h1>{Quantity}</h1>
                      <button
                        type="button"
                        className="hover:cursor-pointer hover:scale-125 transition-all duration-200 ease-in-out"
                        onClick={addQuantity}
                        disabled={!size}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        {""}
                      </button>
                    </div>
                    <div className="mt-5">
                      {/* <Button className="text-xl px-5 py-6 hover:cursor-pointer">
                        Add to Wishlist
                      </Button> */}
                      <form action={formActionBag}>
                        <input type="hidden" name="productId" value={id} />
                        <input type="hidden" name="quantity" value={Quantity} />
                        <input type="hidden" name="size" value={size} />
                        <AlertDialog>
                          <AlertDialogTrigger
                            type="submit"
                            className="text-xl px-5 py-3 hover:cursor-pointer w-full bg-black text-white rounded-xl cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out"
                          >
                            Add to Bag
                          </AlertDialogTrigger>
                          {stateBag?.message &&
                            stateBag?.message === "success" && (
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-2xl">
                                    Product added to your bag.
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-xl">
                                    View your selections by clicking the Bag in
                                    the top right corner.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogAction className="text-xl cursor-pointer">
                                    Close
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            )}
                        </AlertDialog>
                        {/* <Button
                          type="submit"
                          className="text-xl px-5 py-6 hover:cursor-pointer w-full"
                        >
                          Add to Bag
                        </Button> */}
                      </form>
                    </div>
                    <form action={formActionWishlist}>
                      <input type="hidden" name="productId" value={id} />
                      <AlertDialog>
                        <AlertDialogTrigger
                          type="submit"
                          className="mt-3 text-lg cursor-pointer hover:underline select-none"
                        >
                          ADD TO WISHLIST
                        </AlertDialogTrigger>
                        {stateWishlist?.message &&
                          stateWishlist?.message === "success" && (
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl">
                                  Saved to your wishlist!
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-xl">
                                  Your wishlist is waiting for you—check the top
                                  right corner.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogAction className="text-xl cursor-pointer">
                                  Close
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          )}
                      </AlertDialog>
                      {/* <button
                        type="submit"
                        className="mt-3 text-lg cursor-pointer hover:underline select-none"
                      >
                        ADD TO WISHLIST
                      </button> */}
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="absolute top-1/2 left-1/2 flex justify-center z-50"></div>
      </div>
    </>
  );
}
