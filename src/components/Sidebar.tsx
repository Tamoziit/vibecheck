import { User } from "@/db/dummy";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { LogOut, SearchIcon } from "lucide-react";
import useSound from "use-sound";
import { usePreferences } from "@/store/usePreferences";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { useSelectedUser } from "@/store/useSelectedUser";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useState } from "react";
import toast from "react-hot-toast";

interface SidebarProps {
    isCollapsed: boolean;
    users: User[];
}

const Sidebar = ({ isCollapsed, users }: SidebarProps) => {
    const [playClickSound] = useSound("/sounds/mouse-click.mp3");
    const { soundEnabled } = usePreferences();
    const { selectedUser, setSelectedUser } = useSelectedUser();
    const { user } = useKindeBrowserClient(); //gets the logged in user of the browser inside a client component (NB: useKindeServerSession() hook will not work here coz, this component (Sidebar) is not a server compnent)
    const [search, setSearch] = useState("");
    const [dialog, setDialog] = useState(false);

    const handleSearch = () => {
        let isSearchedUserPresent = null;
        let i = 0;
        for (i = 0; i < users.length; i++) {
            if (users[i].name.includes(search) || users[i].email.includes(search)) {
                isSearchedUserPresent = users[i];
                break;
            }
        }
        if (isSearchedUserPresent)
            setSelectedUser(isSearchedUserPresent);
        else
            toast.error("No such user found!");
        setSearch("");
        setDialog(false);
    }

    return (
        <div className="group relative flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 max-h-full overflow-auto bg-background">
            {!isCollapsed ? (
                <div className="flex justify-between p-2 items-center">
                    <div className="flex flex-col gap-2 w-full">
                        <p className="font-medium text-2xl">Chats</p>
                        <div className="flex flex-col gap-0.5">
                            <label className="font-medium text-muted-foreground text-">Search</label>
                            <div className="flex dark:bg-muted dark:test-white dark:hover:text-white shrink px-1.5 rounded-full overflow-hidden">
                                <input
                                    type="text"
                                    placeholder="Enter name or email..."
                                    className="w-full bg-transparent outline-none border-none text-xs"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                    }}
                                />
                                <Button
                                    className="text-muted-foreground hover:text-white cursor-pointer"
                                    variant={"ghost"}
                                    size={"sm"}
                                    onClick={handleSearch}
                                >
                                    <SearchIcon />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (<div className="flex items-center mt-2 px-2">
                <SearchIcon className="font-semibold cursor-pointer h-7 w-7 ml-2"
                    onClick={() => {
                        setDialog(true);
                    }}
                />
                <Dialog open={dialog} onOpenChange={setDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Search</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center items-center relative h-1 w-full mx-auto">
                            <input
                                type="text"
                                placeholder="Enter name or email..."
                                className="w-full h-8 mt-4 bg-transparent outline-none border-none text-sm dark:bg-muted dark:test-white dark:hover:text-white shrink px-1.5 rounded-full overflow-hidden"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                className="text-muted-foreground hover:text-white mt-4 cursor-pointer"
                                variant={"grey"}
                                size={"sm"}
                                onClick={handleSearch}
                            >
                                <SearchIcon />
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            )}

            <ScrollArea className="gap-2 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                {users.map((user, idx) => (
                    isCollapsed ? (
                        <TooltipProvider key={idx}>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <div onClick={() => {
                                        soundEnabled && playClickSound();
                                        setSelectedUser(user);
                                    }}>
                                        <Avatar className="my-1 flex justify-center items-center">
                                            <AvatarImage
                                                src={user.image || "/user-placeholder.png"}
                                                alt={user.name}
                                                className="border-2 border-white rounded-full w-10 h-10"
                                            />
                                            <AvatarFallback>{user.name[0]}</AvatarFallback> {/* Fallback for img loading buffer */}
                                        </Avatar>
                                        <span className="sr-only">{user.name}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="right" className="flex items-center gap-4"
                                >{user.name}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <Button key={idx}
                            className={cn("w-full justify-start gap-4 my-1", selectedUser?.email === user.email && "dark:bg-muted dark:test-white dark:hover:bg-muted dark:hover:text-white shrink")}
                            variant={"grey"}
                            size="xl"
                            onClick={() => {
                                soundEnabled && playClickSound();
                                setSelectedUser(user);
                            }}
                        >
                            <Avatar className="flex justify-center items-center">
                                <AvatarImage
                                    src={user.image || "/user-placeholder.png"}
                                    alt={user.name}
                                    className="w-10 h-10"
                                />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col max-w-28">
                                <span>{user.name}</span>
                            </div>
                        </Button>
                    )
                ))}
            </ScrollArea>

            {/* Sidebar Footer */}
            <div className="mt-auto">
                <div className="flex justify-between items-center gap-2 md:px-6 py-2">
                    {!isCollapsed && (
                        <div className="hidden md:flex gap-2 items-center">
                            <Avatar className="flex justify-center items-center">
                                <AvatarImage
                                    src={user?.picture || "/user-placeholder.png"}
                                    alt="avatar"
                                    referrerPolicy="no-referrer" //To fix google pic rendering issue in an external site
                                    className="w-8 h-8 border-2 border-white rounded-full"
                                />
                            </Avatar>
                            <p className="font-bold">
                                {user?.given_name} {user?.family_name}
                            </p>
                        </div>
                    )}
                    <div className="flex">
                        <LogoutLink>
                            <LogOut size={22} cursor={"pointer"} />
                        </LogoutLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar