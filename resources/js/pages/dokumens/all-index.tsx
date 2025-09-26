import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Download, Eye, Trash2, FileText, User, Building, Calendar, Phone, Plus } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Dokumen', href: '#' },
];

interface Lead {
    id: number;
    nama_pelanggan: string;
    sapaan: string;
    no_whatsapp: string;
    nama_masjid_instansi: string;
    status: string;
    user: {
        name: string;
    };
    cabang: {
        nama_cabang: string;
        lokasi: string;
    };
}

interface Dokumen {
    id: number;
    judul: string;
    deskripsi: string;
    kategori: string;
    file_name: string;
    file_type: string;
    file_size: number;
    created_at: string;
    user: {
        name: string;
    };
    leads: Lead;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedDokumens {
    data: Dokumen[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLinks[];
}

interface PageProps {
    dokumens: PaginatedDokumens;
    config: {
        dokumenKategori: Record<string, string>;
    };
}

export default function AllDokumensIndex() {
    const { dokumens, config } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');

    const formatFileSize = (bytes: number) => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    const formatPhoneNumber = (phone: string) => {
        if (phone.startsWith('62')) {
            return '+' + phone;
        }
        return phone;
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('word') || fileType.includes('document')) return '📝';
        if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
        if (fileType.includes('image')) return '🖼️';
        return '📎';
    };

    const kategoriColors = {
        penawaran: 'bg-blue-100 text-blue-800',
        sketsa_survey: 'bg-green-100 text-green-800',
        lainnya: 'bg-gray-100 text-gray-800',
    };

    const handleDelete = (dokumenId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
            router.delete(`/dokumens/${dokumenId}`);
        }
    };

    const filteredDokumens = dokumens.data.filter(dokumen =>
        dokumen.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dokumen.leads.nama_pelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dokumen.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.dokumenKategori[dokumen.kategori].toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Semua Dokumen - Leads Aladdin" />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-primary">Semua Dokumen</h1>
                        <p className="text-gray-600">
                            {dokumens.total} dokumen total
                        </p>
                    </div>
                    <Link href="/dokumens/create">
                        <Button className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Upload Dokumen
                        </Button>
                    </Link>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Cari dokumen, nama pelanggan, atau kategori..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Documents List */}
                <div className="space-y-4">
                    {filteredDokumens.length > 0 ? (
                        filteredDokumens.map((dokumen) => (
                            <Card key={dokumen.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">
                                            {getFileIcon(dokumen.file_type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-brand-primary truncate">
                                                        {dokumen.judul}
                                                    </h3>
                                                    {dokumen.deskripsi && (
                                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                            {dokumen.deskripsi}
                                                        </p>
                                                    )}
                                                </div>
                                                <Badge className={kategoriColors[dokumen.kategori as keyof typeof kategoriColors]}>
                                                    {config.dokumenKategori[dokumen.kategori]}
                                                </Badge>
                                            </div>

                                            {/* Lead Information */}
                                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <User className="h-4 w-4 text-gray-400" />
                                                    <span className="font-medium">
                                                        {dokumen.leads.sapaan} {dokumen.leads.nama_pelanggan}
                                                    </span>
                                                    {dokumen.leads.nama_masjid_instansi && (
                                                        <>
                                                            <span className="text-gray-400">•</span>
                                                            <span className="text-sm text-gray-600">
                                                                {dokumen.leads.nama_masjid_instansi}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4" />
                                                        <a 
                                                            href={`https://wa.me/${dokumen.leads.no_whatsapp}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-brand-primary hover:underline"
                                                        >
                                                            {formatPhoneNumber(dokumen.leads.no_whatsapp)}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Building className="h-4 w-4" />
                                                        <span>
                                                            {dokumen.leads.cabang.nama_cabang} ({dokumen.leads.cabang.lokasi})
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    <span className="truncate">{dokumen.file_name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>📏</span>
                                                    <span>{formatFileSize(dokumen.file_size)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {new Date(dokumen.created_at).toLocaleDateString('id-ID')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    <span className="truncate">{dokumen.user.name}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <Link href={`/leads/${dokumen.leads.id}/dokumens`}>
                                                    <Button size="sm" variant="outline">
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        Lihat Lead
                                                    </Button>
                                                </Link>
                                                <a href={`/dokumens/${dokumen.id}/download`} download>
                                                    <Button size="sm" variant="outline">
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Download
                                                    </Button>
                                                </a>
                                                <Link href={`/dokumens/${dokumen.id}`}>
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Detail
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline"
                                                    onClick={() => handleDelete(dokumen.id)}
                                                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="text-center py-12">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Tidak ada dokumen
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {searchTerm ? 'Tidak ada dokumen yang sesuai dengan pencarian.' : 'Belum ada dokumen yang diupload.'}
                                </p>
                                {!searchTerm && (
                                    <div className="flex gap-4 justify-center">
                                        <Link href="/dokumens/create">
                                            <Button className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Upload Dokumen
                                            </Button>
                                        </Link>
                                        <Link href="/leads">
                                            <Button variant="outline">
                                                <FileText className="h-4 w-4 mr-2" />
                                                Lihat Leads
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Pagination */}
                {dokumens.last_page > 1 && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Menampilkan {((dokumens.current_page - 1) * dokumens.per_page) + 1} sampai {Math.min(dokumens.current_page * dokumens.per_page, dokumens.total)} dari {dokumens.total} dokumen
                                </div>
                                <div className="flex gap-2">
                                    {dokumens.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(link.url)}
                                            disabled={!link.url}
                                            className={link.active ? "bg-[#2B5235] hover:bg-[#2B5235]/90" : ""}
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Stats */}
                {dokumens.total > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistik Dokumen</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-brand-primary">
                                        {dokumens.total}
                                    </div>
                                    <div className="text-sm text-gray-500">Total Dokumen</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {dokumens.data.filter(d => d.kategori === 'penawaran').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Penawaran</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {dokumens.data.filter(d => d.kategori === 'sketsa_survey').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Sketsa Survey</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-600">
                                        {dokumens.data.filter(d => d.kategori === 'lainnya').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Lainnya</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}