import { create } from "zustand";

//Typedef/Func. signature
type Preferences = {
    soundEnabled: boolean;
    setSoundEnabled: (soundenabled: boolean) => void;
}

export const usePreferences = create<Preferences>((set) => ({
    soundEnabled: true,
    setSoundEnabled: (soundEnabled: boolean) => set({ soundEnabled })
})); //returning a setter object as a GLOBAL STATE [ ({...}) = returns an object ]


/*
NB: useState() is a local state manager, but zustand providdes global states for the entire application
*/