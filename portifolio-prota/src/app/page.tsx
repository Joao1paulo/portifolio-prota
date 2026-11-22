import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NossaCausa from "@/components/NossaCausa";
import Servicos from "@/components/Servicos";
import Cases from "@/components/Cases";

export default function Home() {
  return (
    <div className=" bg-zinc-50 font-sans dark:bg-black">
      
      <Navbar/>

        <Hero/>
        <NossaCausa/>
        <Servicos/>
        <Cases/>


    </div>
  );
}
