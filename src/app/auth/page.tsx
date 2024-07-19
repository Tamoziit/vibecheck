//Here file structuring  with page.tsx special file provides the routing faacility - File Routing
import { Button } from "@/components/ui/button"; //@ = src dir.
import Image from "next/image"; //Configured default img of Next.js

const page = () => {
    return (
        <div className="flex h-screen w-full">

            <div className="flex-1 flex overflow-hidden dark:bg-[#651c2b55] bg-[#51c2b] relative justify-center items-center">
                <img src="/redis-logo.svg" alt="redis logo" className="absolute -left-1/4 opacity-25 -bottom-52 lg:scale-125 xl:scale-100 scale-[2] pointer-events-none select-none -z-1" />

                <div className="flex flex-col gap-2 px-4 xl:ml-40 text-center md:text-start font-semibold">
                    <Image
                        src={"/logo.png"}
                        alt="logo"
                        width={763}
                        height={173}
                        className="mt-20 w-[420px] z-0 pointer-events-none select-none"
                    />
                </div>
            </div>
            <div className="flex-1"></div>

        </div>
    )
}

export default page