import { AnimatePresence, motion } from "framer-motion";
import { Image as ImageIcon, Loader, SendHorizontal, ThumbsUp } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useRef, useState } from "react";
import EmojiPicker from "./EmojiPicker";
import { Button } from "../ui/button";
import useSound from "use-sound";
import { usePreferences } from "@/store/usePreferences";
import { useMutation } from "@tanstack/react-query";
import { sendMessageAction } from "@/actions/message.actions";
import { useSelectedUser } from "@/store/useSelectedUser";

const ChatBottomBar = () => {
    const [message, setMessage] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const { soundEnabled } = usePreferences();
    const { selectedUser } = useSelectedUser();

    const [playSound1] = useSound("/sounds/keystroke1.mp3");
    const [playSound2] = useSound("/sounds/keystroke2.mp3");
    const [playSound3] = useSound("/sounds/keystroke3.mp3");
    const [playSound4] = useSound("/sounds/keystroke4.mp3");

    const playSoundFunctions = [playSound1, playSound2, playSound3, playSound4];
    //keyboard sound while typing
    const playRandomKeyStrokeSound = () => {
        const randomIndex = Math.floor(Math.random() * playSoundFunctions.length);
        soundEnabled && playSoundFunctions[randomIndex]();
    }

    const { mutate: sendMessage, isPending } = useMutation({
        mutationFn: sendMessageAction
    });

    const handleSendMessage = () => {
        if (!message.trim()) return; //No message state

        sendMessage({
            content: message,
            messageType: "text",
            receiverId: selectedUser?.id! //! = signifies that id is always present
        });
        //cleanup states
        setMessage('');
        textAreaRef.current?.focus();
    }

    //Sending message on clicking enter key & getting new line by pressing enter+shift
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(); //sending message
        }

        if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            setMessage(message + "\n"); //newline
        }
    }

    return (
        <div className="p-2 flex justify-between w-full items-center gap-2">
            {!message.trim() && <ImageIcon size={20} className="cursor-pointer text-muted-foreground" />} {/* Not displaying image icon IFF we write anything inside the textarea, else (while not typing message) displaying it */}

            <AnimatePresence>
                <motion.div
                    layout
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{
                        opacity: { duration: 0.5 },
                        layout: {
                            type: "spring",
                            bounce: 0.15
                        }
                    }}
                    className="w-full relative"
                >
                    <Textarea
                        autoComplete="off"
                        placeholder="Message..."
                        rows={1}
                        className="w-full border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background min-h-0"
                        value={message}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            playRandomKeyStrokeSound();
                        }}
                        ref={textAreaRef}
                    />
                    <div className="absolute right-2 bottom-0.5">
                        <EmojiPicker
                            onChange={(emoji) => {
                                setMessage(message + emoji);
                                if (textAreaRef.current) {
                                    textAreaRef.current.focus(); //to focus the cursor on text area immediately after selecting an emoji
                                }
                            }}
                        />
                    </div>
                </motion.div>

                {message.trim() ? (
                    <Button
                        className="h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
                        variant={"ghost"}
                        size={"icon"}
                        onClick={handleSendMessage}
                    >
                        <SendHorizontal size={20} className="text-muted-foreground" />
                    </Button>
                ) : (
                    <Button
                        className="h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
                        variant={"ghost"}
                        size={"icon"}
                    >
                        {!isPending && <ThumbsUp size={20} className="text-muted-foreground" 
                        onClick={() => {
                            sendMessage({
                                content: "👍👍",
                                messageType: "text",
                                receiverId: selectedUser?.id!
                            });
                        }} 
                        />}
                        {isPending && <Loader size={20} className="animate-spin text-muted-foreground" />}
                    </Button>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ChatBottomBar