import { create } from "zustand";

const useNodeStore = create((set) => ({
  nodes: [],
  setNodes: (nodes) => set({ nodes }),
}));

export default useNodeStore;
