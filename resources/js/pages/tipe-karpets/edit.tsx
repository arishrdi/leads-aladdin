import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, Package, Info, Activity } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Master Data', href: '#' },
    { title: 'Tipe Karpet', href: '/tipe-karpets' },
    { title: 'Edit Tipe Karpet', href: '#' },
];

interface TipeKarpet {
    id: number;
    nama: string;
    deskripsi: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    leads_count?: number;
}

interface PageProps {
    tipeKarpet: TipeKarpet;
}

export default function EditTipeKarpet() {
    const { tipeKarpet } = usePage<PageProps>().props;
    
    const { data, setData, patch, processing, errors } = useForm({
        nama: tipeKarpet.nama,
        deskripsi: tipeKarpet.deskripsi || '',
        is_active: tipeKarpet.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(`/tipe-karpets/${tipeKarpet.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Tipe Karpet: ${tipeKarpet.nama} - Leads Aladdin`} />
            
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-primary">Edit Tipe Karpet: {tipeKarpet.nama}</h1>
                        <p className="text-gray-600">
                            Perbarui informasi tipe karpet
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Form Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Informasi Tipe Karpet
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="nama">Nama Tipe Karpet *</Label>
                                <Input
                                    id="nama"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    placeholder="Contoh: Karpet Masjid, Karpet Hotel, Karpet Kantor, dll"
                                    className={errors.nama ? 'border-red-500' : ''}
                                />
                                {errors.nama && (
                                    <p className="text-sm text-red-500 mt-1">{errors.nama}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <Textarea
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    placeholder="Masukkan deskripsi atau spesifikasi karpet, contoh: ukuran, bahan, warna, dll..."
                                    rows={3}
                                    className={errors.deskripsi ? 'border-red-500' : ''}
                                />
                                {errors.deskripsi && (
                                    <p className="text-sm text-red-500 mt-1">{errors.deskripsi}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', !!checked)}
                                />
                                <Label htmlFor="is_active">Tipe karpet aktif</Label>
                            </div>

                            {/* Stats */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-lg font-bold text-brand-primary">
                                            {tipeKarpet.leads_count || 0}
                                        </div>
                                        <div className="text-xs text-gray-500">Total Leads</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-sm font-medium text-blue-600">
                                            {new Date(tipeKarpet.created_at).toLocaleDateString('id-ID')}
                                        </div>
                                        <div className="text-xs text-gray-500">Dibuat</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-sm font-medium text-green-600">
                                            {new Date(tipeKarpet.updated_at).toLocaleDateString('id-ID')}
                                        </div>
                                        <div className="text-xs text-gray-500">Diperbarui</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    disabled={processing}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#2B5235] hover:bg-[#2B5235]/90"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>

                {/* Warning for active types with leads */}
                {tipeKarpet.leads_count && tipeKarpet.leads_count > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-700">
                                <Activity className="h-5 w-5" />
                                Peringatan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-amber-50 rounded-lg">
                                <p className="text-amber-800 text-sm">
                                    <strong>Tipe karpet ini memiliki {tipeKarpet.leads_count} leads yang terkait.</strong>
                                </p>
                                <p className="text-amber-700 text-sm mt-1">
                                    Menonaktifkan tipe karpet tidak akan menghapus leads yang sudah ada, 
                                    tetapi tipe ini tidak akan tersedia untuk leads baru.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Guidelines */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5" />
                            Panduan Edit Tipe Karpet
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h4 className="font-medium mb-2 text-brand-primary">Perubahan Nama:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Akan mempengaruhi tampilan di semua leads</li>
                                    <li>• Data historis tetap tersimpan dengan aman</li>
                                    <li>• Pastikan nama baru jelas dan spesifik</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 text-brand-primary">Status Aktif/Nonaktif:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Nonaktif: tidak muncul di form leads baru</li>
                                    <li>• Leads lama tetap mempertahankan tipe</li>
                                    <li>• Dapat diaktifkan kembali kapan saja</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}