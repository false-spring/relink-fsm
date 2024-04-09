import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useShallow } from "zustand/react/shallow";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Toaster } from "@/components/ui/sonner";
import { kvnodes_to_graph } from "@/lib/fsm";
import { decodeFile, encodeFile } from "@/lib/msgpack";
import useGraphStore from "@/stores/use-graph-store";
import { KVNode } from "@/types";

const FILE_PICKER_OPTIONS = {
  types: [
    {
      description: "FSM",
      accept: {
        "application/msgpack": [".msg", ".msgpack"],
        "application/json": [".json"],
      },
    },
  ],
  excludeAcceptAllOption: true,
  multiple: false,
};

export default function Root() {
  const { filename, setFilename, setNodes, setEdges, nodes, edges } =
    useGraphStore(
      useShallow((state) => ({
        filename: state.filename,
        setFilename: state.setFilename,
        setNodes: state.setNodes,
        setEdges: state.setEdges,
        nodes: state.nodes,
        edges: state.edges,
      })),
    );

  document.title = filename
    ? `Relink FSM Tool - ${filename}`
    : "Relink FSM Tool";

  const openFileDialog = useCallback(
    (e: Event) => {
      e.preventDefault();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)
        .showOpenFilePicker(FILE_PICKER_OPTIONS)
        .then((files: [FileSystemFileHandle]) => {
          const file = files[0];

          return file.getFile();
        })

        .then((file: File) => {
          setFilename(file.name);

          setNodes([]);
          setEdges([]);

          return decodeFile(file);
        })
        .then((kvnodes: KVNode[]) => {
          const graph = kvnodes_to_graph(kvnodes);

          setNodes(graph.nodes);
          setEdges(graph.edges);
        });
    },
    [setEdges, setFilename, setNodes],
  );

  const saveFileDialog = useCallback(
    async (e: Event) => {
      e.preventDefault();

      const data: KVNode[] = [];

      for (const node of nodes) {
        data.push({ key: node.data.key, value: node.data.value });
      }

      for (const edge of edges) {
        if (edge.type === "transition") {
          data.push({ key: "Transition", value: edge.data.value });
        }
      }

      if (data.length === 0) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: "MessagePack",
            accept: {
              "application/msgpack": [".msg"],
            },
          },
          {
            description: "JSON",
            accept: {
              "application/json": [".json"],
            },
          },
        ],
      });

      const writable = await fileHandle.createWritable();

      if (fileHandle.name.endsWith(".msg")) {
        await encodeFile(data, fileHandle.name, writable);
      } else if (fileHandle.name.endsWith(".json")) {
        await writable.write(JSON.stringify(data, null, 2));
        await writable.close();
      }
    },
    [filename, nodes, edges],
  );

  useHotkeys("ctrl+o", openFileDialog);
  useHotkeys("ctrl+s", saveFileDialog);

  return (
    <>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={openFileDialog}>
              Open File <MenubarShortcut>Ctrl + O</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onSelect={saveFileDialog}>
              Save <MenubarShortcut>Ctrl + S</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <h1>{filename}</h1>
      </Menubar>

      <hr />
      <Outlet />
      <Toaster />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  );
}
