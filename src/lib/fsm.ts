import dagre from "@dagrejs/dagre";
import hash from "object-hash";
import { Edge, Node } from "reactflow";

import {
  ActionEndCondition,
  addAllTransition,
  addTransition,
  AIBattleAttackAction,
  AIBattleDistanceCondition,
  AIBattleSelectComboAction,
  AIBattleSelectCondition,
  AIBattleSequenceCondition,
  AIMoveAction,
  BehaviorTreeComponent,
  BlackBoardBoolAction,
  BlackBoardIntCondition,
  EnableBaseAllTransition,
  EnableBaseTransition,
  FSMNode,
  FSMUnderLayerEndCondition,
  Graph,
  KVNode,
  layerNo,
  NodeType,
  ShotAttackAction,
  ShotBgLayAction,
  ShotMoveHomingAction,
  ShotPosAction,
  ShotStatusFlagCondition,
  ShotTerminateAction,
  ShotTimerAction,
  ShotVfxAction,
  TimerAction,
  Transition,
} from "@/types";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 500;
const nodeHeight = 40;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "LR",
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    const height = Object.keys(node.data.value).length * 55 + nodeHeight;

    dagreGraph.setNode(node.id, { width: nodeWidth, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    // @ts-expect-error targetPosition and sourcePosition are not part of the Node type
    node.targetPosition = isHorizontal ? "left" : "top";
    // @ts-expect-error targetPosition and sourcePosition are not part of the Node type
    node.sourcePosition = isHorizontal ? "right" : "bottom";

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export function kvnodes_to_graph(
  kvnodes: KVNode[],
): Pick<Graph, "nodes" | "edges"> {
  const guid_to_id_map: Record<number, string> = {};

  const nodes = kvnodes
    .flatMap((element) => {
      const nodeType = element["key"];
      const value = toNodeType(element);

      console.info(nodeType, element["value"]);

      const id = getNodeId(value);
      const guid = getNodeGuid(value);

      if (guid) {
        guid_to_id_map[guid] = id;
      }

      return [
        {
          id,
          type: "defaultComponent",
          data: {
            label: nodeType,
            key: nodeType,
            value,
          },
        },
      ];
    })
    .map((node, i) => {
      const x = (i % 10) * 175;
      const y = Math.floor(i / 10) * 75;

      return {
        ...node,
        position: { x, y },
      };
    });

  const edges = nodes.flatMap((node) => {
    if (node.data.key === "Transition") {
      const value = node.data.value as Transition;

      const from = guid_to_id_map[value.fromNodeGuid_];

      const to = guid_to_id_map[value.toNodeGuid_];

      const conditions = value.conditionGuids_?.map((guid) => {
        const conditionNode = nodes.find(
          (node) => getNodeGuid(node.data.value) === guid.Element,
        );

        return conditionNode?.data;
      });

      return [
        {
          id: `transition-${from}-to-${to}`,
          type: "transition",
          source: from,
          target: to,
          data: {
            value,
            conditions,
          },
          animated: true,
        },
      ];
    } else {
      const parentGuid = getNodeParentGuid(node.data.value);
      if (!parentGuid) return [];

      const self = node.id;
      const parent = guid_to_id_map[parentGuid];

      return [
        {
          id: `${self}-to-${parent}`,
          source: parent,
          target: self,
        },
      ];
    }
  });

  const filteredNodes = nodes.filter((node) => node.data.key !== "Transition");

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    filteredNodes,
    edges,
  );

  return {
    nodes: layoutedNodes,
    edges: layoutedEdges,
  };
}

function isEmptyObject(obj: object): boolean {
  for (const _ in obj) {
    return false;
  }
  return true;
}

function getNodeGuid(nodeType: NodeType): number | null {
  if (typeof nodeType === "number") return null;
  if (isEmptyObject(nodeType)) return null;
  return (nodeType as BehaviorTreeComponent).guid_;
}

function getNodeParentGuid(nodeType: NodeType): number | null {
  if (typeof nodeType === "number") return null;
  if (isEmptyObject(nodeType)) return null;
  return (nodeType as BehaviorTreeComponent).parentGuid_;
}

function getNodeId(nodeType: NodeType): string {
  if (typeof nodeType === "number") return nodeType.toString();
  if (isEmptyObject(nodeType)) return Math.random().toString();

  return hash(nodeType, {
    algorithm: "md5",
    encoding: "base64",
    respectType: false,
  });
}

function toNodeType(kvnode: KVNode): NodeType {
  switch (kvnode.key) {
    case "layerNo":
      return kvnode.value as layerNo;
    case "addAllTransition":
      return kvnode.value as addAllTransition;
    case "addTransition":
      return kvnode.value as addTransition;
    case "EnableBaseTransition":
      return kvnode.value as EnableBaseTransition;
    case "EnableBaseAllTransition":
      return kvnode.value as EnableBaseAllTransition;
    case "FSMNode":
      return kvnode.value as FSMNode;
    case "Transition":
      return kvnode.value as Transition;
    case "AIBattleDistanceCondition":
      return kvnode.value as AIBattleDistanceCondition;
    case "AIMoveAction":
      return kvnode.value as AIMoveAction;
    case "ActionEndCondition":
      return kvnode.value as ActionEndCondition;
    case "AIBattleSequenceCondition":
      return kvnode.value as AIBattleSequenceCondition;
    case "AIBattleAttackAction":
      return kvnode.value as AIBattleAttackAction;
    case "AIBattleSelectCondition":
      return kvnode.value as AIBattleSelectCondition;
    case "AIBattleSelectComboAction":
      return kvnode.value as AIBattleSelectComboAction;
    case "TimerAction":
      return kvnode.value as TimerAction;
    case "BlackBoardBoolAction":
      return kvnode.value as BlackBoardBoolAction;
    case "FSMUnderLayerEndCondition":
      return kvnode.value as FSMUnderLayerEndCondition;
    case "BlackBoardIntCondition":
      return kvnode.value as BlackBoardIntCondition;
    case "ShotPosAction":
      return kvnode.value as ShotPosAction;
    case "ShotTerminateAction":
      return kvnode.value as ShotTerminateAction;
    case "ShotVfxAction":
      return kvnode.value as ShotVfxAction;
    case "ShotTimerAction":
      return kvnode.value as ShotTimerAction;
    case "ShotStatusFlagCondition":
      return kvnode.value as ShotStatusFlagCondition;
    case "ShotBgLayAction":
      return kvnode.value as ShotBgLayAction;
    case "ShotAttackAction":
      return kvnode.value as ShotAttackAction;
    case "ShotMoveHomingAction":
      return kvnode.value as ShotMoveHomingAction;
    default:
      console.error(`Unknown node type: ${kvnode.key}`);
      return kvnode.value as NodeType;
  }
}
