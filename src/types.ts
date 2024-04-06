import { Edge, Node } from "reactflow";

export type Graph = {
  nodes: Node[];
  edges: Edge[];
};

export type KVNode = { key: NodeTypeKey; value: unknown };
export type cVec4 = [x: number, y: number, z: number, w: number];
export type f32 = number;
export type s32 = number;
export type u32 = number;

/* Base Components */

export interface BehaviorTreeComponent {
  guid_: number;
  parentGuid_: number;
}

export type ActionComponent = BehaviorTreeComponent;

export interface ConditionComponent {
  isReverseSuccess_: boolean;
}

export type ShotHitBaseAction = BehaviorTreeComponent & {
  offset_: cVec4;
  size_: cVec4;
  degreeX_: f32;
  degreeY_: f32;
  degreeZ_: f32;
  shape_: s32;
};

export type ShotMoveBaseAction = ActionComponent & {
  velocityBegin_: f32;
  velocityEnd_: f32;
  moveSecondMax_: f32;
  isGroundFollow_: boolean;
  isGroundFollow_MoveEnd_: boolean;
  groundFollowHigh_: f32;
  groundFollowLow_: f32;
  groundFollowOffsetY_: f32;
};

/* Top-level Nodes */

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
  conditionGuids_: [{ Element: number }];
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

/* Behavior Tree Components */

export type AIBattleDistanceCondition = BehaviorTreeComponent &
  ConditionComponent & {
    boolName_: string;
    distance_: number;
    type_: number;
    useBlackBoardValue_: boolean;
  };

export type AIMoveAction = BehaviorTreeComponent & {
  boolName_: string;
  dashLength_: number;
  dist_: number;
  isCheckCollision_: boolean;
  isSetPosition_: boolean;
  isSmoothPass_: boolean;
  minMoveTime_: number;
  // "PlayerAI_TargetPoint"
  positionBBName_: string;
  positionHashValue_: number;
  position: cVec4;
  randomChangeAddTime_: number;
  randomChangeTime_: number;
  randomLength_: number;
  sideLength_: number;
  smoothRate_: number;
  type_: number;
  useBlackBoardValue_: boolean;
};

export type ActionEndCondition = BehaviorTreeComponent &
  ConditionComponent & {
    isAllEnd_: boolean;
  };

export type AIBattleSequenceCondition = BehaviorTreeComponent &
  ConditionComponent & {
    flagType_: number;
  };

export type AIBattleAttackAction = BehaviorTreeComponent & {
  attackType_: number;
  isCharge_: boolean;
  isRapid_: boolean;
  rapidIntervalFrame_: number;
  timer_: number;
};

export type AIBattleSelectCondition = BehaviorTreeComponent &
  ConditionComponent & {
    comboIndex_: number;
  };

export type AIBattleSelectComboAction = BehaviorTreeComponent & {
  playerAICombos_: [Element: { rangeMax_: number; rangeMin_: number }];
};

export type TimerAction = BehaviorTreeComponent & {
  randomSeconds_: number;
  waitTimeSeconds_: number;
};

export type BlackBoardBoolAction = BehaviorTreeComponent & {
  setTiming_: number;
  /// "PlayerAI_SetBattleWaitMode"
  valueName_: string;
  value_: boolean;
};

export type FSMUnderLayerEndCondition = BehaviorTreeComponent &
  ConditionComponent;

export type BlackBoardIntCondition = BehaviorTreeComponent & {
  /// "PlayerAI_OrderType"
  intName_: string;
  operatorType_: number;
  value_: number;
};

export type ShotPosAction = BehaviorTreeComponent & {
  degreeX_: number;
  degreeY_: number;
  isAddPosAndRot_: boolean;
  isInit_: boolean;
  isUpdateAttachParent_: boolean;
  isUseHomingTargetOnMoveInfo_: boolean;
  isUseOnMoveInfo_: boolean;
  offset: cVec4;
  partsNo_: number;
  scale_: number;
};

export type ShotTerminateAction = BehaviorTreeComponent;

export type ShotVfxAction = BehaviorTreeComponent & {
  canEditScaleXYZ_: boolean;
  delCode_: number;
  effectId_: number;
  effectObjId_: number;
  guid_: number;
  isHitEffectKeepFront_: boolean;
  isHitEffect_: boolean;
  isSetHitEffectEspCtrl_: boolean;
  isUseParentObjId_: boolean;
  offsetPos: cVec4;
  oneShot_: boolean;
  scaleY_: number;
  scaleZ_: number;
  scale_: number;
  seName_: string;
};

export type ShotTimerAction = BehaviorTreeComponent & {
  isForceSet_: boolean;
  waitTimeSeconds_: number;
};

export type ShotStatusFlagCondition = BehaviorTreeComponent &
  ConditionComponent & {
    isSuccessAny_: boolean;
    statusFlagInfo_: [Element: { isEnable_: boolean; statusFlag_: number }];
  };

export type ShotBgLayAction = ActionComponent & {
  degreeX_: number;
  degreeY_: number;
  hitType_: number;
  isHitAttackOff_: boolean;
  isMoveToHitPos_: boolean;
  isResetRotHitPos_: boolean;
  offset: cVec4;
  radius_: number;
};

export type ShotAttackAction = ShotHitBaseAction & {
  direction_: number;
  target_: number;
  globalType_: number;
  type_: number;
  reaction_: number;
  hitFlag_: number;
  categoryFlag_: number;
  element_: number;
  attackRate_: number;
  breakRate_: number;
  spArtsRate_: number;
  hitStopSecond_: number;
  hitVibrationType_: number;
  lifeSecond_: number;
  multiHitIntervalSecond_: number;
  knockBackRate_: number;
  damageMovementRate_: number;
  damageMovementRateY_: number;
  isHitOnce_: boolean;
  isMoveToHitPos_: boolean;
  isSetAttackerPos_: boolean;
  isSetAttackerHitList_: boolean;
  isClearHitList_: boolean;
  multiHitLimit_: number;
  isSwept_: boolean;
  debuffList_: [];
  attackClearTime_: number;
  appropriStartDist: number;
  appropriEndDist: number;
  notAppropriDistAtkRate_: number;
  isTakeOverAppropriDist_: boolean;
  isAlreadyHitClearEachEntity_: boolean;
  isHitOnlyHormingTarget_: boolean;
};

export type ShotMoveStraightAction = ShotMoveBaseAction & {
  gravityScale_: f32;
  isRotateFall_: boolean;
};

export type ShotMoveHomingAction = ShotMoveStraightAction & {
  isHomingOnlyY_: boolean;
  isStopDistanceAndAngle_: boolean;
  rotSpeed_: number;
  stopDegree_: number;
  stopDistance_: number;
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
  | "ShotStatusFlagCondition"
  | "ShotBgLayAction"
  | "ShotAttackAction"
  | "ShotMoveHomingAction";

export type NodeType =
  | layerNo
  | addAllTransition
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
  | ShotStatusFlagCondition
  | ShotBgLayAction
  | ShotAttackAction
  | ShotMoveHomingAction;
