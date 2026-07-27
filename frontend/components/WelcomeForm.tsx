"use client";

import { useState, FormEvent } from "react";
import { Person } from "@/app/page";

interface WelcomeFormProps {
  onContinue: (person: Person) => void;
}

export default function WelcomeForm({
  onContinue,
}: WelcomeFormProps) {
  const [name, setName] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !title.trim()) return;

    onContinue({
      name,
      title,
    });
  };

  return (
    <div className="card">

      <h1>Welcome</h1>

      <p>
        Tell us a little about yourself.
      </p>

      <form onSubmit={submit}>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button type="submit">
          Continue
        </button>

      </form>

    </div>
  );
}