import { useEffect } from "react";
import ChatBottomBar from "./ChatBottomBar";
import ChatTopBar from "./ChatTopBar";
import MesssageList from "./MesssageList";
import { useSelectedUser } from "@/store/useSelectedUser";

const MessageContainer = () => {
    const { setSelectedUser } = useSelectedUser();

    //To escape from the messaging state (setting selectedUser to null) by clicking esc btn. from keyboard
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape")
                setSelectedUser(null);
        }
        document.addEventListener("keydown", handleEscape);

        return () => document.removeEventListener("keydown", handleEscape); //cleanup func.
    }, [setSelectedUser]);

    return (
        <div className="flex flex-col justify-between w-full h-full">
            <ChatTopBar />

            <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
                <MesssageList />
                <ChatBottomBar />
            </div>
        </div>
    )
}

export default MessageContainer;