import useProduct from "@/service/product";
import useUser from "@/service/user";
import useBag from "@/service/bag";
import useOrder from "@/service/order";
import { redirect } from "next/navigation";

export async function getProduct(id) {
  const _product = useProduct();
  const res = await _product.getProductById(id);
  return res;
}

export async function getTotalPrice(bagData) {
  const _product = useProduct();
  let totalPrice = 0;
  for (const item of bagData.products) {
    const product = await _product.getProductById(Number(item.productId));
    totalPrice += product[0].price * item.quantity;
  }
  return totalPrice;
}

export async function deleteProductFromBag(productId, size = null) {
  const _user = useUser();
  const _bag = useBag();
  const user = await _user.getUser();

  try {
    if (!user.login) {
      redirect("/home");
    }

    if (!productId) {
      return { message: "fail" };
    }

    const bag = await _bag.getBag();
    const bagData = bag.data;

    // If bag doesn't exist, there is nothing to delete
    if (bag.status === 404 || !bagData) {
      return { message: "fail" };
    }

    // Filter out the item(s) to be deleted
    const updatedProducts = bagData.products.filter((item) => {
      if (size) {
        // If size is provided, only remove the exact product variant
        return !(item.productId == productId && item.size == size);
      }
      // Otherwise, remove all instances of the productId
      return item.productId != productId;
    });

    // Send the updated array back to the database
    await _bag.putBag({
      products: updatedProducts,
      bagId: bagData.bagId,
    });

    window.dispatchEvent(new Event("update-bag"));

    return { message: "success" };
  } catch (error) {
    console.log(error);
    return { message: "fail" };
  }
}

export async function updateBag_handler(formData: {
  productId: Number;
  quantity: Number;
  size: String;
}) {
  const { productId, quantity, size } = formData;
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
      updatedProducts[existingItemIndex].quantity = quantity;
    } else {
      // Item does not exist: add it to the existing products array
      updatedProducts.push({ productId, quantity, size });
    }

    // Send the full updated array back to the database
    await _bag.putBag({
      products: updatedProducts,
      bagId: bagData.bagId,
    });

    window.dispatchEvent(new Event("update-bag"));

    return { message: "success" };
  } catch (error) {
    console.log(error);
    return { message: "fail" };
  }
}

export async function postOrder_handler(data) {
  const _user = useUser();
  const _product = useProduct();
  const _order = useOrder();
  const _bag = useBag();
  const user = await _user.getUser();

  const { bagId, products, totalPrice } = data;

  // console.log(products, totalPrice);

  try {
    if (!user.login) {
      redirect("/home");
    }

    if (!products || !totalPrice) {
      return { message: "fail" };
    }

    for (const item of products) {
      const product = await _product.getProductById(item.productId);
      item.productName = product[0].productName;
      item.price = product[0].price;
    }

    // console.log(products);

    const resPost = await _order.postOrder({
      products: products,
      userId: user.userId,
      totalPrice: totalPrice,
      status: "pending",
    });

    const resDelete = await _bag.deleteBag(bagId);

    for (const item of products) {
      const product = await _product.getProductById(item.productId);
      const resStockandSold = await _product.updateStockandSold(
        item.productId,
        {
          quantity: product[0].quantity - item.quantity,
          sold: product[0].sold,
        },
      );
    }

    window.dispatchEvent(new Event("update-bag"));

    return { message: "success" };
  } catch (error) {
    console.log(error);
  }
}
