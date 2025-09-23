import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, Eye, Edit, Phone, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Leads', href: '/leads' },
];

interface Lead {
    id: number;
    nama_pelanggan: string;
    no_whatsapp: string;
    nama_masjid_instansi: string;
    status: string;
    prioritas: string;
    potensi_nilai: number;
    tanggal_leads: string;
    user: {
        name: string;
    };
    cabang: {
        nama_cabang: string;
    };
    sumber_leads: {
        nama: string;
    };
}

interface PageProps {
    auth: {
        user: {
            role: string;
        };
    };
    leads: {
        data: Lead[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        per_page: number;
    };
    filters: {
        status?: string;
        cabang_id?: string;
        search?: string;
    };
    statuses: Record<string, string>;
    cabangs: Array<{
        id: number;
        nama_cabang: string;
    }>;
}

export default function LeadsIndex() {
    const { auth, leads, filters, statuses, cabangs } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [cabangId, setCabangId] = useState(filters.cabang_id || 'all');

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

    const priorityColors = {
        fasttrack: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700',
        normal: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
        rendah: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
    };

    const handleFilter = () => {
        router.get('/leads', {
            search: search || undefined,
            status: status && status !== 'all' ? status : undefined,
            cabang_id: cabangId && cabangId !== 'all' ? cabangId : undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        setCabangId('all');
        router.get('/leads');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatPhoneNumber = (phone: string) => {
        if (phone.startsWith('62')) {
            return '+' + phone;
        }
        return phone;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Leads - Leads Aladdin" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-brand-primary">Kelola Leads</h1>
                        <p className="text-muted-foreground text-lg">
                            {leads?.total || 0} leads ditemukan
                        </p>
                    </div>
                    {auth.user.role === 'marketing' && (
                        <Link href="/leads/create">
                            <Button className="bg-brand-primary hover:bg-brand-primary-dark transition-colors touch-target">
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Lead
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <Card className="border-border/50 shadow-soft">
                    <CardHeader>
                        <CardTitle className="text-brand-primary">Filter & Pencarian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama, telepon, atau instansi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 touch-target"
                                    onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>
                            
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="touch-target">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    {Object.entries(statuses).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{key}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {auth.user.role === 'super_user' && (
                                <Select value={cabangId} onValueChange={setCabangId}>
                                    <SelectTrigger className="touch-target">
                                        <SelectValue placeholder="Semua Cabang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Cabang</SelectItem>
                                        {cabangs.map((cabang) => (
                                            <SelectItem key={cabang.id} value={cabang.id.toString()}>
                                                {cabang.nama_cabang}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            <div className="flex gap-2">
                                <Button onClick={handleFilter} className="flex-1 bg-brand-primary hover:bg-brand-primary-dark touch-target">
                                    <Search className="h-4 w-4 mr-2" />
                                    Cari
                                </Button>
                                <Button variant="outline" onClick={handleReset} className="touch-target">
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Leads List - Mobile Optimized */}
                <div className="space-y-4">
                    {leads?.data?.map((lead) => (
                        <Card key={lead.id} className="border-border/50 shadow-soft hover:shadow-soft-md transition-all duration-200 hover:border-brand-primary/20">
                            <CardContent className="p-4 sm:p-6">
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <h3 className="font-semibold text-lg text-brand-primary">
                                                {lead.nama_pelanggan}
                                            </h3>
                                            {lead.nama_masjid_instansi && (
                                                <p className="text-sm text-muted-foreground">
                                                    {lead.nama_masjid_instansi}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Badge className={statusColors[lead.status as keyof typeof statusColors]} variant="outline">
                                                {lead.status}
                                            </Badge>
                                            <Badge className={priorityColors[lead.prioritas as keyof typeof priorityColors]} variant="outline">
                                                {lead.prioritas}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <a 
                                                href={`tel:${lead.no_whatsapp}`}
                                                className="text-brand-primary hover:text-brand-primary-dark transition-colors font-medium"
                                            >
                                                {formatPhoneNumber(lead.no_whatsapp)}
                                            </a>
                                        </div>
                                        <div className="text-muted-foreground">
                                            <span className="font-medium text-foreground">Cabang:</span> {lead.cabang.nama_cabang}
                                        </div>
                                        <div className="text-muted-foreground">
                                            <span className="font-medium text-foreground">Sumber:</span> {lead.sumber_leads.nama}
                                        </div>
                                        <div className="text-muted-foreground">
                                            <span className="font-medium text-foreground">PIC:</span> {lead.user.name}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                        <div className="text-sm space-y-1">
                                            <div className="text-muted-foreground">
                                                {new Date(lead.tanggal_leads).toLocaleDateString('id-ID', {
                                                    weekday: 'short',
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                            {lead.potensi_nilai && (
                                                <div className="font-semibold text-brand-primary">
                                                    {formatCurrency(lead.potensi_nilai)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/leads/${lead.id}`}>
                                                <Button size="sm" variant="outline" className="touch-target">
                                                    <Eye className="h-4 w-4" />
                                                    <span className="sr-only">Lihat Detail</span>
                                                </Button>
                                            </Link>
                                            {(auth.user.role === 'super_user' || auth.user.role === 'marketing') && (
                                                <Link href={`/leads/${lead.id}/edit`}>
                                                    <Button size="sm" variant="outline" className="touch-target">
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {(!leads?.data || leads.data.length === 0) && (
                        <Card className="border-border/50 shadow-soft">
                            <CardContent className="text-center py-16">
                                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">Tidak ada leads ditemukan</h3>
                                <p className="text-muted-foreground mb-6">
                                    {search || status !== 'all' || cabangId !== 'all' 
                                        ? 'Coba ubah filter pencarian atau hapus semua filter'
                                        : 'Mulai dengan menambahkan lead pertama Anda'
                                    }
                                </p>
                                {auth.user.role === 'marketing' && (
                                    <Link href="/leads/create">
                                        <Button className="bg-brand-primary hover:bg-brand-primary-dark touch-target">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Tambah Lead Pertama
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Pagination */}
                {leads?.last_page > 1 && (
                    <Card className="border-border/50 shadow-soft">
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {leads.from} - {leads.to} dari {leads.total} leads
                                </div>
                                <div className="flex justify-center">
                                    <div className="flex gap-1">
                                        {leads?.links?.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`touch-target ${link.active ? 'bg-brand-primary hover:bg-brand-primary-dark' : ''}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}