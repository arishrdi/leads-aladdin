import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Edit, Calendar, User, Hash, ArrowRight, BarChart3 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kelola Tahap Follow-up', href: '/follow-up-stages' },
    { title: 'Detail Tahap', href: '#' },
];

interface FollowUpStage {
    id: number;
    key: string;
    name: string;
    display_order: number;
    next_stage_key: string | null;
    is_active: boolean;
    followup_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    stage: FollowUpStage;
}

export default function ShowFollowUpStage() {
    const { stage } = usePage<Props>().props;

    const getStatusBadge = () => {
        if (!stage.is_active) {
            return <Badge variant="secondary">Tidak Aktif</Badge>;
        }
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Tahap: ${stage.name}`} />

            <div className="space-y-6">
                <div className="flex gap-4 lg:gap-0 lg:items-center justify-start lg:justify-between lg:flex-row flex-col">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/follow-up-stages">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-brand-primary">Detail Tahap Follow-up</h1>
                            <p className="text-gray-600">Informasi lengkap tahap: {stage.name}</p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/follow-up-stages/${stage.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Tahap
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Informasi Tahap</span>
                                    {getStatusBadge()}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Nama Tahap</p>
                                        <p className="text-lg font-semibold">{stage.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Key Tahap</p>
                                        <code className="inline-block text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                                            {stage.key}
                                        </code>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Urutan Tahap</p>
                                        <div className="flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-gray-400" />
                                            <Badge variant="outline" className="font-mono">
                                                {stage.display_order}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Tahap Selanjutnya</p>
                                        {stage.next_stage_key ? (
                                            <div className="flex items-center gap-2">
                                                <ArrowRight className="h-4 w-4 text-gray-400" />
                                                <code className="text-sm bg-blue-100 px-2 py-1 rounded font-mono">
                                                    {stage.next_stage_key}
                                                </code>
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 italic">Tidak ada tahap selanjutnya</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Riwayat
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Dibuat pada</p>
                                    <p className="text-sm">{formatDate(stage.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Terakhir diperbarui</p>
                                    <p className="text-sm">{formatDate(stage.updated_at)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Statistics */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Statistik
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-blue-600">{stage.followup_count}</p>
                                    <p className="text-sm text-gray-600">Total Follow-up</p>
                                </div>
                                
                                {stage.followup_count > 0 && (
                                    <div className="pt-4 border-t">
                                        <p className="text-sm text-gray-500 mb-2">Status Penggunaan:</p>
                                        <Badge variant="outline" className="bg-green-50 text-green-700">
                                            Sedang Digunakan
                                        </Badge>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Tahap ini tidak dapat dihapus karena sudah memiliki follow-up.
                                        </p>
                                    </div>
                                )}

                                {stage.followup_count === 0 && (
                                    <div className="pt-4 border-t">
                                        <p className="text-sm text-gray-500 mb-2">Status Penggunaan:</p>
                                        <Badge variant="secondary">
                                            Belum Digunakan
                                        </Badge>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Tahap ini dapat dihapus karena belum memiliki follow-up.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Tambahan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-sm">
                                    <p className="font-medium text-gray-700">ID Database:</p>
                                    <p className="text-gray-600 font-mono">#{stage.id}</p>
                                </div>
                                
                                <div className="text-sm">
                                    <p className="font-medium text-gray-700">Tipe:</p>
                                    <p className="text-gray-600">Tahap Follow-up</p>
                                </div>
                                
                                <div className="text-sm">
                                    <p className="font-medium text-gray-700">Dapat Dihapus:</p>
                                    <p className="text-gray-600">
                                        {stage.followup_count === 0 ? 'Ya' : 'Tidak'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}