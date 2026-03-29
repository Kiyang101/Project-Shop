import useProduct from "@/service/product";
import { useEffect, useState } from "react";
import ImageById from "@/components/ImageById";
import useWishlist from "@/service/wishlist";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "@/components/animate-ui/components/radix/alert-dialog";

export default function ProductList({ productId, id, onRefresh }) {
  const [product, setProduct] = useState(null);
  const _product = useProduct();
  const _wishlist = useWishlist();
  const router = useRouter();

  const initProduct = async () => {
    const product = await _product.getProductById(productId);
    setProduct(product[0]);
  };

  useEffect(() => {
    initProduct();
  }, []);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent default Radix close behavior momentarily
    try {
      // Assuming deleteWishlist is an async API call
      await _wishlist.deleteWishlist(id);
      // window.location.reload();
      onRefresh();
      // router.refresh();
    } catch (error) {
      console.error("Failed to delete from wishlist:", error);
    }
  };

  return (
    // FIX 2: Make the outer wrapper a standard <div>, not a <Link>
    <div className="relative flex hover:scale-105 transition-all ease-in-out duration-300 shadow-2xl rounded-sm">
      {/* The Link now ONLY wraps the actual product details */}
      <Link
        href={`/product/${product.productId}`}
        className="flex gap-5 w-full"
      >
        <div className="w-1/2">
          <ImageById
            imageId={product.images[0].imageId}
            className="rounded-l-sm"
          />
        </div>
        <div className="text-2xl w-1/2 py-2 px-5">
          <h1 className="my-2">{product.productName}</h1>
          <h1>{product.category}</h1>
          <h1 className="my-2">
            {product.price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            THB
          </h1>
        </div>
      </Link>

      {/* The Dialog is now a SIBLING to the link, positioned absolutely on top of the card */}
      <AlertDialog>
        <AlertDialogTrigger className="text-lg absolute bottom-5 right-5 hover:underline cursor-pointer p-2 z-2 bg-white/80 rounded">
          Remove from Wishlist
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xl">
              This action cannot be undone. This will permanently delete from
              your wishlist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xl cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="text-xl cursor-pointer"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
