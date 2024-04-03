import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: () => <div className="p-6 text-lg">FSM Editor</div>,
});
