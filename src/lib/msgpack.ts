import { decode } from "@msgpack/msgpack/src";

export function decodeFile(file: FileSystemFileHandle) {
  console.log(file);

  return file.getFile().then((file) => {
    return file.arrayBuffer().then((buffer) => {
      const data = decode(new Uint8Array(buffer));
      return data;
    });
  });
}
