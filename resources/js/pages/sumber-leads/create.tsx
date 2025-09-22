import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Database, Info } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Master Data', href: '#' },
    { title: 'Sumber Leads', href: '/sumber-leads' },
    { title: 'Tambah Sumber Leads', href: '#' },
];

export default function CreateSumberLeads() {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        deskripsi: '',
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/sumber-leads');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Sumber Leads - Leads Aladdin" />
            
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#2B5235]">Tambah Sumber Leads Baru</h1>
                        <p className="text-gray-600">
                            Buat sumber leads baru untuk mengkategorikan asal leads
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Form Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Informasi Sumber Leads
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="nama">Nama Sumber Leads *</Label>
                                <Input
                                    id="nama"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    placeholder="Contoh: Instagram, Facebook, Referensi Teman, dll"
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
                                    placeholder="Masukkan deskripsi atau keterangan tambahan tentang sumber leads ini..."
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
                                <Label htmlFor="is_active">Sumber leads aktif</Label>
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
                                    {processing ? 'Menyimpan...' : 'Simpan Sumber Leads'}
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
                            Panduan Sumber Leads
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h4 className="font-medium mb-2 text-[#2B5235]">Contoh Sumber Leads:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Media sosial (Instagram, Facebook, TikTok)</li>
                                    <li>• Referensi dari customer lama</li>
                                    <li>• Website atau Google Search</li>
                                    <li>• Pameran atau event</li>
                                    <li>• Iklan online atau offline</li>
                                    <li>• Walk-in atau datang langsung</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 text-[#2B5235]">Tips Pengelolaan:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Gunakan nama yang jelas dan mudah dipahami</li>
                                    <li>• Tambahkan deskripsi untuk detail tambahan</li>
                                    <li>• Nonaktifkan sumber yang sudah tidak digunakan</li>
                                    <li>• Monitor performa setiap sumber leads</li>
                                    <li>• Update secara berkala sesuai kebutuhan</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}