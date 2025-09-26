import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Download, Eye, Trash2, FileText, User, Building, Calendar } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Leads', href: '/leads' },
    { title: 'Dokumen', href: '#' },
    { title: 'Detail Dokumen', href: '#' },
];

interface Dokumen {
    id: number;
    judul: string;
    deskripsi: string;
    kategori: string;
    file_name: string;
    file_type: string;
    file_size: number;
    file_path: string;
    created_at: string;
    leads: {
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
    };
    user: {
        name: string;
    };
}

interface PageProps {
    dokumen: Dokumen;
}

export default function ShowDokumen() {
    const { dokumen } = usePage<PageProps>().props;

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

    const kategoriNames = {
        penawaran: 'Penawaran',
        sketsa_survey: 'Sketsa Survey',
        lainnya: 'Lainnya',
    };

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
            router.delete(`/dokumens/${dokumen.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${dokumen.judul} - Detail Dokumen - Leads Aladdin`} />
            
            <div className=" space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-brand-primary">Detail Dokumen</h1>
                            <p className="text-gray-600">{dokumen.judul}</p>
                        </div>
                    </div>
                    <Badge className={kategoriColors[dokumen.kategori as keyof typeof kategoriColors]}>
                        {kategoriNames[dokumen.kategori as keyof typeof kategoriNames]}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Document Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Informasi Dokumen
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="text-4xl">
                                    {getFileIcon(dokumen.file_type)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{dokumen.judul}</h3>
                                    <p className="text-sm text-gray-500">{dokumen.file_name}</p>
                                </div>
                            </div>

                            {dokumen.deskripsi && (
                                <div>
                                    <span className="font-medium text-gray-700">Deskripsi:</span>
                                    <p className="text-gray-600 mt-1">{dokumen.deskripsi}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Ukuran File:</span>
                                    <p className="text-gray-600">{formatFileSize(dokumen.file_size)}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Tipe File:</span>
                                    <p className="text-gray-600">{dokumen.file_type}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Diupload:</span>
                                    <p className="text-gray-600">
                                        {new Date(dokumen.created_at).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Diupload oleh:</span>
                                    <p className="text-gray-600">{dokumen.user.name}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a href={`/dokumens/${dokumen.id}/download`} download className="flex-1">
                                        <Button className="w-full bg-[#2B5235] hover:bg-[#2B5235]/90">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download File
                                        </Button>
                                    </a>
                                    <Button 
                                        variant="destructive" 
                                        onClick={handleDelete}
                                        className="flex-1"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Hapus Dokumen
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

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
                                    {dokumen.leads.sapaan} {dokumen.leads.nama_pelanggan}
                                </span>
                            </div>

                            {dokumen.leads.nama_masjid_instansi && (
                                <div className="flex items-center gap-3">
                                    <Building className="h-4 w-4 text-gray-400" />
                                    <span>{dokumen.leads.nama_masjid_instansi}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <span className="text-gray-400">📱</span>
                                <div className="flex gap-2">
                                    <a 
                                        href={`tel:${dokumen.leads.no_whatsapp}`}
                                        className="text-brand-primary hover:underline font-medium"
                                    >
                                        {formatPhoneNumber(dokumen.leads.no_whatsapp)}
                                    </a>
                                    <span className="text-gray-400">|</span>
                                    <a 
                                        href={`https://wa.me/${dokumen.leads.no_whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-brand-primary hover:underline"
                                    >
                                        WhatsApp
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Building className="h-4 w-4 text-gray-400" />
                                <span>
                                    {dokumen.leads.cabang.nama_cabang} ({dokumen.leads.cabang.lokasi})
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-gray-400" />
                                <span>PIC: {dokumen.leads.user.name}</span>
                            </div>

                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Status Lead:</strong> {dokumen.leads.status}
                                </p>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex flex-col gap-3">
                                    <Link href={`/leads/${dokumen.leads.id}`}>
                                        <Button variant="outline" className="w-full">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Lihat Detail Lead
                                        </Button>
                                    </Link>
                                    <Link href={`/leads/${dokumen.leads.id}/dokumens`}>
                                        <Button variant="outline" className="w-full">
                                            <FileText className="h-4 w-4 mr-2" />
                                            Lihat Semua Dokumen
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}