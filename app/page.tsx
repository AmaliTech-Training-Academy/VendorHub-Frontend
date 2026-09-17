"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full  h-full flex flex-col gap-4 justify-center items-center">
      <Image
        loading="eager"
        src={"/logo.png"}
        alt={" website logo"}
        height={150}
        width={150}
        className="rounded-3xl animate-ping ease-in-out transition-all "
      />
      <h1 className="text-6xl text-black font-extrabold font-sans">
        Welcome to Vendor
        <span className="text-orange-600 ">Hub</span>
      </h1>
    </div>
  );
}
