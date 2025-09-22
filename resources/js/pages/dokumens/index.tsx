import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Plus, Download, Eye, Trash2, FileText, User, Building, Calendar } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Leads', href: '/leads' },
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
}

interface PageProps {
    lead: Lead;
    dokumens: Dokumen[];
    config: {
        dokumenKategori: Record<string, string>;
    };
}

export default function DokumensIndex() {
    const { lead, dokumens, config } = usePage<PageProps>().props;

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Dokumen - ${lead.nama_pelanggan} - Leads Aladdin`} />
            
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-[#2B5235]">Dokumen Lead</h1>
                            <p className="text-gray-600">
                                {lead.sapaan} {lead.nama_pelanggan} • {dokumens.length} dokumen
                            </p>
                        </div>
                    </div>
                    <Link href={`/leads/${lead.id}/dokumens/create`}>
                        <Button className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Upload Dokumen
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Lead Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informasi Lead
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">
                                    {lead.sapaan} {lead.nama_pelanggan}
                                </span>
                            </div>

                            {lead.nama_masjid_instansi && (
                                <div className="flex items-center gap-3">
                                    <Building className="h-4 w-4 text-gray-400" />
                                    <span>{lead.nama_masjid_instansi}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <span className="text-gray-400">📱</span>
                                <div className="flex gap-2">
                                    <a 
                                        href={`tel:${lead.no_whatsapp}`}
                                        className="text-[#2B5235] hover:underline font-medium"
                                    >
                                        {formatPhoneNumber(lead.no_whatsapp)}
                                    </a>
                                    <span className="text-gray-400">|</span>
                                    <a 
                                        href={`https://wa.me/${lead.no_whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#2B5235] hover:underline"
                                    >
                                        WhatsApp
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Building className="h-4 w-4 text-gray-400" />
                                <span>
                                    {lead.cabang.nama_cabang} ({lead.cabang.lokasi})
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-gray-400" />
                                <span>PIC: {lead.user.name}</span>
                            </div>

                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Status:</strong> {lead.status}
                                </p>
                            </div>

                            <div className="pt-2 border-t">
                                <Link href={`/leads/${lead.id}`}>
                                    <Button variant="outline" className="w-full">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Lihat Detail Lead
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Documents List */}
                    <div className="lg:col-span-2 space-y-4">
                        {dokumens.length > 0 ? (
                            dokumens.map((dokumen) => (
                                <Card key={dokumen.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="text-3xl">
                                                {getFileIcon(dokumen.file_type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-[#2B5235] truncate">
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

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm text-gray-500">
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

                                                <div className="flex gap-2 mt-4">
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
                                        Belum ada dokumen
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Upload dokumen pertama untuk lead ini seperti penawaran, sketsa survey, atau dokumen lainnya.
                                    </p>
                                    <Link href={`/leads/${lead.id}/dokumens/create`}>
                                        <Button className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Upload Dokumen Pertama
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                {dokumens.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistik Dokumen</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-[#2B5235]">
                                        {dokumens.length}
                                    </div>
                                    <div className="text-sm text-gray-500">Total Dokumen</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {dokumens.filter(d => d.kategori === 'penawaran').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Penawaran</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {dokumens.filter(d => d.kategori === 'sketsa_survey').length}
                                    </div>
                                    <div className="text-sm text-gray-500">Sketsa Survey</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-600">
                                        {dokumens.filter(d => d.kategori === 'lainnya').length}
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