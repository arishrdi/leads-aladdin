import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { UserCog, Users, Eye, Edit, Trash2, Plus, Mail, User, Building, UserCheck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kelola User', href: '#' },
];

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
    email_verified_at: string | null;
    created_at: string;
}

interface PageProps {
    users: UserData[];
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

export default function UsersIndex() {
    const { users } = usePage<PageProps>().props;

    const handleDelete = (user: UserData) => {
        if (confirm(`Apakah Anda yakin ingin menghapus user ${user.name}?`)) {
            router.delete(`/users/${user.id}`);
        }
    };

    const activeUsers = users.filter(u => u.is_active);
    const superUsers = activeUsers.filter(u => u.role === 'super_user');
    const supervisors = activeUsers.filter(u => u.role === 'supervisor');
    const marketingUsers = activeUsers.filter(u => u.role === 'marketing');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola User - Leads Aladdin" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#2B5235]">Kelola User</h1>
                        <p className="text-gray-600">
                            Kelola pengguna sistem dan hak akses di seluruh cabang
                        </p>
                    </div>
                    <Link href="/users/create">
                        <Button className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah User
                        </Button>
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#2B5235]/10 rounded-lg">
                                    <Users className="h-5 w-5 text-[#2B5235]" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total User Aktif</p>
                                    <p className="text-2xl font-bold text-[#2B5235]">
                                        {activeUsers.length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <UserCog className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Super User</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {superUsers.length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <UserCheck className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Supervisor</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {supervisors.length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <User className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Marketing</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {marketingUsers.length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Users List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {users.map((user) => (
                        <Card key={user.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#2B5235]/10 rounded-lg">
                                            <User className="h-5 w-5 text-[#2B5235]" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg text-[#2B5235]">
                                                {user.name}
                                            </CardTitle>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Badge variant={getRoleBadgeVariant(user.role)}>
                                            {getRoleDisplayName(user.role)}
                                        </Badge>
                                        <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                            {user.is_active ? 'Aktif' : 'Nonaktif'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                                {/* User Info */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <UserCheck className="h-4 w-4 text-gray-400" />
                                        <span className="font-medium">Status Email:</span>
                                        <Badge variant={user.email_verified_at ? 'default' : 'secondary'} className="text-xs">
                                            {user.email_verified_at ? 'Terverifikasi' : 'Belum Verifikasi'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span className="font-medium">Bergabung:</span>
                                        <span className="text-gray-600">
                                            {new Date(user.created_at).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                </div>

                                {/* Assigned Branches */}
                                {user.cabangs.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                            <Building className="h-4 w-4" />
                                            Cabang yang Dikelola:
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {user.cabangs.map((cabang) => (
                                                <Badge key={cabang.id} variant="outline" className="text-xs">
                                                    {cabang.nama_cabang}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-gray-100">
                                    <Link href={`/users/${user.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Detail
                                        </Button>
                                    </Link>
                                    <Link href={`/users/${user.id}/edit`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleDelete(user)}
                                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {users.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Belum ada user
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Tambahkan user pertama untuk mulai mengelola sistem leads.
                            </p>
                            <Link href="/users/create">
                                <Button className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tambah User Pertama
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}