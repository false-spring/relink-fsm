import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useShallow } from "zustand/react/shallow";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { kvnodes_to_graph } from "@/lib/fsm";
import { decodeFile } from "@/lib/msgpack";
import useGraphStore from "@/stores/use-graph-store";

export default function Root() {
  const { filename, setFilename, setNodes, setEdges } = useGraphStore(
    useShallow((state) => ({
      filename: state.filename,
      setFilename: state.setFilename,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
    })),
  );

  document.title = filename
    ? `Relink FSM Tool - ${filename}`
    : "Relink FSM Tool";

  const openFileDialog = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)
      .showOpenFilePicker()
      .then((files: [FileSystemFileHandle]) => {
        const file = files[0];

        setFilename(file.name);

        setNodes([]);
        setEdges([]);

        decodeFile(file).then((kvnodes) => {
          const graph = kvnodes_to_graph(kvnodes);

          setNodes(graph.nodes);
          setEdges(graph.edges);
        });
      });
  };

  return (
    <>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={openFileDialog}>
              Open File <MenubarShortcut>Ctrl + O</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <h1>{filename}</h1>
      </Menubar>

      <hr />
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  );
}
