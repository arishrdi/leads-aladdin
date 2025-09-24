import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, User, Mail, Shield, Building, UserCheck, Calendar, Activity } from 'lucide-react';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    cabangs: Array<{
        id: number;
        nama_cabang: string;
        lokasi: string;
        alamat: string;
    }>;
    leads_count?: number;
    follow_ups_count?: number;
}

interface PageProps {
    user: UserData;
}

const getRoleBadgeVariant = (role: string) => {
    switch (role) {
        case 'super_user':
            return 'destructive';
        case 'supervisor':
            return 'default';
        case 'marketing':
            return 'secondary';
        default:
            return 'outline';
    }
};

const getRoleDisplayName = (role: string) => {
    switch (role) {
        case 'super_user':
            return 'Super User';
        case 'supervisor':
            return 'Supervisor';
        case 'marketing':
            return 'Marketing';
        default:
            return role;
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

export default function ShowUser() {
    const { user } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kelola User', href: '/users' },
        { title: user.name, href: '#' },
    ];

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus user ${user.name}?`)) {
            router.delete(`/users/${user.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail User: ${user.name} - Leads Aladdin`} />
            
            <div className=" space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-[#2B5235]">{user.name}</h1>
                            <p className="text-gray-600 flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/users/${user.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleDelete}
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informasi Pengguna
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                                    <p className="font-medium">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Role</p>
                                    <Badge variant={getRoleBadgeVariant(user.role)} className="mt-1">
                                        {getRoleDisplayName(user.role)}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <Badge variant={user.is_active ? 'default' : 'secondary'} className="mt-1">
                                        {user.is_active ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Status Email</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <UserCheck className="h-4 w-4 text-gray-400" />
                                        <Badge variant={user.email_verified_at ? 'default' : 'secondary'} className="text-xs">
                                            {user.email_verified_at ? 'Terverifikasi' : 'Belum Verifikasi'}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Bergabung</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{new Date(user.created_at).toLocaleDateString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Terakhir Diperbarui</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Activity className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{new Date(user.updated_at).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Role & Permissions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Hak Akses & Wewenang
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Role: <strong>{getRoleDisplayName(user.role)}</strong></p>
                                <p className="text-sm text-gray-700">
                                    {getRoleDescription(user.role)}
                                </p>
                            </div>

                            {user.role !== 'super_user' && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm text-gray-600">Cabang yang Dikelola</p>
                                    </div>
                                    {user.cabangs.length > 0 ? (
                                        <div className="space-y-2">
                                            {user.cabangs.map((cabang) => (
                                                <div key={cabang.id} className="p-3 border rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-[#2B5235]">{cabang.nama_cabang}</p>
                                                            <p className="text-sm text-gray-600">{cabang.lokasi}</p>
                                                        </div>
                                                        <Link href={`/cabangs/${cabang.id}`}>
                                                            <Button variant="outline" size="sm">
                                                                Detail
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 border rounded-lg">
                                            <Building className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">
                                                Belum ada cabang yang ditugaskan
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {user.role === 'super_user' && (
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-red-600" />
                                        <span className="font-medium text-red-800">Super User Access</span>
                                    </div>
                                    <p className="text-sm text-red-700 mt-1">
                                        Memiliki akses penuh ke semua cabang dan seluruh fitur sistem.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Stats (if available) */}
                {(user.leads_count !== undefined || user.follow_ups_count !== undefined) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Statistik Performa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {user.leads_count !== undefined && (
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-[#2B5235]">
                                            {user.leads_count}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Leads</div>
                                    </div>
                                )}
                                {user.follow_ups_count !== undefined && (
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {user.follow_ups_count}
                                        </div>
                                        <div className="text-sm text-gray-600">Follow-ups</div>
                                    </div>
                                )}
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {user.cabangs.length}
                                    </div>
                                    <div className="text-sm text-gray-600">Cabang Kelola</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* System Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Sistem</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h4 className="font-medium mb-2 text-[#2B5235]">Timeline:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Akun dibuat: {new Date(user.created_at).toLocaleString('id-ID')}</li>
                                    <li>• Terakhir diperbarui: {new Date(user.updated_at).toLocaleString('id-ID')}</li>
                                    <li>• Email terverifikasi: {user.email_verified_at ? new Date(user.email_verified_at).toLocaleString('id-ID') : 'Belum'}</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 text-[#2B5235]">Status:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Status akun: {user.is_active ? 'Aktif' : 'Nonaktif'}</li>
                                    <li>• Role: {getRoleDisplayName(user.role)}</li>
                                    <li>• Cabang terlibat: {user.cabangs.length} cabang</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}