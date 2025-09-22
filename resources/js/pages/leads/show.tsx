import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import FollowUpTracker from '@/components/follow-up-tracker';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Edit, Phone, Mail, Calendar, User, Building, Target, FileText, Clock, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Leads', href: '/leads' },
    { title: 'Detail Lead', href: '#' },
];

interface Lead {
    id: number;
    tanggal_leads: string;
    sapaan: string;
    nama_pelanggan: string;
    no_whatsapp: string;
    nama_masjid_instansi: string;
    catatan: string;
    alasan_closing: string;
    alasan_tidak_closing: string;
    prioritas: string;
    kebutuhan_karpet: string;
    potensi_nilai: number;
    status: string;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
    cabang: {
        id: number;
        nama_cabang: string;
        lokasi: string;
    };
    sumber_leads: {
        id: number;
        nama: string;
    };
    tipe_karpet: {
        id: number;
        nama: string;
    } | null;
    follow_ups: Array<{
        id: number;
        stage: string;
        attempt: number;
        scheduled_at: string;
        completed_at: string | null;
        ada_respon: boolean;
        status: string;
        catatan: string;
        user: {
            name: string;
        };
    }>;
    dokumens: Array<{
        id: number;
        judul: string;
        kategori: string;
        file_name: string;
        file_size: number;
        created_at: string;
        user: {
            name: string;
        };
    }>;
}

interface PageProps {
    auth: {
        user: {
            id: number;
            role: string;
        };
    };
    lead: Lead;
    config: {
        statuses: Record<string, string>;
        followUpStages: Record<string, string>;
    };
}

