import hash from "object-hash";

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
  ShotPosAction,
  ShotStatusFlagCondition,
  ShotTerminateAction,
  ShotTimerAction,
  ShotVfxAction,
  TimerAction,
  Transition,
} from "@/types";

export function kvnodes_to_graph(kvnodes: KVNode[]): Graph {
  const nodes = kvnodes
    .flatMap((element) => {
      const nodeType = element["key"];
      const value = toNodeType(element);
      const id = getNodeId(value);

      if (
        [
          "Transition",
          "layerNo",
          "addAllTransition",
          "addTransition",
          "EnableBaseTransition",
          "EnableBaseAllTransition",
        ].includes(nodeType)
      ) {
        return [];
      }

      return [
        {
          id,
          data: {
            label: nodeType,
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

  return {
    nodes,
    edges: [],
  };
}

function isEmptyObject(obj: object): boolean {
  for (const _ in obj) {
    return false;
  }
  return true;
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
  }
}
