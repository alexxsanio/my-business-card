"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  detectBusinessCard,
} from "@/app/lib/cardDetection";

import {
  uploadBusinessCard,
} from "@/app/lib/upload";


interface Props {
  image: string;
  onRetake: () => void;
}


export default function ImageCropper({
  image,
  onRetake,
}: Props) {

  const [croppedImage, setCroppedImage] =
    useState<string | null>(null);

  const [canvas, setCanvas] =
    useState<HTMLCanvasElement | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  useEffect(() => {
    processImage();
  }, []);

  async function processImage() {

    try {
      setLoading(true);

      const img =
        new Image();

      img.src = image;

      await new Promise(
        (resolve) => {
          img.onload = resolve;
        }
      );

      const resultCanvas =
        await detectBusinessCard(img);

      setCanvas(resultCanvas);

      setCroppedImage(
        resultCanvas.toDataURL(
          "image/jpeg",
          0.95
        )
      );

    } catch(error){

      console.error(
        "Card detection failed:",
        error
      );

      /*
        Fallback:
        use original image
        if no card detected
      */

      setCroppedImage(image);

    } finally {
      setLoading(false);
    }

  }

  async function saveBusinessCard() {

    if (!canvas) {
      return;
    }

    setUploading(true);

    try {

      const name =
        sessionStorage.getItem(
          "name"
        ) || "";

      const title =
        sessionStorage.getItem(
          "title"
        ) || "";

      canvas.toBlob(
        async (blob) => {

          if (!blob) {
            throw new Error(
              "Unable to process image"
            );
          }

          const file =
            new File(
              [
                blob
              ],
              "business-card.jpg",
              {
                type:
                  "image/jpeg",
              }
            );

          const response =
            await uploadBusinessCard(
              file,
              name,
              title
            );

          console.log(
            "Upload complete:",
            response
          );

          alert(
            "Business card saved!"
          );

          setUploading(false);

        },
        "image/jpeg",
        0.95
      );


    } catch(error){

      console.error(
        error
      );

      alert(
        "Upload failed"
      );

      setUploading(false);

    }

  }



  return (

    <div
      className="
        flex
        flex-col
        items-center
        gap-6
      "
    >

      {
        loading && (

          <div
            className="
              text-xl
              font-semibold
            "
          >
            Detecting business card...
          </div>

        )
      }

      {
        croppedImage && !loading && (

          <>
            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Cropped Card
            </h2>

            <img

              src={croppedImage}

              alt="
                Cropped business card
              "

              className="
                max-w-xl
                rounded-xl
                shadow-xl
              "

            />

            <div
              className="
                flex
                gap-4
              "
            >

              <button

                onClick={onRetake}

                className="
                  rounded-lg
                  bg-gray-600
                  px-6
                  py-3
                  text-white
                "

              >
                Retake
              </button>

              <button
                onClick={saveBusinessCard}
                disabled={uploading}
                className="
                  rounded-lg
                  bg-green-600
                  px-6
                  py-3
                  text-white
                  disabled:bg-gray-400
                "
              >

                {
                  uploading
                  ?
                  "Uploading..."
                  :
                  "Save Card"
                }

              </button>

            </div>
          </>
        )
      }

    </div>

  );

}