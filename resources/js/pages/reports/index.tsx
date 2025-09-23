import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/date-range-picker';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { BarChart3, Download, Filter, TrendingUp, Users, Target, DollarSign, Calendar, FileText, Percent } from 'lucide-react';
import { useState } from 'react';
import { type DateRange } from 'react-day-picker';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan & Analitik', href: '#' },
];

interface Summary {
    total_leads: number;
    warm_leads: number;
    hot_leads: number;
    customer_leads: number;
    exit_leads: number;
    cold_leads: number;
    cross_selling_leads: number;
    total_revenue: number;
    average_deal: number;
    conversion_rate: number;
}

interface LeadSource {
    nama_sumber: string;
    total: number;
}

interface DailyLead {
    date: string;
    total: number;
}

interface FollowUpStat {
    stage: string;
    total: number;
    avg_attempts: number;
}

interface TopPerformer {
    name: string;
    email: string;
    total_leads: number;
    converted_leads: number;
    total_revenue: number;
}

interface BranchPerformance {
    nama_cabang: string;
    total_leads: number;
    converted_leads: number;
    total_revenue: number;
}

interface Cabang {
    id: number;
    nama_cabang: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface PageProps {
    summary: Summary;
    charts: {
        lead_sources: LeadSource[];
        daily_leads: DailyLead[];
        follow_up_stats: FollowUpStat[];
    };
    performance: {
        top_performers: TopPerformer[];
        branch_performance: BranchPerformance[];
    };
    filters: {
        date_from: string;
        date_to: string;
        cabang_id?: number;
        user_id?: number;
    };
    options: {
        cabangs: Cabang[];
        users: User[];
    };
}

export default function ReportsIndex() {
    const { summary, charts, performance, filters, options } = usePage<PageProps>().props;
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);
    
