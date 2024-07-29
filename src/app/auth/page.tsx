//Here file structuring  with page.tsx special file provides the routing faacility - File Routing
import { Button } from "@/components/ui/button"; //@ = src dir.
import Image from "next/image"; //Configured default img of Next.js
import AuthButtons from "./AuthButtons";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
    const {isAuthenticated} = getKindeServerSession();
    if(await isAuthenticated()) return redirect("/"); //not allowing already authenticated users to visit the auth page once again.

    return (
        <div className="flex h-screen w-full">

            <div className="flex-1 flex overflow-hidden dark:bg-[#651c2b55] bg-[#651c2b55] relative justify-center items-center">
                <img src="/bg.png" alt="app logo" className="absolute opacity-45 -bottom-4 -left-3 lg:scale-125 xl:scale-125 scale-[2] pointer-events-none select-none -z-1" />

                <div className="flex flex-col gap-2 px-4 xl:ml-40 text-center md:text-start font-semibold">
                    <Image
                        src={"/logo.png"}
                        alt="logo"
                        width={863}
                        height={273}
                        className="mt-20 w-[420px] z-0 pointer-events-none select-none"
                    />

                    <p className="text-2xl md:text-3xl text-balance z-10 ml-2.5">
                        Tune into the <span className="bg-red-500 px-2 font-bold text-white">PERFECT VIBE</span>
                    </p>
                    <p className="text-2xl md:text-3xl mb-32 text-balance z-10 ml-2.5">
                        Stay <span className="bg-green-500/90 font-bold px-2 text-white">WILD</span> Stay <span className="bg-green-500/90 font-bold px-2 text-white">WEIRD</span> 
                    </p>
                    <AuthButtons />
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden justify-center items-center hidden md:flex bg-noise">
                <Image
                    src={"/hero-png.png"}
                    alt="Hero Image"
                    fill
                    className="object-cover dark:opacity-60 opacity-90 pointer-events-none select-none h-full"
                />
            </div>

        </div>
    )
}

export default page