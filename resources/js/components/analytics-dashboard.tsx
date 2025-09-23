import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Chart, LeadTrendChart, ConversionChart, StatusDistributionChart } from '@/components/ui/chart';
import { ProgressRing } from '@/components/ui/progress-ring';
import { StatusIndicator, getLeadStatusVariant } from '@/components/ui/status-indicator';
import { TrendingUp, TrendingDown, Target, Users, Calendar, Award, Activity, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  totalLeads: number;
  conversionRate: number;
  avgResponseTime: number;
  activeFollowUps: number;
  monthlyTrend: Array<{ period: string; leads: number; customers: number }>;
  statusDistribution: Array<{ status: string; count: number; color: string }>;
  conversionFunnel: Array<{ stage: string; count: number }>;
  topPerformers: Array<{ name: string; leads: number; conversions: number }>;
  recentActivities: Array<{ 
    id: number; 
    type: 'lead_created' | 'follow_up' | 'status_change'; 
    description: string; 
    timestamp: string;
    user?: string;
  }>;
}

interface AnalyticsDashboardProps {
  data?: AnalyticsData;
  isLoading?: boolean;
  period?: '7d' | '30d' | '90d' | '1y';
}

// Skeleton components
const MetricCardSkeleton = () => (
  <Card className="border-border/50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-20" />
    </CardContent>
  </Card>
);

const ChartCardSkeleton = ({ height = 200 }: { height?: number }) => (
  <Card className="border-border/50">
    <CardHeader>
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-48" />
    </CardHeader>
    <CardContent>
      <Skeleton className={`w-full`} style={{ height: `${height}px` }} />
    </CardContent>
  </Card>
);

export function AnalyticsDashboard({ data, isLoading = false, period = '30d' }: AnalyticsDashboardProps) {
  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCardSkeleton height={250} />
          <ChartCardSkeleton height={300} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCardSkeleton />
          <ChartCardSkeleton />
          <ChartCardSkeleton />
        </div>
      </div>
    );
  }

  const periodLabels = {
    '7d': '7 hari terakhir',
    '30d': '30 hari terakhir', 
    '90d': '90 hari terakhir',
    '1y': '1 tahun terakhir'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-primary">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Insight kinerja leads dan follow-up untuk {periodLabels[period]}
          </p>
        </div>
        <Badge variant="outline" className="text-brand-primary border-brand-primary/20">
          <Activity className="h-3 w-3 mr-1" />
          Live Data
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-soft hover-lift animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
              <Users className="h-5 w-5 text-brand-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-brand-primary">{data.totalLeads}</div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500 font-medium">+12%</span>
                  <span className="text-muted-foreground">vs periode lalu</span>
                </div>
              </div>
              <ProgressRing 
                progress={75} 
                size={50} 
                showPercentage={false}
                color="var(--brand-primary)"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft hover-lift animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
              <Target className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{data.conversionRate}%</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+3.2%</span>
              <span className="text-muted-foreground">peningkatan</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft hover-lift animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response Time</CardTitle>
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{data.avgResponseTime}h</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingDown className="h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">-15%</span>
              <span className="text-muted-foreground">lebih cepat</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft hover-lift animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Follow-ups</CardTitle>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{data.activeFollowUps}</div>
            <p className="text-xs text-muted-foreground mt-1">Follow-up aktif hari ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Trend */}
        <Card className="border-border/50 shadow-soft animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="text-brand-primary flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Tren Leads & Konversi
            </CardTitle>
            <CardDescription>
              Pertumbuhan leads dan tingkat konversi dari waktu ke waktu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeadTrendChart data={data.monthlyTrend} />
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="border-border/50 shadow-soft animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="text-brand-primary flex items-center gap-2">
              <Target className="h-5 w-5" />
              Distribusi Status Leads
            </CardTitle>
            <CardDescription>
              Breakdown leads berdasarkan status saat ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatusDistributionChart data={data.statusDistribution} />
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <Card className="border-border/50 shadow-soft animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="text-brand-primary">Conversion Funnel</CardTitle>
            <CardDescription>
              Tahapan follow-up dan tingkat konversi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConversionChart data={data.conversionFunnel} />
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="border-border/50 shadow-soft animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <CardHeader>
            <CardTitle className="text-brand-primary flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performers
            </CardTitle>
            <CardDescription>
              Marketing dengan performa terbaik
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topPerformers.map((performer, index) => {
                const conversionRate = performer.leads > 0 ? ((performer.conversions / performer.leads) * 100).toFixed(1) : '0';
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{performer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {performer.leads} leads • {performer.conversions} konversi
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      {conversionRate}%
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border-border/50 shadow-soft animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <CardHeader>
            <CardTitle className="text-brand-primary flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Aktivitas Terbaru
            </CardTitle>
            <CardDescription>
              Update terbaru sistem leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivities.map((activity, index) => {
                const getActivityIcon = (type: string) => {
                  switch (type) {
                    case 'lead_created': return '👤';
                    case 'follow_up': return '📞';
                    case 'status_change': return '🔄';
                    default: return '📋';
                  }
                };

                const getActivityColor = (type: string) => {
                  switch (type) {
                    case 'lead_created': return 'text-blue-600';
                    case 'follow_up': return 'text-green-600';
                    case 'status_change': return 'text-orange-600';
                    default: return 'text-gray-600';
                  }
                };

                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="text-lg">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {activity.user && (
                          <span className="text-xs text-muted-foreground">oleh {activity.user}</span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}