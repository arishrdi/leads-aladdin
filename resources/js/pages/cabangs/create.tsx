import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, Building, Users } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cabang', href: '/cabangs' },
    { title: 'Tambah Cabang', href: '#' },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface PageProps {
    supervisors: User[];
}

export default function CreateCabang() {
    const { supervisors } = usePage<PageProps>().props;
    
    const { data, setData, post, processing, errors } = useForm({
        nama_cabang: '',
        lokasi: '',
        alamat: '',
        no_telp: '',
        pic: '',
        is_active: true,
        user_ids: [] as number[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/cabangs');
    };

    const handleUserToggle = (userId: number, checked: boolean) => {
        if (checked) {
            setData('user_ids', [...data.user_ids, userId]);
        } else {
            setData('user_ids', data.user_ids.filter(id => id !== userId));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Cabang - Leads Aladdin" />
            
            <div className=" space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-primary">Tambah Cabang Baru</h1>
                        <p className="text-gray-600">
                            Buat cabang baru dan tugaskan supervisor
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Branch Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Informasi Cabang
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="nama_cabang">Nama Cabang *</Label>
                                    <Input
                                        id="nama_cabang"
                                        value={data.nama_cabang}
                                        onChange={(e) => setData('nama_cabang', e.target.value)}
                                        placeholder="Contoh: Jakarta Pusat"
                                        className={errors.nama_cabang ? 'border-red-500' : ''}
                                    />
                                    {errors.nama_cabang && (
                                        <p className="text-sm text-red-500 mt-1">{errors.nama_cabang}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="lokasi">Lokasi/Kota *</Label>
                                    <Input
                                        id="lokasi"
                                        value={data.lokasi}
                                        onChange={(e) => setData('lokasi', e.target.value)}
                                        placeholder="Contoh: Jakarta"
                                        className={errors.lokasi ? 'border-red-500' : ''}
                                    />
                                    {errors.lokasi && (
                                        <p className="text-sm text-red-500 mt-1">{errors.lokasi}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="alamat">Alamat Lengkap *</Label>
                                    <Textarea
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        placeholder="Masukkan alamat lengkap cabang..."
                                        rows={3}
                                        className={errors.alamat ? 'border-red-500' : ''}
                                    />
                                    {errors.alamat && (
                                        <p className="text-sm text-red-500 mt-1">{errors.alamat}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="no_telp">Nomor Telepon *</Label>
                                    <Input
                                        id="no_telp"
                                        value={data.no_telp}
                                        onChange={(e) => setData('no_telp', e.target.value)}
                                        placeholder="Contoh: 021-555-0123"
                                        className={errors.no_telp ? 'border-red-500' : ''}
                                    />
                                    {errors.no_telp && (
                                        <p className="text-sm text-red-500 mt-1">{errors.no_telp}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="pic">Person in Charge (PIC) *</Label>
                                    <Input
                                        id="pic"
                                        value={data.pic}
                                        onChange={(e) => setData('pic', e.target.value)}
                                        placeholder="Contoh: Bapak Ahmad"
                                        className={errors.pic ? 'border-red-500' : ''}
                                    />
                                    {errors.pic && (
                                        <p className="text-sm text-red-500 mt-1">{errors.pic}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', !!checked)}
                                    />
                                    <Label htmlFor="is_active">Cabang aktif</Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Team Assignment */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Penugasan Supervisor
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {supervisors.length > 0 ? (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-600 mb-4">
                                            Pilih supervisor yang akan mengelola cabang ini:
                                        </p>
                                        {supervisors.map((user) => (
                                            <div key={user.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                                <Checkbox
                                                    id={`user-${user.id}`}
                                                    checked={data.user_ids.includes(user.id)}
                                                    onCheckedChange={(checked) => handleUserToggle(user.id, !!checked)}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Label htmlFor={`user-${user.id}`} className="font-medium cursor-pointer">
                                                            {user.name}
                                                        </Label>
                                                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                                            Supervisor
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {data.user_ids.length > 0 && (
                                            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                                                <p className="text-sm text-purple-800">
                                                    <strong>{data.user_ids.length} supervisor</strong> akan mengelola cabang ini.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500">
                                            Tidak ada supervisor yang tersedia untuk ditugaskan.
                                        </p>
                                    </div>
                                )}
                                {errors.user_ids && (
                                    <p className="text-sm text-red-500 mt-2">{errors.user_ids}</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

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
                                    {processing ? 'Menyimpan...' : 'Simpan Cabang'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>

                {/* Guidelines */}
                <Card>
                    <CardHeader>
                        <CardTitle>Panduan Pengelolaan Cabang</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h4 className="font-medium mb-2 text-brand-primary">Informasi Cabang:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Gunakan nama yang jelas dan mudah diingat</li>
                                    <li>• Pastikan alamat lengkap dan akurat</li>
                                    <li>• Nomor telepon harus dapat dihubungi</li>
                                    <li>• PIC bertanggung jawab atas operasional cabang</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 text-brand-primary">Penugasan Supervisor:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Supervisor dapat mengelola multiple cabang</li>
                                    <li>• Marketing ditugaskan melalui user management</li>
                                    <li>• Monitor performa cabang dan tim</li>
                                    <li>• Update penugasan sesuai kebutuhan</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}