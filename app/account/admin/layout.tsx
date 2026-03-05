import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faShirt,
  faBasketShopping,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex h-[75.5dvh] w-full overflow-hidden">
        <div className="flex w-1/5 bg-black text-white justify-center h-full">
          <div>
            <Link
              href="/account/admin/dashboard"
              className="py-10 flex items-center gap-3 cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
            >
              <FontAwesomeIcon icon={faChartLine} className="text-2xl" />

              <h1 className="text-xl m-0">Dashboard</h1>
            </Link>
            <Link
              href="/account/admin/products"
              className="py-10 flex items-center gap-3 cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
            >
              <FontAwesomeIcon icon={faShirt} className="text-2xl" />
              <h1 className="text-xl">Products</h1>
            </Link>
            <Link
              href="/account/admin/season-products"
              className="py-10 flex items-center gap-3 cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
            >
              <FontAwesomeIcon icon={faShirt} className="text-2xl" />

              <h1 className="text-xl">Season Products</h1>
            </Link>
            <Link
              href="/account/admin/orders"
              className="py-10 flex items-center gap-3 cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
            >
              <FontAwesomeIcon icon={faBasketShopping} className="text-2xl" />

              <h1 className="text-xl">Orders</h1>
            </Link>
            <Link
              href="/account/admin/wishlist"
              className="py-10 flex items-center gap-3 cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
            >
              <FontAwesomeIcon icon={faHeart} className="text-2xl" />

              <h1 className="text-xl">Wishlist</h1>
            </Link>
          </div>
        </div>

        {/* Main Content Area - Added overflow-y-auto so ONLY this area scrolls if needed */}
        <div className="w-4/5 p-5 overflow-y-auto bg-gray-200">{children}</div>
      </div>
    </>
  );
}
