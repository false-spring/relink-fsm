import {
  DocumentDuplicateIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  OnConnect,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { TransitionEdge } from "@/components/edges/transition";
import { DefaultNode } from "@/components/nodes/default";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { tryParseJSON } from "@/lib/utils";
import useGraphStore from "@/stores/use-graph-store";

const proOptions = { hideAttribution: true };

type PanePosition = {
  top: number | undefined;
  left: number | undefined;
  right: number | undefined;
  bottom: number | undefined;
};

type Position = { x: number; y: number };

type PaneContextMenuProps = {
  addNode: (position: Position) => void;
} & PanePosition;

function PaneContextMenu({
  top,
  left,
  right,
  bottom,
  addNode,
}: PaneContextMenuProps) {
  return (
    <div
      role="group"
      className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      style={{ top, left, right, bottom }}
    >
      <Button
        variant="ghost"
        role="menuitem"
        className="w-full text-left justify-start px-2"
        onClick={() => addNode({ x: left || 0, y: top || 0 })}
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Add Node
      </Button>
    </div>
  );
}

type NodeContextMenuProps = {
  id: string;
  removeNode: (id: string) => void;
  duplicateNode: (id: string) => void;
} & PanePosition;

function NodeContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  removeNode,
  duplicateNode,
}: NodeContextMenuProps) {
  return (
    <div
      role="group"
      className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      style={{ top, left, right, bottom }}
    >
      <Button
        variant="ghost"
        role="menuitem"
        className="w-full text-left justify-start px-2"
        onClick={() => duplicateNode(id)}
      >
        <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
        Duplicate
      </Button>
      <Button
        variant="ghost"
        role="menuitem"
        className="w-full text-left justify-start px-2"
        onClick={() => removeNode(id)}
      >
        <MinusIcon className="w-5 h-5 mr-2" />
        Remove
      </Button>
    </div>
  );
}

const nodeColor = (node: Node) => {
  switch (node.type) {
    default:
      return "#00000";
  }
};

const nodeTypes = { defaultComponent: DefaultNode };
const edgeTypes = { transition: TransitionEdge };

