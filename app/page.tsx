import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full  h-screen flex justify-center items-center">
      <h1 className="text-6xl text-black font-extrabold">
        Welcome to Vendor
        <span className="text-orange-600 animate-ping">Hub</span>
      </h1>
    </div>
  );
}
