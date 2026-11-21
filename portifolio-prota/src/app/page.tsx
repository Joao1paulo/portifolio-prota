import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NossaCausa from "@/components/NossaCausa";

export default function Home() {
  return (
    <div className=" bg-zinc-50 font-sans dark:bg-black">
      
      <Navbar/>

        <Hero/>
        <NossaCausa/>


    </div>
  );
}
