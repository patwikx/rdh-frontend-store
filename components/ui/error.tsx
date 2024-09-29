"use client";

import { ClipLoader } from "react-spinners";

export const ErrorAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <ClipLoader color="#e74c3c" size={50} />
      <p className="mt-2 text-red-600">An error occurred. Please try again.</p>
    </div>
  );
};
