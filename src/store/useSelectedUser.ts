import { User } from "@/db/dummy";
import { create } from "zustand";

type SelectedUserState = { //typedef
    selectedUser: User | null,
    setSelectedUser: (user: User | null) => void;
}

//To populate the chat section when a user is selected from the sidebar
export const useSelectedUser = create<SelectedUserState>((set) => ({
    selectedUser: null, //default
    setSelectedUser: (user: User | null) => set({ selectedUser: user }),
}))