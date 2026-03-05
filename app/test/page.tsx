"use client";
import { useState, useEffect } from "react";

import ImageById from "@/components/ImageById";

export default function Page() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    // This only runs on the client (browser)
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    setHeight(currentHeight);
    setWidth(currentWidth);
    // console.log("Current screen width:", currentWidth);
    // console.log("height of screen", window.innerHeight);
  }, []);
  return (
    <>
      <div>
        {/* <ImageById imageId={1} className={""} orientation="" /> */}
        <div className="h-[10dvh] flex justify-center items-center bg-[rgba(0,0,0,0.15)]">
          <h1 className="text-3xl">TEST</h1>
        </div>
        <div>The screen width is: {width}px</div>
        <div>The screen height is: {height}px</div>
      </div>
    </>
  );
}
