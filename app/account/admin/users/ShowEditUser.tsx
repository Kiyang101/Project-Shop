import { useState, useEffect, useActionState } from "react";
import useUser from "@/service/user";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import ImageByUser from "@/components/ImageByUser";
import { updateUser_role } from "./action";

export default function ShowEditProduct({ user, onClose, onRefresh }) {
  const initState = {
    message: "",
  };
  const [state, formAction] = useActionState(updateUser_role, initState);
  useEffect(() => {
    if (state?.message === "success") {
      onRefresh();
      onClose();
    }
  }, [state]);

  return (
    <>
      <div className="fixed w-1/2 min-h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white shadow-2xl rounded-lg">
        <div className="absolute top-0 right-0 p-5 ">
          <button onClick={onClose} className="hover:cursor-pointer">
            <FontAwesomeIcon icon={faXmark} className="text-2xl" />
            {""}
          </button>
        </div>
        <div className="text-2xl font-bold border-b pb-2 ml-4 mt-4">
          User Information
        </div>
        <div className="p-5">
          <div className="flex justify-center w-full">
            <div className="w-30 h-30">
              <ImageByUser userId={user.userId} className={"rounded-full"} />
            </div>
          </div>

          <form className="mt-5 space-y-4" action={formAction}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user.name}
                  className="w-full rounded-lg bg-transparent text-black text-lg border border-slate-200 pl-5 pr-3 py-2 focus:outline-none focus:border-slate-400"
                  required
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">surName</label>
                <input
                  type="text"
                  name="surName"
                  defaultValue={user.surName}
                  className="w-full rounded-lg bg-transparent text-black text-lg border border-slate-200 pl-5 pr-3 py-2 focus:outline-none focus:border-slate-400"
                  required
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  className="w-full rounded-lg bg-transparent text-black text-lg border border-slate-200 pl-5 pr-3 py-2 focus:outline-none focus:border-slate-400"
                  required
                  disabled
                />
              </div>

              {/* Role Dropdown */}
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Role</label>
                <select
                  name="role"
                  key={user?.role}
                  defaultValue={user?.role || ""}
                  className="w-full rounded-lg bg-transparent text-black text-lg border border-slate-200 pl-5 pr-3 py-2 focus:outline-none focus:border-slate-400 appearance-none bg-white"
                  required
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  <option value="user" disabled={user.role === "admin"}>
                    user
                  </option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">User Id</label>
                <input
                  type="number"
                  name="userId"
                  defaultValue={user.userId}
                  className="w-full rounded-lg bg-transparent text-black text-lg border border-slate-200 pl-5 pr-3 py-2 focus:outline-none focus:border-slate-400"
                  required
                  readOnly
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  defaultValue={user.country}
                  className="w-full rounded-lg bg-transparent text-black text-lg border border-slate-200 pl-5 pr-3 py-2 focus:outline-none focus:border-slate-400"
                  required
                  disabled
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 mt-6">
              <Button
                type="submit"
                className="bg-black text-white px-6 py-5 text-xl cursor-pointer"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
