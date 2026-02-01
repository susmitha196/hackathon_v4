import { Route, Switch } from 'wouter';
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const H2SupplyChainGuardian = lazy(() => import('./pages/H2SupplyChainGuardian').then((m) => ({ default: m.H2SupplyChainGuardian })));
const FactoryOrchestrator = lazy(() => import('./pages/FactoryOrchestrator').then((m) => ({ default: m.FactoryOrchestrator })));
const FactoryCopilotDashboard = lazy(() => import('./pages/FactoryCopilotDashboard').then((m) => ({ default: m.FactoryCopilotDashboard })));
const CustomAgenticWorkflows = lazy(() => import('./pages/CustomAgenticWorkflows').then((m) => ({ default: m.CustomAgenticWorkflows })));
const AIStrategyConsulting = lazy(() => import('./pages/AIStrategyConsulting').then((m) => ({ default: m.AIStrategyConsulting })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" aria-hidden />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/services/h2-supplychain-guardian" component={H2SupplyChainGuardian} />
        <Route path="/services/factory-orchestrator" component={FactoryOrchestrator} />
        <Route path="/services/factory-orchestrator/dashboard" component={FactoryCopilotDashboard} />
        <Route path="/services/custom-agentic-workflows" component={CustomAgenticWorkflows} />
        <Route path="/services/ai-strategy-consulting" component={AIStrategyConsulting} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}
