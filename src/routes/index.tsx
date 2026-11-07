import { createFileRoute } from "@tanstack/react-router";
import { OctileLab } from "@/components/octile-lab";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <OctileLab />;
}
