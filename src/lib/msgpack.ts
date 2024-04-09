import { decode } from "@msgpack/msgpack/src";

import type { KVNode } from "@/types";

export function decodeFile(file: File): Promise<Array<KVNode>> {
  console.log(file.name.endsWith(".msgpack"));

  const isJSON = file.name.endsWith(".json");
  const isMessagePack =
    file.name.endsWith(".msgpack") || file.name.endsWith(".msg");

  if (!isMessagePack && !isJSON) {
    return Promise.reject(new Error("Invalid file type"));
  } else if (isJSON) {
    return file.text().then((text) => {
      const data = JSON.parse(text) as KVNode[];

      return data;
    });
  } else if (isMessagePack) {
    return file.arrayBuffer().then((buffer) => {
      const data = decode(new Uint8Array(buffer)) as KVNode[];

      return data;
    });
  }

  return Promise.reject(new Error("Invalid file type"));
}
