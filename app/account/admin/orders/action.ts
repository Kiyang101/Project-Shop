import useOrder from "@/service/order";
import useUser from "@/service/user";
import useHistory from "@/service/history";
import useProduct from "@/service/product";

export async function CancelOrder_handler(formData) {
  const _user = useUser();
  const _order = useOrder();
  const _history = useHistory();
  const _product = useProduct();

  const user = await _user.getUser();

  const { orderId, products, totalPrice } = formData;

  try {
    if (!orderId || !products || !totalPrice) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!user.login || user.role !== "admin") {
      return Response.json({ message: "login fail" });
    }

    const resHistory = await _history.postHistory({
      orderId: orderId,
      products: products,
      totalPrice: totalPrice,
    });

    const resOrder = await _order.updateStatus({
      orderId: orderId,
      status: "cancelled",
    });

    for (const item of products) {
      const product = await _product.getProductById(item.productId);
      const resStockandSold = await _product.updateStockandSold(
        item.productId,
        {
          quantity: product[0].quantity + item.quantity,
          sold: product[0].sold,
        },
      );
    }

    return { message: "success" };
  } catch (error) {
    console.log(error);
  }
}

export async function CompleteOrder_handler(formData) {
  const _user = useUser();
  const _order = useOrder();
  const _history = useHistory();
  const _product = useProduct();

  const user = await _user.getUser();

  //   console.log(formData);

  const { orderId, products, totalPrice } = formData;

  try {
    // console.log(orderId, products, totalPrice);

    if (!orderId || !products || !totalPrice) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!user.login || user.role !== "admin") {
      return Response.json({ message: "login fail" });
    }

    const resHistory = await _history.postHistory({
      orderId: orderId,
      products: products,
      totalPrice: totalPrice,
    });

    const resOrder = await _order.updateStatus({
      orderId: orderId,
      status: "complete",
    });

    for (const item of products) {
      const product = await _product.getProductById(item.productId);
      const resStockandSold = await _product.updateStockandSold(
        item.productId,
        {
          quantity: product[0].quantity,
          sold: product[0].sold + item.quantity,
        },
      );
    }

    // console.log(resHistory, resOrder);

    return { message: "success" };
  } catch (error) {
    console.log(error);
  }
}
