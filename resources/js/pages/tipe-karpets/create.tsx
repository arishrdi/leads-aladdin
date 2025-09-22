import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Package, Info } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Master Data', href: '#' },
    { title: 'Tipe Karpet', href: '/tipe-karpets' },
    { title: 'Tambah Tipe Karpet', href: '#' },
];

export default function CreateTipeKarpet() {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        deskripsi: '',
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/tipe-karpets');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Tipe Karpet - Leads Aladdin" />
            
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#2B5235]">Tambah Tipe Karpet Baru</h1>
                        <p className="text-gray-600">
                            Buat tipe karpet baru untuk mengkategorikan produk
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
                                    {processing ? 'Menyimpan...' : 'Simpan Tipe Karpet'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>

                {/* Guidelines */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5" />
                            Panduan Tipe Karpet
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h4 className="font-medium mb-2 text-[#2B5235]">Contoh Tipe Karpet:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Karpet Masjid (berbagai ukuran dan motif)</li>
                                    <li>• Karpet Hotel (berkualitas tinggi)</li>
                                    <li>• Karpet Kantor (tahan lama dan mudah dirawat)</li>
                                    <li>• Karpet Rumah (nyaman dan hangat)</li>
                                    <li>• Karpet Event (portable dan fleksibel)</li>
                                    <li>• Karpet Custom (sesuai permintaan khusus)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 text-[#2B5235]">Tips Pengelolaan:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Gunakan nama yang spesifik dan jelas</li>
                                    <li>• Tambahkan deskripsi untuk spesifikasi detail</li>
                                    <li>• Kategorikan berdasarkan penggunaan atau bahan</li>
                                    <li>• Nonaktifkan tipe yang sudah tidak diproduksi</li>
                                    <li>• Update deskripsi sesuai perkembangan produk</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}