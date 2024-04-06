import { Edge, Node } from "reactflow";

export type Graph = {
  nodes: Node[];
  edges: Edge[];
};

export type KVNode = { key: NodeTypeKey; value: unknown };

export type Position = [x: number, y: number, z: number, w: number];
export type BaseFSMNode = { guid_: number; parentGuid_: number };

export type layerNo = number;

export type FSMNode = {
  childLayerId_: number;
  fsmFolderName_: string;
  fsmName_: string;
  guid_: number;
  isBranch_: boolean;
  nameHash_: number;
  referenceguid_: number;
  tailIndexOfChildNodeGuids_: number;
  tailIndexOfComponentGuids_: number;
};

export type Transition = {
  conditionGuid_: number;
  conditionGuids: [Element: number];
  fromNodeGuid_: number;
  isEndTransition_: boolean;
  isFailedTransition_: boolean;
  params_: [];
  toNodeGuid_: number;
};

/* Empty Types */
export type addAllTransition = object;
export type addTransition = object;
export type EnableBaseTransition = object;
export type EnableBaseAllTransition = object;

export type AIBattleDistanceCondition = BaseFSMNode & {
  boolName_: string;
  distance_: number;
  isReverseSuccess_: boolean;
  type_: number;
  useBlackBoardValue_: boolean;
};

export type AIMoveAction = BaseFSMNode & {
  boolName_: string;
  dashLength_: number;
  dist_: number;
  isCheckCollision_: boolean;
  isSetPosition_: boolean;
  isSmoothPass_: boolean;
  minMoveTime_: number;
  positionBBName_: "PlayerAI_TargetPoint" | string;
  positionHashValue_: number;
  position: Position;
  randomChangeAddTime_: number;
  randomChangeTime_: number;
  randomLength_: number;
  sideLength_: number;
  smoothRate_: number;
  type_: number;
  useBlackBoardValue_: boolean;
};

export type ActionEndCondition = BaseFSMNode & {
  isAllEnd_: boolean;
  isReverseSuccess_: boolean;
};

export type AIBattleSequenceCondition = BaseFSMNode & {
  flagType_: number;
  isReverseSuccess_: boolean;
};

export type AIBattleAttackAction = BaseFSMNode & {
  attackType_: number;
  isCharge_: boolean;
  isRapid_: boolean;
  rapidIntervalFrame_: number;
  timer_: number;
};

export type AIBattleSelectCondition = BaseFSMNode & {
  comboIndex_: number;
  isReverseSuccess_: boolean;
};

export type AIBattleSelectComboAction = BaseFSMNode & {
  playerAICombos_: [Element: { rangeMax_: number; rangeMin_: number }];
};

export type TimerAction = BaseFSMNode & {
  randomSeconds_: number;
  waitTimeSeconds_: number;
};

export type BlackBoardBoolAction = BaseFSMNode & {
  setTiming_: number;
  /// "PlayerAI_SetBattleWaitMode"
  valueName_: string;
  value_: boolean;
};

export type FSMUnderLayerEndCondition = BaseFSMNode & {
  isReverseSuccess_: boolean;
};

export type BlackBoardIntCondition = BaseFSMNode & {
  /// "PlayerAI_OrderType"
  intName_: string;
  operatorType_: number;
  value_: number;
};

export type ShotPosAction = BaseFSMNode & {
  degreeX_: number;
  degreeY_: number;
  isAddPosAndRot_: boolean;
  isInit_: boolean;
  isUpdateAttachParent_: boolean;
  isUseHomingTargetOnMoveInfo_: boolean;
  isUseOnMoveInfo_: boolean;
  offset: Position;
  partsNo_: number;
  scale_: number;
};

export type ShotTerminateAction = BaseFSMNode;
export type ShotVfxAction = BaseFSMNode & {
  canEditScaleXYZ_: boolean;
  delCode_: number;
  effectId_: number;
  effectObjId_: number;
  guid_: number;
  isHitEffectKeepFront_: boolean;
  isHitEffect_: boolean;
  isSetHitEffectEspCtrl_: boolean;
  isUseParentObjId_: boolean;
  offsetPos: Position;
  oneShot_: boolean;
  scaleY_: number;
  scaleZ_: number;
  scale_: number;
  seName_: string;
};

export type ShotTimerAction = BaseFSMNode & {
  isForceSet_: boolean;
  waitTimeSeconds_: number;
};

export type ShotStatusFlagCondition = BaseFSMNode & {
  isReverseSuccess_: boolean;
  isSuccessAny_: boolean;
  statusFlagInfo_: [Element: { isEnable_: boolean; statusFlag_: number }];
};

export type NodeTypeKey =
  | "layerNo"
  | "addAllTransition"
  | "addTransition"
  | "EnableBaseTransition"
  | "EnableBaseAllTransition"
  | "FSMNode"
  | "Transition"
  | "AIBattleDistanceCondition"
  | "AIMoveAction"
  | "ActionEndCondition"
  | "AIBattleSequenceCondition"
  | "AIBattleAttackAction"
  | "AIBattleSelectCondition"
  | "AIBattleSelectComboAction"
  | "TimerAction"
  | "BlackBoardBoolAction"
  | "FSMUnderLayerEndCondition"
  | "BlackBoardIntCondition"
  | "ShotPosAction"
  | "ShotTerminateAction"
  | "ShotVfxAction"
  | "ShotTimerAction"
  | "ShotStatusFlagCondition";

export type NodeType =
  | layerNo
  | addAllTransition
  | addTransition
  | EnableBaseTransition
  | EnableBaseAllTransition
  | FSMNode
  | Transition
  | AIBattleDistanceCondition
  | AIMoveAction
  | ActionEndCondition
  | AIBattleSequenceCondition
  | AIBattleAttackAction
  | AIBattleSelectCondition
  | AIBattleSelectComboAction
  | TimerAction
  | BlackBoardBoolAction
  | FSMUnderLayerEndCondition
  | BlackBoardIntCondition
  | ShotPosAction
  | ShotTerminateAction
  | ShotVfxAction
  | ShotTimerAction
  | ShotStatusFlagCondition;
