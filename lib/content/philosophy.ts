// Content module — Philosophy section principles.
// Single source of truth for both the Philosophy section and the chatbot persona.

export type Principle = {
  number: string;
  title: string;
  body: string;
};

export const PRINCIPLES: readonly Principle[] = [
  {
    number: "1.",
    title: "Cloud-native by default.",
    body: "Stateless services, declarative deploys, and infrastructure that can be rebuilt from a single commit. If it can't be killed and respawned, it's a liability.",
  },
  {
    number: "2.",
    title: "Observability is not optional.",
    body: "Every microservice ships with structured logs, RED metrics and traces from day one. You cannot operate what you cannot see.",
  },
  {
    number: "3.",
    title: "Automate the path to production.",
    body: "Pipelines should make the safe thing the easy thing. ArgoCD, GitHub Actions and a green test suite beat heroics every time.",
  },
] as const;
