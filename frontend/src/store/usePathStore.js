import { create } from 'zustand'

const usePathStore = create((set) => ({
    relPath: localStorage.getItem("relPath") || "",
    setRelPath: (newPath) => {
        localStorage.setItem("relPath", newPath);
        set({ relPath: newPath });
    },
}))

export default usePathStore;