function NodeEditor() {
  const {
    nodes,
    edges,
    updateNodes,
    updateEdges,
    addEdge,
    addNode,
    removeNode,
    updateNode,
  } = useGraphStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      updateNodes: state.updateNodes,
      updateEdges: state.updateEdges,
      addEdge: state.addEdge,
      addNode: state.addNode,
      removeNode: state.removeNode,
      updateNode: state.updateNode,
    })),
  );
  const paneRef = useRef<HTMLDivElement | null>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [selectedNodeEdge, setSelectedNodeEdge] = useState<
    Node | Edge | undefined
  >(undefined);
  const [editorValue, setEditorValue] = useState<string>("");

  const [isPaneContextMenuOpen, setIsPaneContextMenuOpen] = useState(false);
  const [paneContextMenuPosition, setPaneContextMenuPosition] =
    useState<PanePosition>({
      top: undefined,
      left: undefined,
      right: undefined,
      bottom: undefined,
    });
  const [isNodeContextMenuOpen, setIsNodeContextMenuOpen] = useState(false);
  const [nodeContextMenuPosition, setNodeContextMenuPosition] = useState<
    PanePosition & { id: string | undefined }
  >({
    id: undefined,
    top: undefined,
    left: undefined,
    right: undefined,
    bottom: undefined,
  });

  const onSelectEdge = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      setSelectedNodeEdge(edge);
      setEditorValue(JSON.stringify(edge.data, null, " "));
    },
    [setSelectedNodeEdge, setEditorValue],
  );

  const onSelectNode = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeEdge(node);
      setEditorValue(JSON.stringify(node.data, null, " "));
    },
    [setSelectedNodeEdge, setEditorValue],
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      addEdge(connection as Edge);
    },
    [addEdge],
  );

  const handleAddNode = useCallback(
    (position: Position) => {
      setIsPaneContextMenuOpen(false);

      const flowPosition = screenToFlowPosition(position);

      addNode({
        id: (Math.random() * 100000).toString(),
        data: { label: "Node" },
        position: flowPosition,
      });
    },
    [addNode, screenToFlowPosition],
  );

  const handlePaneContextMenu = useCallback((event: React.MouseEvent) => {
    setIsNodeContextMenuOpen(false);
    event.preventDefault();

    const pane = paneRef.current?.getBoundingClientRect();
    if (!pane) return;

    setPaneContextMenuPosition({
      top:
        (event.clientY < pane.height - 200 && event.clientY - 45) || undefined,
      left: (event.clientX < pane.width - 200 && event.clientX) || undefined,
      right:
        (event.clientX >= pane.width - 200 && pane.width - event.clientX) ||
        undefined,
      bottom:
        (event.clientY >= pane.height - 200 && pane.height - event.clientY) ||
        undefined,
    });

    setIsPaneContextMenuOpen(true);
  }, []);

  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setIsPaneContextMenuOpen(false);
      event.preventDefault();

      const pane = paneRef.current?.getBoundingClientRect();
      if (!pane) return;

      setNodeContextMenuPosition({
        id: node.id,
        top:
          (event.clientY < pane.height - 200 && event.clientY - 45) ||
          undefined,
        left: (event.clientX < pane.width - 200 && event.clientX) || undefined,
        right:
          (event.clientX >= pane.width - 200 && pane.width - event.clientX) ||
          undefined,
        bottom:
          (event.clientY >= pane.height - 200 && pane.height - event.clientY) ||
          undefined,
      });

      setIsNodeContextMenuOpen(true);
    },
    [],
  );

  const handlePaneClick = useCallback(() => {
    setIsPaneContextMenuOpen(false);
    setIsNodeContextMenuOpen(false);
    setSelectedNodeEdge(undefined);
  }, []);

  const handleRemoveNode = useCallback(
    (id: string) => {
      setIsPaneContextMenuOpen(false);
      setIsNodeContextMenuOpen(false);
      removeNode(id);
    },
    [removeNode],
  );

  const handleDuplicateNode = useCallback(
    (id: string) => {
      const node = nodes.find((n) => n.id === id);

      setIsPaneContextMenuOpen(false);
      setIsNodeContextMenuOpen(false);

      if (node) {
        const id = Math.round(Math.random() * 10000000);

        const newNode = {
          ...node,
          id: id.toString(),
          position: { x: node.position.x + 50, y: node.position.y + 50 },
          data: {
            ...node.data,
            value: {
              ...node.data.value,
              guid_: id,
            },
          },
        };

        addNode(newNode);
      }
    },
    [nodes, addNode],
  );

  const updateNodeValue = useCallback(
    (value: string) => {
      if (!selectedNodeEdge) return;
      if (selectedNodeEdge.type !== "defaultComponent") return;

      const validJson = tryParseJSON(value);

      if (!validJson) {
        return toast("Invalid JSON. Please check your syntax.");
      }

      const newNode = {
        ...selectedNodeEdge,
        data: validJson,
      };

      setSelectedNodeEdge(newNode);
      updateNode(newNode as Node);

      return toast("Node updated successfully.");
    },
    [selectedNodeEdge, updateNode, setSelectedNodeEdge],
  );

  return (
    <div className="text-lg w-full absolute overflow-clip">
      <div className="w-screen h-[calc(100vh-50px)]">
        <ReactFlow
          ref={paneRef}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={updateNodes}
          onEdgesChange={updateEdges}
          onPaneContextMenu={handlePaneContextMenu}
          onNodeContextMenu={handleNodeContextMenu}
          onPaneClick={handlePaneClick}
          onConnect={onConnect}
          fitView
          maxZoom={1}
          minZoom={0.0001}
          proOptions={proOptions}
          onEdgeClick={onSelectEdge}
          onNodeClick={onSelectNode}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
          <Controls />
          <MiniMap nodeColor={nodeColor} />
          {selectedNodeEdge && (
            <Panel position="top-right">
              <div className="px-4 pt-4 pb-24 bg-gray-800 text-white rounded shadow-md w-[600px] h-[50vh] nowheel">
                <div className="font-bold">{selectedNodeEdge.data?.label}</div>
                <Textarea
                  className="font-mono mt-2 bg-gray-900 text-white w-full h-full resize-none"
                  value={editorValue}
                  onChange={(e) => {
                    setEditorValue(e.target.value);
                  }}
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    onClick={() => {
                      updateNodeValue(editorValue);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>
      {isPaneContextMenuOpen && (
        <PaneContextMenu
          addNode={handleAddNode}
          top={paneContextMenuPosition.top}
          left={paneContextMenuPosition.left}
          right={paneContextMenuPosition.right}
          bottom={paneContextMenuPosition.bottom}
        />
      )}
      {isNodeContextMenuOpen && (
        <NodeContextMenu
          id={nodeContextMenuPosition.id || ""}
          removeNode={handleRemoveNode}
          duplicateNode={handleDuplicateNode}
          top={nodeContextMenuPosition.top}
          left={nodeContextMenuPosition.left}
          right={nodeContextMenuPosition.right}
          bottom={nodeContextMenuPosition.bottom}
        />
      )}
    </div>
  );
}

export default function Index() {
  return (
    <ReactFlowProvider>
      <NodeEditor />
    </ReactFlowProvider>
  );
}
