export const SERVICE_IDS = [
  'supply-chain',
  'factory-orchestrator',
  'custom-agents',
  'consulting',
] as const;

export const SECTION_IDS = ['services', 'technology', 'why-us', 'personas', 'contact'] as const;

export const SERVICE_LABELS: Record<string, string> = {
  'supply-chain': 'H2-SupplyChain Guardian',
  'factory-orchestrator': 'Factory Orchestrator (ALOC v2.0)',
  'custom-agents': 'Custom Agentic Workflows',
  consulting: 'AI Strategy and Consulting',
};
