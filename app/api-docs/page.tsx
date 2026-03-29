"use client"; // Required if using Next.js App Router

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocs() {
  return (
    <div className="h-screen w-full">
      {/* USE A RELATIVE PATH HERE */}
      <SwaggerUI url="/api/docs" />
    </div>
  );
}
