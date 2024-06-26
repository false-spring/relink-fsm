import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "reactflow";
import { create } from "zustand";

import { Graph } from "@/types";

export type GraphStore = Graph & {
  setFilename: (filename: string) => void;
  updateNodes: (nodes: NodeChange[]) => void;
  updateEdges: (nodes: EdgeChange[]) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: Edge | Connection) => void;
  addNode: (node: Node) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNode: (node: Node) => void;
};

const useGraphStore = create<GraphStore>()((set, get) => ({
  filename: "",
  nodes: [],
  edges: [],
  setFilename: (filename) => set({ filename }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  removeNode: (id) =>
    set((state) => ({ nodes: state.nodes.filter((n) => n.id !== id) })),
  updateNodes: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  updateEdges: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  addEdge: (params) =>
    set((state) => ({ edges: addEdge(params, state.edges) })),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  updateNode: (node) =>
    set((state) => {
      return { nodes: state.nodes.map((n) => (n.id === node.id ? node : n)) };
    }),
}));

export default useGraphStore;
