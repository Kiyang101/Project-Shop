"use client";
import { Logout } from "./action";
import { useState, useEffect } from "react";
import useUser from "@/service/user";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ImageByUser from "@/components/ImageByUser";
import { useActionState } from "react";
import { updateImage_handler, updateData_handler } from "./action";

const onRefreshInfo = () => {
  window.location.reload();
};

export default function Page() {
  const _user = useUser();
  const [user, setUser] = useState({});
  const initUser = async () => {
    const user = await _user.getUser();
    setUser(user);
  };

  useEffect(() => {
    initUser();
  }, []);

  const initStateProductImage = {
    message: "",
  };
  const [stateUserdata, formActionUserData] = useActionState(
    updateData_handler,
    initStateProductImage,
  );
  const [updateImage, setUpdateImage] = useState(false);

  useEffect(() => {
    if (stateUserdata?.message === "success") {
      onRefreshInfo();
    }
  }, [stateUserdata, onRefreshInfo]);
  return (
    <>
      <div className="mb-2">
        {user && (
          <p className="text-center text-xl">
            WELCOME {user.name ? user.name.toUpperCase() : ""}{" "}
            {user.surName ? user.surName.toUpperCase() : ""} !
          </p>
        )}
        <p className="text-center text-gray-400">
          Here you can keep track of your recent activity. view and edit your
          account, and view or edit your list of faverite products.
        </p>
      </div>
      <div className="w-full">
        {/* <h1 className="text-center underline text-xl">ACCOUNT INFORMATION</h1>
         */}
        <div className="flex items-center justify-center mb-8">
          <hr className="w-20 border-gray-400" />
          <h1 className="mx-4 text-lg font-medium text-gray-700 tracking-widest uppercase">
            ACCOUNT INFORMATION
          </h1>
          <hr className="w-20 border-gray-400" />
        </div>
        <div className="flex justify-center">
          {updateImage && (
            <UpdateImage
              onClose={() => setUpdateImage(false)}
              onRefresh={() => {
                setUpdateImage(false);
                window.location.reload();
              }}
            />
          )}
          <form action={formActionUserData} className="w-1/2">
            <div className="flex justify-center my-2 ">
              <div
                className="group relative w-40 h-40"
                onClick={() => setUpdateImage(true)}
              >
                {user.userId && (
                  <ImageByUser
                    userId={user.userId}
                    className={
                      "rounded-full w-full h-full object-cover group-hover:opacity-75 group-hover:shadow-xl group-hover:cursor-pointer group-hover:blur-sm transition-all ease-in-out duration-300"
                    }
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center invisible group-hover:visible group-hover:cursor-pointer pointer-events-none transition-all ease-in-out ">
                  <span className="text-white text-xl font-bold">
                    Change Image
                  </span>
                </div>
              </div>
            </div>

            <div className="relative my-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon icon={faUser} className="text-slate-400 " />
              </div>
              <input
                type="text"
                name="name"
                className="w-full peer bg-transparent placeholder:text-slate-400 text-black text-lg border border-slate-200  pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Name*"
                required
                defaultValue={user.name}
              />
            </div>
            <div className="relative my-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon icon={faUser} className="text-slate-400 " />
              </div>
              <input
                type="text"
                name="surName"
                className="w-full peer bg-transparent placeholder:text-slate-400 text-black text-lg border border-slate-200  pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="SurName"
                required
                defaultValue={user.surName}
              />
            </div>
            <div className="relative my-2 w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-slate-400 "
                />
              </div>
              <input
                type="email"
                name="email"
                className="w-full peer bg-transparent placeholder:text-slate-400 text-black text-lg border border-slate-200  pl-10 pr-3 py-1 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Email*"
                defaultValue={user.email}
                readOnly
              />
            </div>
            {/* <div className="text-center my-2">CHANGE PASSWORD ?</div> */}
            <div className="w-full my-2">
              <Button className="w-full hover:cursor-pointer">SAVE</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

const UpdateImage = ({ userId, onClose, onRefresh }) => {
  const initStateProductImage = {
    message: "",
  };
  const [stateProductImage, formActionUserImage] = useActionState(
    updateImage_handler,
    initStateProductImage,
  );
  useEffect(() => {
    if (stateProductImage?.message === "success") {
      onRefresh();
      onClose();
    }
  }, [stateProductImage, onRefresh, onClose]);

  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-2xl border border-gray-200">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-4">Update Image</h1>
          <button
            onClick={onClose}
            className="hover:cursor-pointer -translate-y-5 translate-x-3"
          >
            <FontAwesomeIcon icon={faXmark} className="text-2xl" />
            {""}
          </button>
        </div>
        <form action={formActionUserImage} className="gap-4 flex flex-col">
          {preview && (
            <div className="w-full flex justify-center mb-2">
              <img
                src={preview}
                alt="Selected preview"
                className="w-32 h-32 object-cover rounded-full border border-gray-300"
              />
            </div>
          )}
          <input
            className="border border-gray-300 p-2 rounded w-full hover:cursor-pointer"
            type="file"
            accept="image/*"
            name="file"
            onChange={handleImageChange}
          />
          <Button className="w-full">Update</Button>
        </form>

        {stateProductImage?.message && (
          <div className="mt-6 p-2 bg-blue-50 text-blue-700 text-center rounded">
            {stateProductImage.message}
          </div>
        )}
      </div>
    </div>
  );
};
