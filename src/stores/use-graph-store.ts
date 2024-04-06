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
  updateNodes: (nodes: NodeChange[]) => void;
  updateEdges: (nodes: EdgeChange[]) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: Edge | Connection) => void;
  addNode: (node: Node) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
};

const useGraphStore = create<GraphStore>()((set) => ({
  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  removeNode: (id) =>
    set((state) => ({ nodes: state.nodes.filter((n) => n.id !== id) })),
  updateNodes: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),
  updateEdges: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
  addEdge: (params) =>
    set((state) => ({ edges: addEdge(params, state.edges) })),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
}));

export default useGraphStore;
