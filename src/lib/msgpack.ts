import { decode } from "@msgpack/msgpack/src";

import type { KVNode } from "@/types";

export function decodeFile(file: FileSystemFileHandle): Promise<Array<KVNode>> {
  return file
    .getFile()
    .then((file) => {
      return file.arrayBuffer();
    })
    .then((buffer) => {
      const data = decode(new Uint8Array(buffer)) as KVNode[];
      return data;
    });
}
