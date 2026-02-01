import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BackgroundEffects } from '../components/ui/BackgroundEffects';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Settings,
  BarChart3,
  Zap,
  CheckCircle
} from 'lucide-react';

export function Dashboard() {
  return (
    <>
      <BackgroundEffects />
      <Header />
      <main id="main" className="min-h-screen">
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">
              Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome to your control center. Monitor and manage your operations from here.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary/20 text-primary">
                  <Activity className="h-6 w-6" />
                </div>
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">24</div>
              <div className="text-sm text-muted-foreground">Active Workflows</div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-500/20 text-green-500">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <span className="text-sm text-muted-foreground">Success</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">98.5%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-accent/20 text-accent">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <span className="text-sm text-muted-foreground">Performance</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">+12%</div>
              <div className="text-sm text-muted-foreground">This Month</div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-500/20 text-purple-500">
                  <Users className="h-6 w-6" />
                </div>
                <span className="text-sm text-muted-foreground">Users</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">156</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="font-display font-bold text-2xl text-foreground mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <a
                href="/services/factory-orchestrator/dashboard"
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/20 text-primary group-hover:bg-primary/30 transition-colors">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Live Monitoring</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor machine health and downtime risk
                    </p>
                  </div>
                </div>
              </a>

              <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-accent/20 text-accent group-hover:bg-accent/30 transition-colors">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      View detailed reports and insights
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-500/20 text-green-500 group-hover:bg-green-500/30 transition-colors">
                    <Settings className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure your preferences
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-6">
              Recent Activity
            </h2>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="space-y-4">
                {[
                  { icon: Zap, text: 'Live Monitoring workflow executed successfully', time: '2 minutes ago', color: 'text-green-500' },
                  { icon: Activity, text: 'New sensor data received from Machine #5', time: '15 minutes ago', color: 'text-primary' },
                  { icon: TrendingUp, text: 'Performance report generated', time: '1 hour ago', color: 'text-accent' },
                  { icon: CheckCircle, text: 'System health check completed', time: '2 hours ago', color: 'text-green-500' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className={`p-2 rounded-lg bg-muted ${activity.color}`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium">{activity.text}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
