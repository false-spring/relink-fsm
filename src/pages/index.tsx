import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Node,
  OnConnect,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";

import { Button } from "@/components/ui/button";

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
} & PanePosition;

function NodeContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  removeNode,
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
        onClick={() => removeNode(id)}
      >
        <MinusIcon className="w-5 h-5 mr-2" />
        Remove
      </Button>
    </div>
  );
}

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

function NodeEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
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
  const paneRef = useRef<HTMLDivElement | null>(null);

  const { screenToFlowPosition } = useReactFlow();

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((e) => addEdge(params, e)),
    [setEdges],
  );

  const handleAddNode = useCallback(
    (position: Position) => {
      setIsPaneContextMenuOpen(false);

      const flowPosition = screenToFlowPosition(position);

      setNodes((nodes) => [
        ...nodes,
        {
          id: (Math.random() * 100000).toString(),
          data: { label: "Node" },
          position: flowPosition,
        },
      ]);
    },
    [setNodes, screenToFlowPosition],
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
  }, []);

  const handleRemoveNode = useCallback(
    (id: string) => {
      setIsPaneContextMenuOpen(false);
      setIsNodeContextMenuOpen(false);
      setNodes((nodes) => nodes.filter((node) => node.id !== id));
    },
    [setNodes],
  );

  return (
    <div className="text-lg w-full absolute overflow-clip">
      <div className="w-screen h-[calc(100vh-50px)]">
        <ReactFlow
          ref={paneRef}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onPaneContextMenu={handlePaneContextMenu}
          onNodeContextMenu={handleNodeContextMenu}
          onPaneClick={handlePaneClick}
          onConnect={onConnect}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
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
