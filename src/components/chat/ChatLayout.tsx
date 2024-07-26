"use client";
import { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { cn } from "@/lib/utils";
import Sidebar from "../Sidebar";
import MessageContainer from "./MessageContainer";

//Typedef
interface ChatLayoutProps {
    defaultLayout: number[] | undefined; //defaultLayout is either an array of numbers or undefined
}

const ChatLayout = ({ defaultLayout = [320, 480] }: ChatLayoutProps) => { //{defaultLayout=[320, 480]}:ChatLayoutProps) --> defines the type of defaultLayout & sets its default value to be [320px, 480px]
    const [isMobile, setIsMobile] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const checkScreenWidth = () => {
            setIsMobile(window.innerWidth <= 768); //mobile dimensions
        }
        //initial check at each refresh
        checkScreenWidth();

        //Changing width accordingly
        window.addEventListener("resize", checkScreenWidth);
        return () => {//cleaner func.
            window.removeEventListener("resize", checkScreenWidth);
        }
    }, []);

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="h-full items-stretch bg-background rounded-lg"
            onLayout={(sizes: number[]) => {
                document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)};` //fetching the current state of layout cookies and setting it to panels
            }}
        >
            <ResizablePanel
                defaultSize={defaultLayout[0]} //taking in the first cookie value
                collapsedSize={8}
                collapsible={true}
                minSize={isMobile ? 0 : 24} //minSize 0 applicable only for mobile
                maxSize={isMobile ? 8 : 30}
                onCollapse={() => {
                    setIsCollapsed(true);
                    document.cookie = `react-resizable-panels:collapsed=true;`; //setting collapsed state to cookies
                }}
                onExpand={() => {
                    setIsCollapsed(false);
                    document.cookie = `react-resizable-panels:collapsed=false;`; //setting collapsed state to cookies
                }}
                className={cn(isCollapsed && "min-w-[80px] transition-all duration-300 ease-in-out")}
            >
                <Sidebar isCollapsed={isCollapsed} />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel
                defaultSize={defaultLayout[1]}
                minSize={30}
            >
                {/*<div className="flex justify-center items-center h-full w-full px-10">
                    <div className="flex flex-col justify-center items-center gp-4">
                        <img src="/logo.png" alt='Logo' className="w-full md:w-2/3 lg:w-1/2" />
                        <p className="text-muted-foreground text-center">Click on a chat to view the messages</p>
                    </div>
                </div>*/}

                <MessageContainer />
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default ChatLayout