export default function ShowLead() {
    const { auth, lead, config } = usePage<PageProps>().props;

    const statusColors = {
        WARM: 'bg-blue-100 text-blue-800 border-blue-200',
        HOT: 'bg-orange-100 text-orange-800 border-orange-200',
        CUSTOMER: 'bg-green-100 text-green-800 border-green-200',
        EXIT: 'bg-red-100 text-red-800 border-red-200',
        COLD: 'bg-gray-100 text-gray-800 border-gray-200',
        CROSS_SELLING: 'bg-purple-100 text-purple-800 border-purple-200',
    };

    const priorityColors = {
        fasttrack: 'bg-red-100 text-red-800 border-red-200',
        normal: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        rendah: 'bg-green-100 text-green-800 border-green-200',
    };

    const followUpStatusColors = {
        scheduled: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        no_response: 'bg-red-100 text-red-800',
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

    const canEdit = auth.user.role === 'super_user' || 
                   (auth.user.role === 'marketing' && lead.user.id === auth.user.id);

    const canCreateFollowUp = auth.user.role === 'marketing' && lead.user.id === auth.user.id;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${lead.nama_pelanggan} - Detail Lead - Leads Aladdin`} />
            
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-[#2B5235]">
                                {lead.sapaan} {lead.nama_pelanggan}
                            </h1>
                            {lead.nama_masjid_instansi && (
                                <p className="text-gray-600">{lead.nama_masjid_instansi}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                            {lead.status}
                        </Badge>
                        <Badge className={priorityColors[lead.prioritas as keyof typeof priorityColors]}>
                            {lead.prioritas}
                        </Badge>
                        {canEdit && (
                            <Link href={`/leads/${lead.id}/edit`}>
                                <Button size="sm">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Lead Information */}
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informasi Kontak
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <a 
                                        href={`tel:${lead.no_whatsapp}`}
                                        className="text-[#2B5235] hover:underline font-medium"
                                    >
                                        {formatPhoneNumber(lead.no_whatsapp)}
                                    </a>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <a 
                                        href={`https://wa.me/${lead.no_whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#2B5235] hover:underline"
                                    >
                                        Kirim WhatsApp
                                    </a>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>
                                        Tanggal Lead: {new Date(lead.tanggal_leads).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Building className="h-4 w-4 text-gray-400" />
                                    <span>
                                        Cabang: {lead.cabang.nama_cabang} ({lead.cabang.lokasi})
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Target className="h-4 w-4 text-gray-400" />
                                    <span>Sumber: {lead.sumber_leads.nama}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span>PIC: {lead.user.name}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Lead Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Detail Lead
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {lead.kebutuhan_karpet && (
                                    <div>
                                        <span className="font-medium text-gray-700">Kebutuhan Karpet:</span>
                                        <p className="text-gray-600">{lead.kebutuhan_karpet}</p>
                                    </div>
                                )}

                                {lead.tipe_karpet && (
                                    <div>
                                        <span className="font-medium text-gray-700">Tipe Karpet:</span>
                                        <p className="text-gray-600">{lead.tipe_karpet.nama}</p>
                                    </div>
                                )}

                                {lead.potensi_nilai && (
                                    <div>
                                        <span className="font-medium text-gray-700">Potensi Nilai:</span>
                                        <p className="text-green-600 font-semibold">
                                            {formatCurrency(lead.potensi_nilai)}
                                        </p>
                                    </div>
                                )}

                                {lead.catatan && (
                                    <div>
                                        <span className="font-medium text-gray-700">Catatan:</span>
                                        <p className="text-gray-600">{lead.catatan}</p>
                                    </div>
                                )}

                                {lead.alasan_closing && (
                                    <div>
                                        <span className="font-medium text-gray-700">Alasan Closing:</span>
                                        <p className="text-green-600">{lead.alasan_closing}</p>
                                    </div>
                                )}

                                {lead.alasan_tidak_closing && (
                                    <div>
                                        <span className="font-medium text-gray-700">Alasan Tidak Closing:</span>
                                        <p className="text-red-600">{lead.alasan_tidak_closing}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Follow-ups & Documents */}
                    <div className="space-y-6">
                        {/* Excel-like Follow-up Tracker */}
                        {lead.follow_ups.length > 0 && (
                            <FollowUpTracker 
                                followUps={lead.follow_ups}
                                stages={config.followUpStages}
                                leadId={lead.id}
                            />
                        )}

                        {/* Follow-ups */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Follow-ups ({lead.follow_ups.length})
                                    </CardTitle>
                                    {canCreateFollowUp && (
                                        <Link href={`/leads/${lead.id}/follow-ups/create`}>
                                            <Button size="sm" variant="outline">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Tambah
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {lead.follow_ups.length > 0 ? (
                                    <div className="space-y-4">
                                        {lead.follow_ups.map((followUp, index) => (
                                            <div key={followUp.id}>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium">{followUp.stage}</span>
                                                            <Badge 
                                                                variant="outline" 
                                                                className={followUpStatusColors[followUp.status as keyof typeof followUpStatusColors]}
                                                            >
                                                                {followUp.status}
                                                            </Badge>
                                                            <span className="text-xs text-gray-500">
                                                                Percobaan #{followUp.attempt}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600">
                                                            Dijadwalkan: {new Date(followUp.scheduled_at).toLocaleString('id-ID')}
                                                        </p>
                                                        {followUp.completed_at && (
                                                            <p className="text-sm text-gray-600">
                                                                Diselesaikan: {new Date(followUp.completed_at).toLocaleString('id-ID')}
                                                            </p>
                                                        )}
                                                        {followUp.catatan && (
                                                            <p className="text-sm text-gray-700 mt-1">{followUp.catatan}</p>
                                                        )}
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            oleh {followUp.user.name}
                                                        </p>
                                                    </div>
                                                    {followUp.status === 'scheduled' && canCreateFollowUp && (
                                                        <Link href={`/follow-ups/${followUp.id}`}>
                                                            <Button size="sm" variant="outline">
                                                                Lihat
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                                {index < lead.follow_ups.length - 1 && (
                                                    <Separator className="mt-4" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500 mb-4">Belum ada follow-up</p>
                                        {canCreateFollowUp && (
                                            <Link href={`/leads/${lead.id}/follow-ups/create`}>
                                                <Button size="sm">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Buat Follow-up Pertama
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Documents */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Dokumen ({lead.dokumens.length})
                                    </CardTitle>
                                    {canCreateFollowUp && (
                                        <Link href={`/leads/${lead.id}/dokumens/create`}>
                                            <Button size="sm" variant="outline">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Upload
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {lead.dokumens.length > 0 ? (
                                    <div className="space-y-3">
                                        {lead.dokumens.map((dokumen) => (
                                            <div key={dokumen.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{dokumen.judul}</h4>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span>{dokumen.kategori}</span>
                                                        <span>{formatFileSize(dokumen.file_size)}</span>
                                                        <span>{new Date(dokumen.created_at).toLocaleDateString('id-ID')}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        oleh {dokumen.user.name}
                                                    </p>
                                                </div>
                                                <a href={`/dokumens/${dokumen.id}/download`} download>
                                                    <Button size="sm" variant="outline">
                                                        Download
                                                    </Button>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500 mb-4">Belum ada dokumen</p>
                                        {canCreateFollowUp && (
                                            <Link href={`/leads/${lead.id}/dokumens/create`}>
                                                <Button size="sm">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Upload Dokumen Pertama
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}