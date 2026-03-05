import useBag from "@/service/bag";
import { redirect } from "next/navigation";
import useUser from "@/service/user";
import useWishlist from "@/service/wishlist";

export async function postBag_handler(
  prevState,
  formData: { productId: Number; quantity: Number; size: String },
) {
  // const { productId, quantity, size } = formData;
  const productId = formData.get("productId");
  const quantity = Number(formData.get("quantity"));
  const size = formData.get("size");

  const _user = useUser();
  const _bag = useBag();
  const user = await _user.getUser();

  try {
    if (!user.login) {
      redirect("/home");
    }

    if (!productId || !quantity || !size) {
      return { message: "fail" };
    }

    const bag = await _bag.getBag();
    const bagData = bag.data;

    // If bag doesn't exist, create a new one
    if (bag.status === 404 || !bagData) {
      await _bag.postBag({
        products: [{ productId, quantity, size }],
        userId: user.userId,
      });
      return { message: "success" };
    }

    // Check if the exact product and size already exists in the bag
    const existingItemIndex = bagData.products.findIndex(
      (item) => item.productId == productId && item.size == size,
    );

    let updatedProducts = [...bagData.products];

    if (existingItemIndex !== -1) {
      // Item exists: update only its quantity
      updatedProducts[existingItemIndex].quantity =
        Number(updatedProducts[existingItemIndex].quantity) + quantity;
    } else {
      // Item does not exist: add it to the existing products array
      updatedProducts.push({ productId, quantity, size });
    }

    // Send the full updated array back to the database
    await _bag.putBag({
      products: updatedProducts,
      bagId: bagData.bagId,
    });

    return { message: "success" };
  } catch (error) {
    console.log(error);
    return { message: "fail" };
  }
}

export async function postWishlist_handler(
  prevState,
  formData: { productId: Number },
) {
  // const { productId } = formData;
  const productId = formData.get("productId");
  const _user = useUser();
  const _wishlist = useWishlist();

  try {
    const user = await _user.getUser();

    if (!user || !user.login) {
      redirect("/home");
    }

    if (!productId || !user.userId) {
      return { message: "fail" };
    }
    const currentWishlist = await _wishlist.getWishlist({
      userId: user.userId,
    });

    const alreadyExists = currentWishlist.some((item) => {
      if (item.productId == productId) {
        return true;
      }

      // console.log(`item.productId: ${item.productId}, productId: ${productId}`);
    });

    if (alreadyExists) {
      return { message: "already_exists" };
    }

    const result = await _wishlist.postWishlist({
      productId: productId,
      userId: user.userId,
    });

    return { message: "success" };
  } catch (error) {
    console.error("Wishlist handler error:", error);
    return { message: "error" };
  }
}
