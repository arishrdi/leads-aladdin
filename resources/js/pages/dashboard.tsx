import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProgressRing } from '@/components/ui/progress-ring';
import { StatusIndicator, getLeadStatusVariant, PriorityIndicator } from '@/components/ui/status-indicator';
import { TrendChart, StatusDistribution } from '@/components/ui/mini-chart';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { showToast } from '@/lib/toast-helpers';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Users, Target, TrendingUp, Calendar, Plus, Bell, ArrowUp, ArrowDown, BarChart3, Activity, GitCompare, X, Check } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps extends PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            role: string;
        };
    };
    stats: {
        total_leads: number;
        warm_leads: number;
        hot_leads: number;
        customers: number;
        todays_followups: number;
        overdue_followups: number;
    };
    recent_leads: Array<{
        id: number;
        nama_pelanggan: string;
        status: string;
        tanggal_leads: string;
    }>;
    todays_followups: Array<{
        id: number;
        stage: string;
        scheduled_at: string;
        leads: {
            nama_pelanggan: string;
            status: string;
        };
    }>;
    outlet_comparison?: Array<{
        id: number;
        nama_cabang: string;
        lokasi: string;
        pic: string;
        stats: {
            total_leads: number;
            warm_leads: number;
            hot_leads: number;
            customers: number;
            exit_leads: number;
            cold_leads: number;
            conversion_rate: number;
            potential_revenue: number;
            deal_revenue: number;
            this_month_leads: number;
            this_month_customers: number;
        };
    }>;
    all_branches?: Array<{
        id: number;
        nama_cabang: string;
        lokasi: string;
        pic: string;
        stats: {
            total_leads: number;
            warm_leads: number;
            hot_leads: number;
            customers: number;
            exit_leads: number;
            cold_leads: number;
            cross_selling_leads: number;
            conversion_rate: number;
            potential_revenue: number;
            deal_revenue: number;
            this_month_leads: number;
            this_month_customers: number;
            todays_followups: number;
            overdue_followups: number;
        };
        recent_leads: Array<{
            id: number;
            nama_pelanggan: string;
            status: string;
            tanggal_leads: string;
        }>;
    }>;
    analytics?: {
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
    };
}

