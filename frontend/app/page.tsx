"use client";


import { useState } from "react";


import { useRouter } from "next/navigation";


export default function Home(){

  const router = useRouter();
  const [name,setName] = useState("");
  const [title,setTitle] = useState("");

  function continueNext(){

    if(!name || !title){
      alert(
      "Please enter name and title"
      );
      return;
    }

    sessionStorage.setItem(
      "name",
      name
    );

    sessionStorage.setItem(
      "title",
      title
    );

    router.push(
      "/capture"
    );

  }



  return (
    <main
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
      "
    >

      <div
        className="
        w-full
        max-w-md
        rounded-2xl
        bg-white
        p-10
        shadow-xl
        "
      >

        <h1
          className="
          text-3xl
          font-bold
          text-center
          mb-3
          "
        >
          My Business Cards
        </h1>

        <p
          className="
          text-gray-500
          text-center
          mb-8
          "
        >
          Enter your information
        </p>

        <input
          className="
            w-full
            rounded-lg
            border
            border-gray-300
            p-3
            mb-4
            focus:outline-none
            focus:ring-2
            focus:ring-black
          "
          placeholder="Full name"
          value={name}
          onChange={(e)=>
            setName(e.target.value)
          }
        />

        <input
          className="
            w-full
            rounded-lg
            border
            border-gray-300
            p-3
            mb-6
            focus:outline-none
            focus:ring-2
            focus:ring-black
          "

          placeholder="Job title"
          value={title}

          onChange={(e)=>
            setTitle(e.target.value)
          }
        />

          <button
            onClick={continueNext}
            className="
            w-full
            rounded-lg
            bg-black
            py-3
            text-white
            font-semibold
            hover:bg-gray-800
            transition
            "
          >
            Continue
          </button>

        </div>
      </main>
  );

}