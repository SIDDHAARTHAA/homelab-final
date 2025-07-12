import { create } from "zustand";

const useSortStore = create((set) => ({
  sort: "", // default sort
  setSort: (newSort) => set({ sort: newSort })
}));

export default useSortStore;