// Skeleton loader for stats cards
const StatsCardSkeleton = () => (
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

// Skeleton loader for lead items
const LeadItemSkeleton = () => (
    <div className="p-3 rounded-lg bg-muted/30">
        <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
        </div>
    </div>
);

export default function Dashboard() {
    const { auth, stats, recent_leads, todays_followups, analytics, outlet_comparison, all_branches } = usePage<DashboardProps>().props;
    const isMarketing = auth.user.role === 'marketing';
    const canViewAnalytics = auth.user.role === 'supervisor' || auth.user.role === 'super_user';
    const isSuperUser = auth.user.role === 'super_user';

    console.log("User role", auth.user.role)
    
    // Comparison Mode State
    const [comparisonMode, setComparisonMode] = useState(false);
    const [selectedBranches, setSelectedBranches] = useState<number[]>([]);

    // Toggle branch selection for comparison
    const toggleBranchSelection = (branchId: number) => {
        setSelectedBranches(prev => 
            prev.includes(branchId) 
                ? prev.filter(id => id !== branchId)
                : [...prev, branchId]
        );
    };

    // Get selected branches data
    const getSelectedBranchesData = () => {
        if (!all_branches || selectedBranches.length === 0) return [];
        return all_branches.filter(branch => selectedBranches.includes(branch.id));
    };

    // Clear comparison mode
    const clearComparison = () => {
        setComparisonMode(false);
        setSelectedBranches([]);
    };

    const statusColors = {
        NEW: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700',
        QUALIFIED: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
        WARM: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
        HOT: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700',
        CONVERTED: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
        CUSTOMER: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
        COLD: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700',
        EXIT: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700',
        CROSS_SELLING: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Leads Aladdin" />
            
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-brand-primary">
                            Selamat Datang, {auth.user.name}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {isMarketing ? 'Kelola leads dan follow-up Anda' : 'Pantau kinerja tim dan leads'}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        {isMarketing && (
                            <Link href="/leads/create">
                                <Button className="bg-brand-primary hover:bg-brand-primary-dark transition-colors touch-target btn-ripple btn-press">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tambah Lead
                                </Button>
                            </Link>
                        )}
                        {isSuperUser && all_branches && all_branches.length > 0 && (
                            <Button 
                                onClick={() => setComparisonMode(!comparisonMode)}
                                variant={comparisonMode ? "default" : "outline"}
                                className="touch-target transition-colors"
                            >
                                <GitCompare className="h-4 w-4 mr-2" />
                                {comparisonMode ? 'Mode Normal' : 'Mode Perbandingan'}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Branch Selector for Comparison Mode */}
                {comparisonMode && isSuperUser && all_branches && (
                    <Card className="border-brand-primary/20 bg-brand-primary/5">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-brand-primary/10">
                                        <GitCompare className="h-5 w-5 text-brand-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-brand-primary">Mode Perbandingan Cabang</CardTitle>
                                        <CardDescription>
                                            Pilih cabang yang ingin dibandingkan ({selectedBranches.length} dipilih)
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button
                                    onClick={clearComparison}
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {all_branches.map((branch) => (
                                    <div
                                        key={branch.id}
                                        onClick={() => toggleBranchSelection(branch.id)}
                                        className={`
                                            p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                                            ${selectedBranches.includes(branch.id) 
                                                ? 'border-brand-primary bg-brand-primary/10 shadow-md' 
                                                : 'border-border hover:border-brand-primary/50 hover:bg-muted/50'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-foreground">{branch.nama_cabang}</p>
                                                <p className="text-xs text-muted-foreground">{branch.lokasi}</p>
                                            </div>
                                            <div className={`
                                                w-6 h-6 rounded-full border-2 flex items-center justify-center
                                                ${selectedBranches.includes(branch.id)
                                                    ? 'border-brand-primary bg-brand-primary text-white'
                                                    : 'border-muted-foreground'
                                                }
                                            `}>
                                                {selectedBranches.includes(branch.id) && (
                                                    <Check className="h-3 w-3" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            {branch.stats.total_leads} leads • {branch.stats.customers} customer
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {selectedBranches.length > 0 && (
                                <div className="mt-4 flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <span className="text-sm font-medium">
                                        {selectedBranches.length} cabang dipilih untuk perbandingan
                                    </span>
                                    <Button
                                        onClick={() => setSelectedBranches([])}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        Bersihkan Semua
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Comprehensive Comparison View */}
                {comparisonMode && selectedBranches.length > 0 ? (
                    <div className="space-y-6">
                        {/* Comparison Stats Overview */}
                        <Card className="border-border/50 shadow-soft">
                            <CardHeader>
                                <CardTitle className="text-brand-primary flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Perbandingan Metrics Utama
                                </CardTitle>
                                <CardDescription>
                                    Perbandingan key performance indicators antar cabang terpilih
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-2 font-medium text-muted-foreground">Cabang</th>
                                                <th className="text-center p-2 font-medium text-muted-foreground">Total Leads</th>
                                                <th className="text-center p-2 font-medium text-muted-foreground">Warm</th>
                                                <th className="text-center p-2 font-medium text-muted-foreground">Hot</th>
                                                <th className="text-center p-2 font-medium text-muted-foreground">Customer</th>
                                                <th className="text-center p-2 font-medium text-muted-foreground">Konversi</th>
                                                <th className="text-center p-2 font-medium text-muted-foreground">Revenue</th>
                                                <th className="text-center p-2 font-medium text-muted-foreground">Follow-up</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getSelectedBranchesData().map((branch) => (
                                                <tr key={branch.id} className="border-b hover:bg-muted/30">
                                                    <td className="p-2">
                                                        <div>
                                                            <p className="font-medium text-foreground">{branch.nama_cabang}</p>
                                                            <p className="text-xs text-muted-foreground">{branch.lokasi}</p>
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-2">
                                                        <div className="text-lg font-bold text-brand-primary">{branch.stats.total_leads}</div>
                                                        <div className="text-xs text-green-600">+{branch.stats.this_month_leads} bulan ini</div>
                                                    </td>
                                                    <td className="text-center p-2">
                                                        <div className="text-lg font-bold text-status-warm">{branch.stats.warm_leads}</div>
                                                    </td>
                                                    <td className="text-center p-2">
                                                        <div className="text-lg font-bold text-status-hot">{branch.stats.hot_leads}</div>
                                                    </td>
                                                    <td className="text-center p-2">
                                                        <div className="text-lg font-bold text-status-customer">{branch.stats.customers}</div>
                                                        <div className="text-xs text-green-600">+{branch.stats.this_month_customers} bulan ini</div>
                                                    </td>
                                                    <td className="text-center p-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {branch.stats.conversion_rate}%
                                                        </Badge>
                                                    </td>
                                                    <td className="text-center p-2">
                                                        <div className="text-sm font-medium text-green-600">
                                                            Rp {(branch.stats.deal_revenue / 1000000).toFixed(1)}M
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            dari Rp {(branch.stats.potential_revenue / 1000000).toFixed(1)}M
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-2">
                                                        <div className="text-sm font-medium text-brand-primary">{branch.stats.todays_followups}</div>
                                                        <div className="text-xs text-red-600">{branch.stats.overdue_followups} terlambat</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Visual Comparison Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Leads Status Comparison */}
                            <Card className="border-border/50 shadow-soft">
                                <CardHeader>
                                    <CardTitle className="text-brand-primary">Status Leads Comparison</CardTitle>
                                    <CardDescription>Perbandingan distribusi status leads</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {getSelectedBranchesData().map((branch) => (
                                            <div key={branch.id}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-sm">{branch.nama_cabang}</span>
                                                    <span className="text-xs text-muted-foreground">{branch.stats.total_leads} total</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-xs">
                                                    <div className="bg-status-warm/20 p-2 rounded text-center">
                                                        <div className="font-bold text-status-warm">{branch.stats.warm_leads}</div>
                                                        <div className="text-muted-foreground">Warm</div>
                                                    </div>
                                                    <div className="bg-status-hot/20 p-2 rounded text-center">
                                                        <div className="font-bold text-status-hot">{branch.stats.hot_leads}</div>
                                                        <div className="text-muted-foreground">Hot</div>
                                                    </div>
                                                    <div className="bg-status-customer/20 p-2 rounded text-center">
                                                        <div className="font-bold text-status-customer">{branch.stats.customers}</div>
                                                        <div className="text-muted-foreground">Customer</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Revenue Comparison */}
                            <Card className="border-border/50 shadow-soft">
                                <CardHeader>
                                    <CardTitle className="text-brand-primary">Revenue Comparison</CardTitle>
                                    <CardDescription>Perbandingan pencapaian revenue antar cabang</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {getSelectedBranchesData().map((branch) => {
                                            const revenuePercentage = branch.stats.potential_revenue > 0 
                                                ? (branch.stats.deal_revenue / branch.stats.potential_revenue) * 100 
                                                : 0;
                                            return (
                                                <div key={branch.id}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-sm">{branch.nama_cabang}</span>
                                                        <span className="text-xs font-medium text-green-600">
                                                            {revenuePercentage.toFixed(1)}% achieved
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                                                            style={{ width: `${Math.min(revenuePercentage, 100)}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                        <span>Rp {(branch.stats.deal_revenue / 1000000).toFixed(1)}M</span>
                                                        <span>Target: Rp {(branch.stats.potential_revenue / 1000000).toFixed(1)}M</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Leads Comparison */}
                        <Card className="border-border/50 shadow-soft">
                            <CardHeader>
                                <CardTitle className="text-brand-primary">Recent Leads Comparison</CardTitle>
                                <CardDescription>Leads terbaru dari masing-masing cabang</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {getSelectedBranchesData().map((branch) => (
                                        <div key={branch.id} className="space-y-3">
                                            <h4 className="font-medium text-brand-primary">{branch.nama_cabang}</h4>
                                            <div className="space-y-2">
                                                {branch.recent_leads.slice(0, 3).map((lead) => (
                                                    <div key={lead.id} className="p-2 rounded-lg bg-muted/30 text-sm">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium">{lead.nama_pelanggan}</span>
                                                            <StatusIndicator variant={getLeadStatusVariant(lead.status)} size="sm">
                                                                {lead.status}
                                                            </StatusIndicator>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">{lead.tanggal_leads}</span>
                                                    </div>
                                                ))}
                                                {branch.recent_leads.length === 0 && (
                                                    <div className="text-center py-4 text-muted-foreground text-sm">
                                                        Belum ada leads
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <>
                        {/* Normal Dashboard Content - Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-border/50 shadow-soft hover-lift animate-fade-in">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                            <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-brand-primary/10 transition-colors">
                                <Users className="h-5 w-5 text-brand-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-3xl font-bold text-brand-primary animate-scale-in">{stats?.total_leads || 0}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Total keseluruhan</p>
                                </div>
                                <ProgressRing 
                                    progress={75} 
                                    size={50} 
                                    showPercentage={false}
                                    color="var(--brand-primary)"
                                />
                            </div>
                            <div className="mt-3">
                                <TrendChart data={[45, 52, 48, 61, 58, 67, 73]} trend="up" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-soft hover-lift animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Leads Warm</CardTitle>
                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                                <Target className="h-5 w-5 text-status-warm" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-3xl font-bold text-status-warm animate-scale-in" style={{ animationDelay: '0.2s' }}>{stats?.warm_leads || 0}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Berpotensi menjadi hot</p>
                                </div>
                                <div className="flex items-center gap-1 text-status-warm">
                                    <ArrowUp className="h-4 w-4" />
                                    <span className="text-sm font-medium">+12%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-soft hover-lift animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Leads Hot</CardTitle>
                            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950 group-hover:bg-orange-100 dark:group-hover:bg-orange-900 transition-colors">
                                <TrendingUp className="h-5 w-5 text-status-hot" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-status-hot animate-scale-in" style={{ animationDelay: '0.3s' }}>{stats?.hot_leads || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Siap untuk closing</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-soft hover-lift animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Customer</CardTitle>
                            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950 group-hover:bg-green-100 dark:group-hover:bg-green-900 transition-colors">
                                <TrendingUp className="h-5 w-5 text-status-customer" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-status-customer animate-scale-in" style={{ animationDelay: '0.4s' }}>{stats?.customers || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Berhasil closing</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Status Distribution */}
                <Card className="border-border/50 shadow-soft animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <CardHeader>
                        <CardTitle className="text-brand-primary">Distribusi Status Leads</CardTitle>
                        <CardDescription>
                            Persentase leads berdasarkan status saat ini
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <StatusDistribution
                                data={[
                                    { status: 'WARM', count: stats?.warm_leads || 0, color: 'var(--status-warm)' },
                                    { status: 'HOT', count: stats?.hot_leads || 0, color: 'var(--status-hot)' },
                                    { status: 'CUSTOMER', count: stats?.customers || 0, color: 'var(--status-customer)' },
                                ]}
                            />
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-status-warm">{stats?.warm_leads || 0}</div>
                                    <div className="text-xs text-muted-foreground">Warm</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-status-hot">{stats?.hot_leads || 0}</div>
                                    <div className="text-xs text-muted-foreground">Hot</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-status-customer">{stats?.customers || 0}</div>
                                    <div className="text-xs text-muted-foreground">Customer</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Follow-up Cards for Marketing */}
                {isMarketing && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-border/50 shadow-soft hover:shadow-soft-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Follow-up Hari Ini</CardTitle>
                                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                                    <Calendar className="h-5 w-5 text-brand-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-brand-primary">{stats?.todays_followups || 0}</div>
                                <Link href="/follow-ups" className="text-sm text-brand-primary hover:text-brand-primary-dark transition-colors">
                                    Lihat semua →
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className={`border-border/50 shadow-soft hover:shadow-soft-md transition-shadow ${(stats?.overdue_followups || 0) > 0 ? 'border-destructive/20 bg-destructive/5' : ''}`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Follow-up Terlambat</CardTitle>
                                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950">
                                    <Calendar className="h-5 w-5 text-destructive" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-destructive">{stats?.overdue_followups || 0}</div>
                                <Link href="/follow-ups" className="text-sm text-destructive hover:text-destructive/80 transition-colors">
                                    {(stats?.overdue_followups || 0) > 0 ? 'Tindak lanjuti sekarang →' : 'Semua terjadwal baik'}
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Recent Leads & Today's Follow-ups */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Leads */}
                    <Card className="border-border/50 shadow-soft">
                        <CardHeader>
                            <CardTitle className="text-brand-primary">Leads Terbaru</CardTitle>
                            <CardDescription>
                                {recent_leads?.length || 0} leads terbaru
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recent_leads?.map((lead) => (
                                    <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <div className="space-y-1">
                                            <p className="font-medium text-foreground">{lead.nama_pelanggan}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(lead.tanggal_leads).toLocaleDateString('id-ID', {
                                                    weekday: 'short',
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}
                                            </p>
                                        </div>
                                        <StatusIndicator variant={getLeadStatusVariant(lead.status)}>
                                            {lead.status}
                                        </StatusIndicator>
                                    </div>
                                )) || (
                                    <div className="text-center py-8">
                                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">Belum ada leads</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6">
                                <Link href="/leads">
                                    <Button variant="outline" className="w-full touch-target">
                                        Lihat Semua Leads
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today's Follow-ups for Marketing */}
                    {isMarketing && (
                        <Card className="border-border/50 shadow-soft">
                            <CardHeader>
                                <CardTitle className="text-brand-primary">Follow-up Hari Ini</CardTitle>
                                <CardDescription>
                                    {todays_followups?.length || 0} follow-up dijadwalkan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {todays_followups?.map((followup) => (
                                        <div key={followup.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1 flex-1">
                                                    <p className="font-medium text-foreground">{followup.leads.nama_pelanggan}</p>
                                                    <p className="text-sm text-brand-primary font-medium">{followup.stage}</p>
                                                </div>
                                                <div className="text-right space-y-2">
                                                    <StatusIndicator variant={getLeadStatusVariant(followup.leads.status)} size="sm">
                                                        {followup.leads.status}
                                                    </StatusIndicator>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(followup.scheduled_at).toLocaleTimeString('id-ID', { 
                                                            hour: '2-digit', 
                                                            minute: '2-digit' 
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )) || (
                                        <div className="text-center py-8">
                                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-muted-foreground">Tidak ada follow-up hari ini</p>
                                            <p className="text-sm text-muted-foreground mt-2">Nikmati hari yang santai!</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6">
                                    <Link href="/follow-ups">
                                        <Button variant="outline" className="w-full touch-target">
                                            Lihat Semua Follow-up
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Outlet Comparison Section - Only for Supervisors and Super Users */}
                {canViewAnalytics && outlet_comparison && outlet_comparison.length > 0 && (
                    <div className="mt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-brand-primary/10">
                                <BarChart3 className="h-6 w-6 text-brand-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-brand-primary">Perbandingan Outlet</h2>
                                <p className="text-sm text-muted-foreground">
                                    Kinerja leads dan penjualan antar cabang
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {outlet_comparison.map((outlet) => (
                                <Card key={outlet.id} className="border-border/50 shadow-soft hover:shadow-soft-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-brand-primary text-lg">{outlet.nama_cabang}</CardTitle>
                                                <CardDescription className="text-sm">
                                                    {outlet.lokasi} • PIC: {outlet.pic}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {outlet.stats.conversion_rate}% konversi
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Main Stats */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 rounded-lg bg-muted/30">
                                                <div className="text-2xl font-bold text-brand-primary">{outlet.stats.total_leads}</div>
                                                <div className="text-xs text-muted-foreground">Total Leads</div>
                                            </div>
                                            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                                                <div className="text-2xl font-bold text-status-customer">{outlet.stats.customers}</div>
                                                <div className="text-xs text-muted-foreground">Customer</div>
                                            </div>
                                        </div>

                                        {/* Status Breakdown */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Warm</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-status-warm rounded-full transition-all duration-500"
                                                            style={{ 
                                                                width: outlet.stats.total_leads > 0 
                                                                    ? `${(outlet.stats.warm_leads / outlet.stats.total_leads) * 100}%` 
                                                                    : '0%' 
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="font-medium w-8 text-right">{outlet.stats.warm_leads}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Hot</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-status-hot rounded-full transition-all duration-500"
                                                            style={{ 
                                                                width: outlet.stats.total_leads > 0 
                                                                    ? `${(outlet.stats.hot_leads / outlet.stats.total_leads) * 100}%` 
                                                                    : '0%' 
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="font-medium w-8 text-right">{outlet.stats.hot_leads}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Revenue */}
                                        <div className="pt-2 border-t border-border/50">
                                            <div className="flex justify-between items-center text-sm mb-1">
                                                <span className="text-muted-foreground">Revenue Tercapai</span>
                                                <span className="font-medium text-green-600">
                                                    Rp {(outlet.stats.deal_revenue / 1000000).toFixed(1)}M
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Potensi Revenue</span>
                                                <span className="font-medium text-orange-600">
                                                    Rp {(outlet.stats.potential_revenue / 1000000).toFixed(1)}M
                                                </span>
                                            </div>
                                        </div>

                                        {/* This Month Performance */}
                                        <div className="pt-2 border-t border-border/50">
                                            <div className="text-xs text-muted-foreground mb-2">Performance Bulan Ini</div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-brand-primary">{outlet.stats.this_month_leads}</div>
                                                    <div className="text-xs text-muted-foreground">Leads Baru</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-green-600">{outlet.stats.this_month_customers}</div>
                                                    <div className="text-xs text-muted-foreground">Closing</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-red-600">{outlet.stats.exit_leads + outlet.stats.cold_leads}</div>
                                                    <div className="text-xs text-muted-foreground">Lost</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Advanced Analytics Section - Only for Supervisors and Super Users */}
                {canViewAnalytics && analytics && (
                    <div className="mt-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-brand-primary/10">
                                <BarChart3 className="h-6 w-6 text-brand-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-brand-primary">Advanced Analytics</h2>
                                <p className="text-sm text-muted-foreground">
                                    Insight mendalam untuk pengambilan keputusan strategis
                                </p>
                            </div>
                        </div>
                        
                        <AnalyticsDashboard 
                            data={analytics} 
                            period="30d"
                        />
                    </div>
                )}

                        {/* Quick Analytics Preview for Marketing */}
                        {isMarketing && (
                            <div className="mt-8">
                                <Card className="border-border/50 shadow-soft">
                                    <CardHeader>
                                        <CardTitle className="text-brand-primary flex items-center gap-2">
                                            <Activity className="h-5 w-5" />
                                            Performance Snapshot
                                        </CardTitle>
                                        <CardDescription>
                                            Ringkasan kinerja Anda bulan ini
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center p-4 rounded-lg bg-muted/30">
                                                <div className="text-2xl font-bold text-brand-primary">{stats?.total_leads || 0}</div>
                                                <div className="text-sm text-muted-foreground">Total Leads</div>
                                                <div className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                                                    <ArrowUp className="h-3 w-3" />
                                                    +8%
                                                </div>
                                            </div>
                                            
                                            <div className="text-center p-4 rounded-lg bg-muted/30">
                                                <div className="text-2xl font-bold text-green-600">{stats?.customers || 0}</div>
                                                <div className="text-sm text-muted-foreground">Customers</div>
                                                <div className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                                                    <ArrowUp className="h-3 w-3" />
                                                    +12%
                                                </div>
                                            </div>
                                            
                                            <div className="text-center p-4 rounded-lg bg-muted/30">
                                                <div className="text-2xl font-bold text-orange-600">
                                                    {stats?.total_leads > 0 ? Math.round((stats.customers / stats.total_leads) * 100) : 0}%
                                                </div>
                                                <div className="text-sm text-muted-foreground">Conversion Rate</div>
                                                <div className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                                                    <ArrowUp className="h-3 w-3" />
                                                    +3%
                                                </div>
                                            </div>
                                            
                                            <div className="text-center p-4 rounded-lg bg-muted/30">
                                                <div className="text-2xl font-bold text-purple-600">{stats?.todays_followups || 0}</div>
                                                <div className="text-sm text-muted-foreground">Follow-ups Hari Ini</div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {stats?.overdue_followups || 0} terlambat
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
