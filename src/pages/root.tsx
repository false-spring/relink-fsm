import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { decodeFile } from "@/lib/msgpack";
import useNodeStore from "@/stores/use-node-store";

export default function Root() {
  const setNodes = useNodeStore((state) => state.setNodes);

  const openFileDialog = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)
      .showOpenFilePicker()
      .then((files: [FileSystemFileHandle]) => {
        const file = files[0];
        decodeFile(file).then((data) => {
          const nodes = data
            .map((element, i) => {
              const nodeType = element["key"];
              let value = element["value"];

              if (Array.isArray(value)) {
                value = element["value"].reduce((acc, pair) => {
                  return {
                    ...acc,
                    [pair["key"]]: pair["value"],
                  };
                }, {});
              }

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
                return null;
              }

              return {
                id:
                  typeof value === "object"
                    ? value["guid_"].toString()
                    : nodeType,
                data: {
                  label: nodeType,
                  value,
                },
              };
            })
            .filter((node) => node !== null)
            .map((node, i) => {
              const x = (i % 10) * 175;
              const y = Math.floor(i / 10) * 75;

              return {
                ...node,
                position: { x, y },
              };
            });

          setNodes(nodes);
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
      </Menubar>

      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
