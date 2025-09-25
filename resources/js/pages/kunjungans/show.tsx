import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, MapPin, Phone, User, Building, Camera, FileText, Settings, Edit, CheckCircle, XCircle, RadioIcon, CheckSquare, Download } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kunjungan', href: '/kunjungans' },
    { title: 'Detail Kunjungan', href: '#' },
];

interface KunjunganItem {
    id: number;
    nama: string;
    deskripsi?: string;
    urutan: number;
    pivot: {
        status: string;
    };
    kunjungan_item_category: {
        id: number;
        nama: string;
        input_type: 'radio' | 'checkbox';
    };
}

interface Kunjungan {
    id: number;
    waktu_canvasing: string;
    bertemu_dengan: string;
    nomor_aktif_takmir: string;
    nama_masjid: string;
    alamat_masjid: string;
    foto_masjid?: string;
    nama_pengurus: string;
    jumlah_shof: string;
    kondisi_karpet: string;
    status: string;
    kebutuhan: string;
    catatan?: string;
    created_at: string;
    user: {
        name: string;
    };
    cabang: {
        nama_cabang: string;
        lokasi: string;
    };
    kunjungan_items: KunjunganItem[];
}

interface PageProps {
    auth: {
        user: {
            role: string;
        };
    };
    kunjungan: Kunjungan;
}

export default function ShowKunjungan() {
    const { auth, kunjungan } = usePage<PageProps>().props;

    const statusColors = {
        COLD: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700',
        WARM: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
        HOT: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700',
    };

    const formatPhoneNumber = (phone: string) => {
        if (phone.startsWith('62')) {
            return '+' + phone;
        }
        return phone;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Group items by category
    const groupedItems = kunjungan.kunjungan_items.reduce((acc, item) => {
        const categoryName = item.kunjungan_item_category.nama;
        if (!acc[categoryName]) {
            acc[categoryName] = {
                category: item.kunjungan_item_category,
                items: [],
            };
        }
        acc[categoryName].items.push(item);
        return acc;
    }, {} as Record<string, { category: any; items: KunjunganItem[] }>);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Kunjungan - ${kunjungan.nama_masjid} - Leads Aladdin`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-brand-primary">
                                {kunjungan.nama_masjid}
                            </h1>
                            <p className="text-muted-foreground">
                                Kunjungan pada {formatDate(kunjungan.waktu_canvasing)}
                            </p>
                        </div>
                    </div>
                    
                    {(auth.user.role === 'super_user' || auth.user.role === 'marketing') && (
                        <Link href={`/kunjungans/${kunjungan.id}/edit`}>
                            <Button className="bg-brand-primary hover:bg-brand-primary-dark transition-colors touch-target">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Kunjungan
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <Card className="border-border/50 shadow-soft">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Informasi Dasar
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">Status</div>
                                    <Badge className={statusColors[kunjungan.status as keyof typeof statusColors]} variant="outline">
                                        {kunjungan.status}
                                    </Badge>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="text-sm text-muted-foreground">PIC</div>
                                    <div className="font-medium">{kunjungan.user.name}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">Waktu Canvasing</div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{formatDate(kunjungan.waktu_canvasing)}</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">Cabang</div>
                                    <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{kunjungan.cabang.nama_cabang}</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">Bertemu Dengan</div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{kunjungan.bertemu_dengan}</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">Nomor Takmir</div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <a 
                                            href={`tel:${kunjungan.nomor_aktif_takmir}`}
                                            className="font-medium text-brand-primary hover:text-brand-primary-dark transition-colors"
                                        >
                                            {formatPhoneNumber(kunjungan.nomor_aktif_takmir)}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mosque Information */}
                    <Card className="border-border/50 shadow-soft">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Informasi Masjid
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Nama Masjid</div>
                                <div className="font-semibold text-lg">{kunjungan.nama_masjid}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Alamat</div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                                    <span className="text-sm leading-relaxed">{kunjungan.alamat_masjid}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">Nama Pengurus</div>
                                    <div className="font-medium">{kunjungan.nama_pengurus}</div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">Jumlah Shof</div>
                                    <div className="font-medium">{kunjungan.jumlah_shof}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Photo */}
                {kunjungan.foto_masjid && (
                    <Card className="border-border/50 shadow-soft">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Camera className="h-5 w-5" />
                                Foto Masjid
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-lg overflow-hidden bg-muted/50">
                                <img 
                                    src={`/kunjungans/${kunjungan.id}/image`}
                                    alt={`Foto ${kunjungan.nama_masjid}`}
                                    className="w-full h-auto max-h-96 object-cover"
                                />
                            </div>
                            <div className="flex justify-center">
                                <a href={`/kunjungans/${kunjungan.id}/download-image`} download>
                                    <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Foto
                                    </Button>
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Details */}
                <Card className="border-border/50 shadow-soft">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Detail Kunjungan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Kondisi Karpet</div>
                            <div className="text-sm leading-relaxed">{kunjungan.kondisi_karpet}</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Kebutuhan</div>
                            <div className="text-sm leading-relaxed">{kunjungan.kebutuhan}</div>
                        </div>

                        {kunjungan.catatan && (
                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Catatan</div>
                                <div className="text-sm leading-relaxed">{kunjungan.catatan}</div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Checklist Items */}
                {Object.keys(groupedItems).length > 0 && (
                    <Card className="border-border/50 shadow-soft">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Checklist Item
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {Object.entries(groupedItems).map(([categoryName, { category, items }]) => (
                                <div key={categoryName} className="space-y-3">
                                    <div className="flex items-center gap-2 border-b pb-2">
                                        {category.input_type === 'radio' ? (
                                            <RadioIcon className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <h4 className="font-medium text-brand-primary">{categoryName}</h4>
                                        <Badge variant="outline" className="text-xs">
                                            {category.input_type === 'radio' ? 'Radio' : 'Checkbox'}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    {item.pivot.status === 'ada' ? (
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <XCircle className="h-5 w-5 text-red-600" />
                                                    )}
                                                    {/* <Badge 
                                                        variant={item.pivot.status === 'ada' ? 'default' : 'secondary'}
                                                        className="text-xs"
                                                    >
                                                        {item.pivot.status === 'ada' ? 'Ada' : 'Belum Ada'}
                                                    </Badge> */}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium">{item.nama}</div>
                                                    {item.deskripsi && (
                                                        <p className="text-xs text-muted-foreground">{item.deskripsi}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Meta Information */}
                <Card className="border-border/50 shadow-soft">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
                            <div>
                                Dibuat pada {new Date(kunjungan.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                            <div>
                                ID Kunjungan: #{kunjungan.id}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}