import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useCallback, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Node,
  OnConnect,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import { useShallow } from "zustand/react/shallow";

import { DefaultNode } from "@/components/nodes/default";
import { Button } from "@/components/ui/button";
import useGraphStore from "@/stores/use-graph-store";

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

function NodeEditor() {
  const {
    nodes,
    edges,
    updateNodes,
    updateEdges,
    addEdge,
    addNode,
    removeNode,
  } = useGraphStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      updateNodes: state.updateNodes,
      updateEdges: state.updateEdges,
      addEdge: state.addEdge,
      addNode: state.addNode,
      removeNode: state.removeNode,
    })),
  );

  const nodeTypes = useMemo(() => ({ defaultComponent: DefaultNode }), []);

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

  const onConnect: OnConnect = useCallback(addEdge, [addEdge]);

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
  }, []);

  const handleRemoveNode = useCallback(
    (id: string) => {
      setIsPaneContextMenuOpen(false);
      setIsNodeContextMenuOpen(false);
      removeNode(id);
    },
    [removeNode],
  );

  return (
    <div className="text-lg w-full absolute overflow-clip">
      <div className="w-screen h-[calc(100vh-50px)]">
        <ReactFlow
          ref={paneRef}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={updateNodes}
          onEdgesChange={updateEdges}
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
