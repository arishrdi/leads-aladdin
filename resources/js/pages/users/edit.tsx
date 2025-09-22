import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, User, Building, Shield } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kelola User', href: '/users' },
    { title: 'Edit User', href: '#' },
];

interface Cabang {
    id: number;
    nama_cabang: string;
    lokasi: string;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    cabangs: Array<{
        id: number;
        nama_cabang: string;
        lokasi: string;
    }>;
}

interface PageProps {
    user: UserData;
    cabangs: Cabang[];
}

export default function EditUser() {
    const { user, cabangs } = usePage<PageProps>().props;
    
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
        is_active: user.is_active,
        cabang_ids: user.cabangs.map(c => c.id),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(`/users/${user.id}`);
    };

    const handleCabangToggle = (cabangId: number, checked: boolean) => {
        if (checked) {
            setData('cabang_ids', [...data.cabang_ids, cabangId]);
        } else {
            setData('cabang_ids', data.cabang_ids.filter(id => id !== cabangId));
        }
    };

    const getRoleDescription = (role: string) => {
        switch (role) {
            case 'super_user':
                return 'Akses penuh ke semua fitur sistem, CRUD user, cabang, master data, laporan lintas cabang';
            case 'supervisor':
                return 'Akses ke laporan dan monitoring, dapat mengelola multiple cabang';
            case 'marketing':
                return 'Membuat leads, follow-ups, dokumen, hanya satu cabang';
            default:
                return '';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User: ${user.name} - Leads Aladdin`} />
            
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#2B5235]">Edit User: {user.name}</h1>
                        <p className="text-gray-600">
                            Perbarui informasi pengguna dan hak akses
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* User Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informasi User
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nama Lengkap *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: Ahmad Wijaya"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="contoh@email.com"
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password">Password Baru</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Kosongkan jika tidak ingin mengubah"
                                        className={errors.password ? 'border-red-500' : ''}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi password baru"
                                        className={errors.password_confirmation ? 'border-red-500' : ''}
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-sm text-red-500 mt-1">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', !!checked)}
                                    />
                                    <Label htmlFor="is_active">User aktif</Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Role & Branch Assignment */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Hak Akses & Penugasan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="role">Role *</Label>
                                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                        <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih role user" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="super_user">Super User</SelectItem>
                                            <SelectItem value="supervisor">Supervisor</SelectItem>
                                            <SelectItem value="marketing">Marketing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {data.role && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            {getRoleDescription(data.role)}
                                        </p>
                                    )}
                                    {errors.role && (
                                        <p className="text-sm text-red-500 mt-1">{errors.role}</p>
                                    )}
                                </div>

                                {/* Branch Assignment */}
                                {data.role && data.role !== 'super_user' && (
                                    <div>
                                        <Label className="flex items-center gap-2">
                                            <Building className="h-4 w-4" />
                                            Penugasan Cabang *
                                        </Label>
                                        {cabangs.length > 0 ? (
                                            <div className="space-y-3 mt-2">
                                                <p className="text-sm text-gray-600">
                                                    {data.role === 'marketing' 
                                                        ? 'Pilih satu cabang untuk marketing:'
                                                        : 'Pilih cabang yang akan dikelola:'
                                                    }
                                                </p>
                                                {cabangs.map((cabang) => (
                                                    <div key={cabang.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                                        <Checkbox
                                                            id={`cabang-${cabang.id}`}
                                                            checked={data.cabang_ids.includes(cabang.id)}
                                                            onCheckedChange={(checked) => {
                                                                if (data.role === 'marketing') {
                                                                    setData('cabang_ids', checked ? [cabang.id] : []);
                                                                } else {
                                                                    handleCabangToggle(cabang.id, !!checked);
                                                                }
                                                            }}
                                                        />
                                                        <div className="flex-1">
                                                            <Label htmlFor={`cabang-${cabang.id}`} className="font-medium cursor-pointer">
                                                                {cabang.nama_cabang}
                                                            </Label>
                                                            <p className="text-sm text-gray-500">{cabang.lokasi}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {data.cabang_ids.length > 0 && (
                                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                                        <p className="text-sm text-blue-800">
                                                            <strong>{data.cabang_ids.length} cabang</strong> akan ditugaskan.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 border rounded-lg">
                                                <Building className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-gray-500 text-sm">
                                                    Tidak ada cabang yang tersedia. Buat cabang terlebih dahulu.
                                                </p>
                                            </div>
                                        )}
                                        {errors.cabang_ids && (
                                            <p className="text-sm text-red-500 mt-2">{errors.cabang_ids}</p>
                                        )}
                                    </div>
                                )}

                                {data.role === 'super_user' && (
                                    <div className="p-4 bg-red-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-red-600" />
                                            <span className="font-medium text-red-800">Super User</span>
                                        </div>
                                        <p className="text-sm text-red-700 mt-1">
                                            Super User memiliki akses ke semua cabang dan fitur sistem.
                                        </p>
                                    </div>
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
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>

                {/* Password Guidelines */}
                <Card>
                    <CardHeader>
                        <CardTitle>Panduan Edit User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h4 className="font-medium mb-2 text-[#2B5235]">Password:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Kosongkan jika tidak ingin mengubah password</li>
                                    <li>• Password baru minimum 8 karakter</li>
                                    <li>• Gunakan kombinasi huruf, angka, dan simbol</li>
                                    <li>• Konfirmasi password harus sama</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 text-[#2B5235]">Role & Cabang:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Mengubah role akan reset penugasan cabang</li>
                                    <li>• Marketing hanya bisa satu cabang</li>
                                    <li>• Supervisor bisa multiple cabang</li>
                                    <li>• Super User akses ke semua cabang</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}