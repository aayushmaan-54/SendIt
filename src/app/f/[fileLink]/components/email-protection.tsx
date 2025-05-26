"use client";
import Form from "next/form";



export default function EmailProtection() {
  return (
    <div className="flex flex-col gap-4 mt-40 mx-auto">
      <h1 className="text-xl sm:text-4xl font-black italic mx-auto">
        <span className="not-italic">✉️ </span>
        Email Protected
      </h1>
      <Form
        action={''}
        className="flex flex-col items-center w-[90vw] sm:w-[500px] "
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input h-12! text-lg! font-semibold mt-10"
        />
        <button
          type="submit"
          className="button-accent w-full mt-5 font-black py-4! text-lg!"
        >
          Submit
        </button>
      </Form>
    </div>
  );
}
