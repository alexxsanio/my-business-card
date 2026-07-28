"use client";


import {
  useEffect
} from "react";


interface Props {
  image: string;
}



export default function ImageCropper({
  image
}: Props) {

  useEffect(() => {
    console.log(
      "Processing image:",
      image
    );

    /*
      Future implementation:

      1. Load OpenCV.js

      2. Detect card edges

      3. Find largest contour

      4. Perspective transform

      5. Convert to File

      6. POST:

      /api/save_businesscard

    */

  }, [image]);



  return (

    <div
      className="
        mt-6
      "
    >
      <h2
        className="
          text-xl
          font-semibold
          mb-3
        "
      >
        Preview
      </h2>

      <img
        src={image}
        className="
          max-w-md
          rounded-xl
          shadow-lg
        "
      />

    </div>

  );
}