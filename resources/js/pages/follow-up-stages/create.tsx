import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tahap Follow-up', href: '/follow-up-stages' },
    { title: 'Tambah Tahap', href: '#' },
];

interface AvailableStage {
    key: string;
    name: string;
}

interface Props {
    availableStages: AvailableStage[];
}

export default function CreateFollowUpStage() {
    const { availableStages } = usePage<Props>().props;
    
    const { data, setData, post, processing, errors, reset } = useForm({
        key: '',
        name: '',
        next_stage_key: 'null',
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Handle null value for next_stage_key
        const submitData = {
            ...data,
            next_stage_key: data.next_stage_key === 'null' ? '' : data.next_stage_key
        };
        
        post('/follow-up-stages', submitData);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Tahap Follow-up" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/follow-up-stages">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#2B5235]">Tambah Tahap Follow-up</h1>
                        <p className="text-gray-600">Tambahkan tahap follow-up baru ke sistem</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Tahap</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="key">Key Tahap *</Label>
                                    <Input
                                        id="key"
                                        type="text"
                                        value={data.key}
                                        onChange={(e) => setData('key', e.target.value)}
                                        placeholder="contoh: greeting"
                                        className={errors.key ? 'border-red-500' : ''}
                                    />
                                    {errors.key && (
                                        <p className="text-sm text-red-600">{errors.key}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Key unik untuk tahap ini (huruf kecil, underscore)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Tahap *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="contoh: Greeting"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">{errors.name}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Nama yang akan ditampilkan untuk tahap ini
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="next_stage_key">Tahap Selanjutnya</Label>
                                    <Select
                                        value={data.next_stage_key}
                                        onValueChange={(value) => setData('next_stage_key', value)}
                                    >
                                        <SelectTrigger className={errors.next_stage_key ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih tahap selanjutnya (opsional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="null">Tidak ada</SelectItem>
                                            {availableStages.map((stage) => (
                                                <SelectItem key={stage.key} value={stage.key}>
                                                    {stage.name} ({stage.key})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.next_stage_key && (
                                        <p className="text-sm text-red-600">{errors.next_stage_key}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Tahap yang akan dituju setelah tahap ini selesai
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="is_active">Status Aktif</Label>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked)}
                                        />
                                        <Label htmlFor="is_active" className="text-sm">
                                            {data.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </Label>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Tahap aktif akan tersedia untuk digunakan dalam sistem
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button variant="outline" asChild>
                                    <Link href="/follow-up-stages">
                                        Batal
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}