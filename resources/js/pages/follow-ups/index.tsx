import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/date-range-picker';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Clock, TrendingUp, AlertCircle, CheckCircle, XCircle, Phone, User, Filter, RotateCcw, Circle, FileSpreadsheet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type DateRange } from 'react-day-picker';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Follow-ups', href: '/follow-ups' },
];

interface FollowUp {
    id: number;
    stage: string;
    attempt: number;
    attempt_count: number;
    attempt_1_completed: boolean;
    attempt_2_completed: boolean;
    attempt_3_completed: boolean;
    attempt_1_completed_at?: string;
    attempt_2_completed_at?: string;
    attempt_3_completed_at?: string;
    scheduled_at: string;
    completed_at?: string;
    status: string;
    catatan?: string;
    hasil_followup?: string;
    ada_respon?: boolean;
    completed_attempts_count: number;
    next_attempt_number: number;
    auto_scheduled?: boolean;
    leads: {
        id: number;
        nama_pelanggan: string;
        no_whatsapp: string;
        status: string;
        nama_masjid_instansi: string;
    };
}

interface Statistics {
    total: number;
    completed: number;
    no_response: number;
    scheduled: number;
    response_rate: number;
}

interface PageProps {
    todaysFollowUps: FollowUp[];
    overdueFollowUps: FollowUp[];
    successfulFollowUps: FollowUp[];
    allFollowUps: FollowUp[];
    statistics: Statistics;
    filters: {
        start_date?: string;
        end_date?: string;
    };
    config: {
        followUpStages: Record<string, string>;
    };
}

