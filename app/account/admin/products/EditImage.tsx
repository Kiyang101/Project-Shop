"use client";
import { useState, useEffect, useActionState } from "react";
import useProduct from "@/service/product";
import useUser from "@/service/user";
import ImageById from "@/components/ImageById";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { postProductImage_handler, updateProduct_handler } from "./action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useImage from "@/service/image";
import useAuth from "@/service/auth";
import AddImage from "./AddImage";

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

export default function EditImage({ imageIds, productId, onRefresh }) {
  const [addImage, setAddImage] = useState(false);
  const _image = useImage();

  const deleteImage = async (imageId) => {
    await _image.DeleteImage(imageId);
    onRefresh();
  };

  return (
    // Wrapped in a clean, card-like container
    <div className="flex flex-col w-full">
      {addImage && (
        <AddImage
          imageId={productId}
          onClose={() => setAddImage(false)}
          onRefresh={onRefresh}
        />
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold">Product Images</h2>
        <button
          className="px-4 py-2 bg-black text-white text-sm rounded-md cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out"
          onClick={() => setAddImage(true)}
        >
          + Add Image
        </button>
      </div>

      {/* Image Grid Section */}
      <div className="p-4 w-full">
        {imageIds.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-sm">No images uploaded yet.</p>
          </div>
        ) : (
          /* Responsive Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full select-none">
            {imageIds.map((imageId) => (
              <div key={imageId} className="relative group overflow-hidden">
                <div className="w-full aspect-square bg-gray-100 rounded-md overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <ImageById imageId={imageId} orientation="" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 flex bg-black/60 text-white text-center py-4 translate-y-full group-hover:translate-y-0 transition duration-300 px-10">
                    <AlertDialog>
                      <AlertDialogTrigger className="flex justify-center w-full h-full items-center cursor-pointer">
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="text-2xl text-red-500"
                        />
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl">
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-xl">
                            This action cannot be undone. This will permanently
                            delete.
                            <ImageById imageId={imageId} orientation="" />
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="text-xl cursor-pointer">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteImage(imageId)}
                            className="text-xl cursor-pointer"
                          >
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    {/* <div
                      className="flex justify-center w-full h-full items-center cursor-pointer"
                      onClick={() => deleteImage(imageId)}
                    >
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="text-2xl text-red-500"
                      />
                      {""}
                    </div> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
