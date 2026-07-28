"use client";


import {
  useRef,
  useState
} from "react";


import ImageCropper
from "./ImageCropper";


export default function BusinessCardCamera() {

  const videoRef =
    useRef<HTMLVideoElement>(null);

  const [photo, setPhoto] =
    useState<string | null>(null);

  async function startCamera() {

    const stream =
      await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment"
        }
      });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }

  }

  function takePhoto() {

    const video =
      videoRef.current!;

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;

    canvas
      .getContext("2d")
      ?.drawImage(
        video,
        0,
        0
      );

    setPhoto(
      canvas.toDataURL(
        "image/jpeg"
      )
    );

  }



  return (

    <div
      className="
        min-h-screen
        bg-gray-100
        flex
        flex-col
        items-center
        justify-center
        gap-6
        p-6
      "
    >

      <h1
        className="
          text-3xl
          font-bold
        "
      >
        Scan Business Card
      </h1>


      <p
        className="
          text-gray-600
        "
      >
        Place the card on a clear background
      </p>


      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="
          w-full
          max-w-xl
          rounded-xl
          bg-black
          shadow-lg
        "
      />


      <div
        className="
          flex
          gap-4
        "
      >

        <button
          onClick={startCamera}
          className="
            rounded-lg
            bg-blue-600
            px-6
            py-3
            text-white
            hover:bg-blue-700
          "
        >
          Start Camera
        </button>


        <button
          onClick={takePhoto}
          className="
            rounded-lg
            bg-black
            px-6
            py-3
            text-white
            hover:bg-gray-800
          "
        >
          Take Photo
        </button>

      </div>


      {
        photo &&

        <ImageCropper
          image={photo}
        />
      }


    </div>

  );
}