export default function FollowUpsIndex() {
    const { todaysFollowUps, overdueFollowUps, successfulFollowUps, allFollowUps, statistics, filters, config } = usePage<PageProps>().props;
    
    // State for date range picker
    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        if (filters.start_date || filters.end_date) {
            return {
                from: filters.start_date ? new Date(filters.start_date) : undefined,
                to: filters.end_date ? new Date(filters.end_date) : undefined,
            };
        }
        return undefined;
    });

    const statusColors = {
        WARM: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
        HOT: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700',
        CUSTOMER: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
        EXIT: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700',
        COLD: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700',
        CROSS_SELLING: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700',
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    };

    const formatPhoneNumber = (phone: string) => {
        if (phone.startsWith('62')) {
            return '+' + phone;
        }
        return phone;
    };

    // Auto-apply filter when date range changes (with debounce)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams();
            if (dateRange?.from) {
                params.set('start_date', dateRange.from.toISOString().split('T')[0]);
            }
            if (dateRange?.to) {
                params.set('end_date', dateRange.to.toISOString().split('T')[0]);
            }
            
            router.get('/follow-ups', Object.fromEntries(params), {
                preserveState: true,
                replace: true,
            });
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [dateRange]);

    const handleDateFilter = () => {
        const params = new URLSearchParams();
        if (dateRange?.from) {
            params.set('start_date', dateRange.from.toISOString().split('T')[0]);
        }
        if (dateRange?.to) {
            params.set('end_date', dateRange.to.toISOString().split('T')[0]);
        }
        
        router.get('/follow-ups', Object.fromEntries(params), {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setDateRange(undefined);
        router.get('/follow-ups', {}, {
            preserveState: true,
            replace: true,
        });
    };

    const hasDateFilter = filters.start_date || filters.end_date;

    // Component for rendering follow-up items
    const FollowUpItem = ({ followUp, showFullDate = false, buttonText = "Mulai Follow-up", buttonColor = "bg-brand-primary hover:bg-brand-primary-dark", showCompletedTime = false }: { 
        followUp: FollowUp; 
        showFullDate?: boolean; 
        buttonText?: string;
        buttonColor?: string;
        showCompletedTime?: boolean;
    }) => (
        <div className="p-4 rounded-lg bg-card border border-border/50 shadow-soft hover:shadow-soft-md transition-all duration-200">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-lg text-brand-primary">
                            {followUp.leads.nama_pelanggan}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <Badge className={statusColors[followUp.leads.status as keyof typeof statusColors]} variant="outline">
                                {followUp.leads.status}
                            </Badge>
                            {showFullDate && followUp.status && (
                                <Badge variant={followUp.status === 'completed' ? 'default' : 'secondary'}>
                                    {followUp.status === 'completed' ? 'Selesai' : 'Dijadwalkan'}
                                </Badge>
                            )}
                            {followUp.auto_scheduled && (
                                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                                    Jadwal Otomatis
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
                {/* Details */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="p-1 rounded bg-brand-primary/10">
                            <Clock className="h-4 w-4 text-brand-primary" />
                        </div>
                        <span className="font-medium text-brand-primary">
                            {config.followUpStages[followUp.stage] || followUp.stage} - Percobaan #{followUp.attempt}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                        <div className="p-1 rounded bg-muted/50">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className={`font-medium ${buttonColor.includes('red') ? 'text-destructive' : 'text-brand-primary'}`}>
                            {showCompletedTime && followUp.completed_at 
                                ? `Selesai: ${formatTime(followUp.completed_at)}`
                                : showFullDate 
                                ? `${formatDate(followUp.scheduled_at)} ${formatTime(followUp.scheduled_at)}` 
                                : formatTime(followUp.scheduled_at)
                            }
                        </span>
                    </div>

                    {/* Progress tracking */}
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground font-medium">Progress:</span>
                        <div className="flex items-center gap-1">
                            {followUp.attempt_1_completed ? (
                                <CheckCircle className="w-5 h-5 text-success" title={`Attempt 1: ${followUp.attempt_1_completed_at ? new Date(followUp.attempt_1_completed_at).toLocaleDateString('id-ID') : 'Completed'}`} />
                            ) : (
                                <Circle className="w-5 h-5 text-muted-foreground/50" title="Attempt 1: Not completed" />
                            )}
                            {followUp.attempt_2_completed ? (
                                <CheckCircle className="w-5 h-5 text-success" title={`Attempt 2: ${followUp.attempt_2_completed_at ? new Date(followUp.attempt_2_completed_at).toLocaleDateString('id-ID') : 'Completed'}`} />
                            ) : (
                                <Circle className="w-5 h-5 text-muted-foreground/50" title="Attempt 2: Not completed" />
                            )}
                            {followUp.attempt_3_completed ? (
                                <CheckCircle className="w-5 h-5 text-success" title={`Attempt 3: ${followUp.attempt_3_completed_at ? new Date(followUp.attempt_3_completed_at).toLocaleDateString('id-ID') : 'Completed'}`} />
                            ) : (
                                <Circle className="w-5 h-5 text-muted-foreground/50" title="Attempt 3: Not completed" />
                            )}
                            <span className="text-xs text-muted-foreground ml-2 font-medium">
                                ({followUp.completed_attempts_count}/3)
                            </span>
                        </div>
                    </div>

                    {/* Contact info */}
                    <div className="flex items-center gap-2 text-sm">
                        <div className="p-1 rounded bg-green-50 dark:bg-green-950">
                            <Phone className="h-4 w-4 text-success" />
                        </div>
                        <a 
                            href={`tel:${followUp.leads.no_whatsapp}`}
                            className="text-brand-primary hover:text-brand-primary-dark transition-colors font-medium"
                        >
                            {formatPhoneNumber(followUp.leads.no_whatsapp)}
                        </a>
                    </div>

                    {followUp.leads.nama_masjid_instansi && (
                        <div className="flex items-center gap-2 text-sm">
                            <div className="p-1 rounded bg-muted/50">
                                <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="text-muted-foreground">{followUp.leads.nama_masjid_instansi}</span>
                        </div>
                    )}

                    {showFullDate && followUp.hasil_followup && (
                        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Hasil Follow-up:</p>
                            <p className="text-sm text-foreground">{followUp.hasil_followup}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
                    <a 
                        href={`https://wa.me/${followUp.leads.no_whatsapp}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1"
                    >
                        <Button variant="outline" className="w-full touch-target">
                            <Phone className="h-4 w-4 mr-2" />
                            WhatsApp
                        </Button>
                    </a>
                    <Link href={`/follow-ups/${followUp.id}`} className="flex-1">
                        <Button className={`w-full touch-target ${buttonColor} transition-colors`}>
                            {buttonText}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Follow-ups - Leads Aladdin" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-brand-primary">Follow-up Management</h1>
                        <p className="text-muted-foreground text-lg">Kelola jadwal follow-up dan pantau progres leads Anda</p>
                    </div>
                    <Link href="/follow-ups/excel-view">
                        <Button className="bg-brand-primary hover:bg-brand-primary-dark transition-colors touch-target">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Excel View
                        </Button>
                    </Link>
                </div>

                {/* Date Filter */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filter Tanggal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <Label>Rentang Tanggal</Label>
                                <DateRangePicker
                                    dateRange={dateRange}
                                    onDateRangeChange={setDateRange}
                                    placeholder="Pilih rentang tanggal follow-up"
                                />
                            </div>
                            {hasDateFilter && (
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={clearFilters}>
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset Filter
                                    </Button>
                                </div>
                            )}
                        </div>
                        {hasDateFilter && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Filter aktif:</strong> {filters.start_date && `Dari ${new Date(filters.start_date).toLocaleDateString('id-ID')}`} 
                                    {filters.start_date && filters.end_date && ' - '}
                                    {filters.end_date && `Sampai ${new Date(filters.end_date).toLocaleDateString('id-ID')}`}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Statistics Cards */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-border/50 shadow-soft hover:shadow-soft-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Follow-up</CardTitle>
                            <div className="p-2 rounded-lg bg-muted/50">
                                <Calendar className="h-5 w-5 text-brand-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-brand-primary">{statistics.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">Periode ini</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-soft hover:shadow-soft-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Selesai</CardTitle>
                            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                                <CheckCircle className="h-5 w-5 text-success" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-success">{statistics.completed}</div>
                            <p className="text-xs text-muted-foreground mt-1">Follow-up berhasil</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-soft hover:shadow-soft-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Tidak Respon</CardTitle>
                            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950">
                                <XCircle className="h-5 w-5 text-destructive" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-destructive">{statistics.no_response}</div>
                            <p className="text-xs text-muted-foreground mt-1">Perlu tindak lanjut</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-soft hover:shadow-soft-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                                <TrendingUp className="h-5 w-5 text-info" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-info">{statistics.response_rate}%</div>
                            <p className="text-xs text-muted-foreground mt-1">Tingkat respons</p>
                        </CardContent>
                    </Card>
                </div> */}

                {/* Follow-ups Tabs - Default View */}
                {!hasDateFilter && (
                    <Tabs defaultValue={overdueFollowUps.length > 0 ? "overdue" : "today"} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overdue" className="relative">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Terlambat
                                {overdueFollowUps.length > 0 && (
                                    <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                                        {overdueFollowUps.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="today">
                                <Calendar className="h-4 w-4 mr-2" />
                                Hari Ini
                                {todaysFollowUps.length > 0 && (
                                    <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                                        {todaysFollowUps.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="successful">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Berhasil
                                {successfulFollowUps.length > 0 && (
                                    <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-[#2B5235]">
                                        {successfulFollowUps.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="overdue" className="mt-4">
                            <Card className={overdueFollowUps.length > 0 ? "border-red-200 bg-red-50" : ""}>
                                <CardHeader>
                                    <CardTitle className={`flex items-center gap-2 ${overdueFollowUps.length > 0 ? 'text-red-800' : ''}`}>
                                        <AlertCircle className="h-5 w-5" />
                                        Follow-up Terlambat ({overdueFollowUps.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {overdueFollowUps.length > 0 ? (
                                        <div className="space-y-4">
                                            {overdueFollowUps.map((followUp, index) => (
                                                <div key={followUp.id}>
                                                    <FollowUpItem 
                                                        followUp={followUp} 
                                                        showFullDate={true}
                                                        buttonText="Tindak Lanjut"
                                                        buttonColor="bg-red-600 hover:bg-red-700"
                                                    />
                                                    {index < overdueFollowUps.length - 1 && <Separator className="mt-4" />}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                                            <p className="text-green-600 mb-2 font-medium">Tidak ada follow-up yang terlambat</p>
                                            <p className="text-sm text-gray-500">Semua follow-up sudah terjadwal dengan baik!</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        
                        <TabsContent value="today" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Follow-up Hari Ini ({todaysFollowUps.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {todaysFollowUps.length > 0 ? (
                                        <div className="space-y-4">
                                            {todaysFollowUps.map((followUp, index) => (
                                                <div key={followUp.id}>
                                                    <FollowUpItem followUp={followUp} />
                                                    {index < todaysFollowUps.length - 1 && <Separator className="mt-4" />}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500 mb-2">Tidak ada follow-up dijadwalkan hari ini</p>
                                            <p className="text-sm text-gray-400">Nikmati hari yang santai atau buat follow-up baru!</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        
                        <TabsContent value="successful" className="mt-4">
                            <Card className="border-green-200 bg-green-50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-green-800">
                                        <CheckCircle className="h-5 w-5" />
                                        Follow-up Berhasil Hari Ini ({successfulFollowUps.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {successfulFollowUps.length > 0 ? (
                                        <div className="space-y-4">
                                            {successfulFollowUps.map((followUp, index) => (
                                                <div key={followUp.id}>
                                                    <FollowUpItem 
                                                        followUp={followUp} 
                                                        showCompletedTime={true}
                                                        buttonText="Lihat Detail"
                                                        buttonColor="bg-[#2B5235] hover:bg-[#1e3d26]"
                                                    />
                                                    {index < successfulFollowUps.length - 1 && <Separator className="mt-4" />}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500 mb-2">Belum ada follow-up yang berhasil hari ini</p>
                                            <p className="text-sm text-gray-400">Mulai follow-up untuk mendapatkan respons dari leads!</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                )}

                {/* Filtered Follow-ups */}
                {hasDateFilter && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Follow-up Berdasarkan Filter ({allFollowUps.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {allFollowUps.length > 0 ? (
                                <div className="space-y-4">
                                    {allFollowUps.map((followUp, index) => (
                                        <div key={followUp.id}>
                                            <FollowUpItem 
                                                followUp={followUp} 
                                                showFullDate={true}
                                                buttonText="Detail"
                                            />
                                            {index < allFollowUps.length - 1 && <Separator className="mt-4" />}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-2">Tidak ada follow-up ditemukan untuk periode ini</p>
                                    <p className="text-sm text-gray-400">Coba ubah rentang tanggal atau hapus filter</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Aksi Cepat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/leads">
                                <Button variant="outline" className="w-full justify-start">
                                    <User className="h-4 w-4 mr-2" />
                                    Lihat Semua Leads
                                </Button>
                            </Link>
                            <Link href="/leads/create">
                                <Button variant="outline" className="w-full justify-start">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Tambah Lead Baru
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tips Follow-up</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• Hubungi leads pada waktu yang tepat (pagi atau sore)</p>
                                <p>• Siapkan pertanyaan yang relevan sebelum menelepon</p>
                                <p>• Catat setiap respon untuk follow-up selanjutnya</p>
                                <p>• Jangan menyerah setelah 1-2 percobaan</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}