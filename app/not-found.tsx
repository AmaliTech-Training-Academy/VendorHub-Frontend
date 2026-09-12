import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="w-full h-screen bg-orange-50 flex flex-col gap-4 justify-center items-center">
      <h2 className="text-3xl font-bold font-serif">
        4 <span className="font-semibold text-7xl text-orange-500">0</span> 4
      </h2>
      <h1 className="font-extrabold font-serif text-7xl">
        Hey You&apos;re Lost
      </h1>
      <p className="text-sm font-serif text-black">
        Seems you lost your way to hell ,{" "}
        <Link href={"/"} className="text-orange-800">
          {" "}
          Click here and go back to heaven
        </Link>
      </p>
    </div>
  );
}
