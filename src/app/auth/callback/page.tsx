import { Loader } from "lucide-react";

const page = () => {
    return (
        <div className="mt-20 w-full flex justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader className="w-10 h-10 animate-spin text-muted-foreground" />
                <h3 className="text-xl font-bold">
                    Redirecting...
                </h3>

                <p>Hold on Tight for a while...</p>
            </div>
        </div>
    )
}

export default page;