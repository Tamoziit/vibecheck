"use client";

/* TanStack React Query --> A Query Provider Service that facilitates writing query to the DB without using useEffect() in next.js env. It also provides key services like caching etc. */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

//Analogous --> AuthContextProvider
const TanStackProvider = ({ children }: { children: ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default TanStackProvider;