import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
} from "reactflow";

import { Transition } from "@/types";

export function TransitionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerStart,
  markerEnd,
  data,
}: EdgeProps<Transition>) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const edgeStyle = {
    stroke: "#fff",
    strokeWidth: 3,
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerStart={markerStart}
        markerEnd={markerEnd}
        style={edgeStyle}
      />
      <EdgeLabelRenderer>
        <div
          className="p-4 bg-white rounded hover:bg-gray-200 shadow-md nodrag nopan"
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <div className="text-lg text-black font-bold">
            Transition
            <br />
            Conditions: ({data?.conditionGuids_.length})
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
