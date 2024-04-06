import { useMemo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

type Default = { label: string };

export function DefaultNode({
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps<Default>) {
  const json = useMemo(() => {
    return JSON.stringify(data.value, null, " ");
  }, [data.value]);

  return (
    <div className="px-4 py-2 bg-gray-700 rounded-lg shadow-md">
      <Handle
        type="target"
        position={targetPosition}
        isConnectable={isConnectable}
      />
      <div className="font-bold">{data.label}</div>
      <pre className="font-mono">{json}</pre>
      <Handle
        type="source"
        position={sourcePosition}
        isConnectable={isConnectable}
      />
    </div>
  );
}
