import { createLazyFileRoute } from "@tanstack/react-router";

import Index from "@/pages";

export const Route = createLazyFileRoute("/")({
  component: Index,
});
