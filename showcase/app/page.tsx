import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <h1 className="text-primary text-4xl font-bold tracking-wide">Basic</h1>
      <Link href="/native/counter">
        <h2 className="text-2xl">Counter</h2>
        <div className="text-sm text-slate-600">See how a counter can be implemented with signals.</div>
      </Link>
    </>
  );
}
