"use client";

import { useState } from "react";
import WelcomeForm from "@/components/WelcomeForm";
import BusinessCardCapture from "@/components/BusinessCardCapture";

export interface Person {
  name: string;
  title: string;
}

export default function Home() {
  const [step, setStep] = useState<number>(1);

  const [person, setPerson] = useState<Person>({
    name: "",
    title: "",
  });

  const [cardImage, setCardImage] = useState<File | null>(null);

  const handleContinue = (personData: Person) => {
    setPerson(personData);
    setStep(2);
  };

  const handleUpload = (file: File) => {
    setCardImage(file);

    console.log(person);
    console.log(file);

    alert("Business card uploaded!");
  };

  return (
    <main className="container">
      {step === 1 && (
        <WelcomeForm
          onContinue={handleContinue}
        />
      )}

      {step === 2 && (
        <BusinessCardCapture
          person={person}
          onUpload={handleUpload}
        />
      )}
    </main>
  );
}