    // State for date range picker
    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        if (filters.date_from || filters.date_to) {
            return {
                from: filters.date_from ? new Date(filters.date_from) : undefined,
                to: filters.date_to ? new Date(filters.date_to) : undefined,
            };
        }
        return undefined;
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(amount) || 0);
    };

    const handleFilterSubmit = () => {
        const params = new URLSearchParams();
        if (dateRange?.from) params.set('date_from', dateRange.from.toISOString().split('T')[0]);
        if (dateRange?.to) params.set('date_to', dateRange.to.toISOString().split('T')[0]);
        if (localFilters.cabang_id && localFilters.cabang_id !== 'all') params.set('cabang_id', localFilters.cabang_id.toString());
        if (localFilters.user_id && localFilters.user_id !== 'all') params.set('user_id', localFilters.user_id.toString());
        
        router.get('/reports?' + params.toString());
    };

    const handleExport = (format: 'excel' | 'pdf') => {
        const params = new URLSearchParams();
        params.set('format', format);
        if (dateRange?.from) params.set('date_from', dateRange.from.toISOString().split('T')[0]);
        if (dateRange?.to) params.set('date_to', dateRange.to.toISOString().split('T')[0]);
        if (localFilters.cabang_id && localFilters.cabang_id !== 'all') params.set('cabang_id', localFilters.cabang_id.toString());
        if (localFilters.user_id && localFilters.user_id !== 'all') params.set('user_id', localFilters.user_id.toString());
        
        window.open('/reports/export?' + params.toString(), '_blank');
    };

    const getStageDisplayName = (stage: string) => {
        const stageNames = {
            '1_kontak_awal': 'Kontak Awal',
            '2_presentasi': 'Presentasi',
            '3_survey': 'Survey',
            '4_penawaran': 'Penawaran',
            '5_negosiasi': 'Negosiasi',
            '6_demo': 'Demo',
            '7_proposal': 'Proposal',
            '8_kontrak': 'Kontrak',
            '9_pembayaran': 'Pembayaran',
            '10_closing': 'Closing',
        };
        return stageNames[stage as keyof typeof stageNames] || stage;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan & Analitik - Leads Aladdin" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#2B5235]">Laporan & Analitik</h1>
                        <p className="text-gray-600">
                            Analisis performa dan insights dari data leads
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleExport('excel')}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Excel
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleExport('pdf')}
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            PDF
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Filter Laporan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label>Rentang Tanggal</Label>
                                    <DateRangePicker
                                        dateRange={dateRange}
                                        onDateRangeChange={setDateRange}
                                        placeholder="Pilih periode laporan"
                                    />
                                </div>
                                <div>
                                    <Label>Cabang</Label>
                                    <Select 
                                        value={localFilters.cabang_id?.toString() || ''} 
                                        onValueChange={(value) => setLocalFilters({...localFilters, cabang_id: value ? parseInt(value) : undefined})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua cabang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua cabang</SelectItem>
                                            {options.cabangs.map((cabang) => (
                                                <SelectItem key={cabang.id} value={cabang.id.toString()}>
                                                    {cabang.nama_cabang}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Marketing</Label>
                                    <Select 
                                        value={localFilters.user_id?.toString() || ''} 
                                        onValueChange={(value) => setLocalFilters({...localFilters, user_id: value ? parseInt(value) : undefined})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua marketing" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua marketing</SelectItem>
                                            {options.users.map((user) => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Button onClick={handleFilterSubmit} className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                                    Terapkan Filter
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        const today = new Date();
                                        setDateRange({
                                            from: new Date(today.getFullYear(), today.getMonth(), 1), // Start of month
                                            to: today, // Today
                                        });
                                        setLocalFilters({
                                            date_from: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0],
                                            date_to: today.toISOString().split('T')[0],
                                            cabang_id: undefined,
                                            user_id: undefined,
                                        });
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Summary Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Target className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Leads</p>
                                    <p className="text-2xl font-bold text-blue-600">{summary.total_leads}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Customer</p>
                                    <p className="text-2xl font-bold text-green-600">{summary.customer_leads}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#DDBE75]/20 rounded-lg">
                                    <DollarSign className="h-5 w-5 text-[#2B5235]" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Pendapatan</p>
                                    <p className="text-lg font-bold text-[#2B5235]">
                                        {formatCurrency(summary.total_revenue)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Percent className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tingkat Konversi</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {Number(summary.conversion_rate || 0).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Calendar className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Rata-rata Deal</p>
                                    <p className="text-lg font-bold text-orange-600">
                                        {formatCurrency(summary.average_deal)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Lead Status Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Rincian Status Leads</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-600">{summary.warm_leads}</div>
                                <div className="text-sm text-yellow-800">WARM</div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">{summary.hot_leads}</div>
                                <div className="text-sm text-orange-800">HOT</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{summary.customer_leads}</div>
                                <div className="text-sm text-green-800">CUSTOMER</div>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">{summary.exit_leads}</div>
                                <div className="text-sm text-red-800">EXIT</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-600">{summary.cold_leads}</div>
                                <div className="text-sm text-gray-800">COLD</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">{summary.cross_selling_leads}</div>
                                <div className="text-sm text-purple-800">CROSS_SELLING</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Lead Sources */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sumber Leads Terbaik</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {charts.lead_sources.map((source, index) => {
                                    const percentage = summary.total_leads > 0 ? (source.total / summary.total_leads) * 100 : 0;
                                    return (
                                        <div key={source.nama} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#2B5235]/10 rounded-full flex items-center justify-center text-sm font-bold text-[#2B5235]">
                                                    {index + 1}
                                                </div>
                                                <span>{source.nama}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{source.total} leads</Badge>
                                                <span className="text-sm text-gray-500">
                                                    {Number(percentage || 0).toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Follow-up Effectiveness */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Efektivitas Follow-up</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {charts.follow_up_stats.map((stat) => (
                                    <div key={stat.stage} className="flex items-center justify-between">
                                        <span className="text-sm">{getStageDisplayName(stat.stage)}</span>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline">{stat.total} FU</Badge>
                                            <span className="text-sm text-gray-500">
                                                ~{Number(stat.avg_attempts || 0).toFixed(1)} percobaan
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Performers */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Marketing Terbaik
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {performance.top_performers.map((performer, index) => (
                                    <div key={performer.email} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#2B5235]/10 rounded-full flex items-center justify-center text-sm font-bold text-[#2B5235]">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">{performer.name}</p>
                                                <p className="text-sm text-gray-500">{performer.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex gap-2 mb-1">
                                                <Badge variant="outline">{performer.total_leads} leads</Badge>
                                                <Badge className="bg-green-100 text-green-800">
                                                    {performer.converted_leads} konversi
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium text-[#2B5235]">
                                                {formatCurrency(performer.total_revenue)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Branch Performance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Performa Cabang
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {performance.branch_performance.map((branch, index) => (
                                    <div key={branch.nama_cabang} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#2B5235]/10 rounded-full flex items-center justify-center text-sm font-bold text-[#2B5235]">
                                                {index + 1}
                                            </div>
                                            <span className="font-medium">{branch.nama_cabang}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex gap-2 mb-1">
                                                <Badge variant="outline">{branch.total_leads} leads</Badge>
                                                <Badge className="bg-green-100 text-green-800">
                                                    {branch.converted_leads} konversi
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium text-[#2B5235]">
                                                {formatCurrency(branch.total_revenue)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Period Info */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center text-sm text-gray-500">
                            <p>Laporan periode: {new Date(filters.date_from).toLocaleDateString('id-ID')} - {new Date(filters.date_to).toLocaleDateString('id-ID')}</p>
                            <p className="mt-1">Data diperbarui secara real-time berdasarkan aktivitas terbaru</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}