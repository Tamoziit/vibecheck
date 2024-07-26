import ChatBottomBar from "./ChatBottomBar";
import ChatTopBar from "./ChatTopBar";
import MesssageList from "./MesssageList";

const MessageContainer = () => {
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