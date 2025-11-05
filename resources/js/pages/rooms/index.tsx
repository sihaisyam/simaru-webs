import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Room Management',
        href: dashboard().url,
    },
];

export default function RoomIndex({
    rooms,
}: {
    rooms: { current_page: number; data: any[] };
}) {
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [previewAdd, setPreviewAdd] = useState<string | null>(null);
    const [previewEdit, setPreviewEdit] = useState<string | null>(null);

    // Form tambah room. photo bisa berupa File
    const addForm = useForm({
        name: '',
        faculty_name: '',
        photo: null as File | null,
        capacity: '',
        status: 'draft',
    });

    // Form edit room
    const editForm = useForm({
        name: '',
        faculty_name: '',
        photo: null as File | null, // jika user memilih file baru
        capacity: '',
        status: '',
    });

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Inertia useForm akan otomatis mengirim FormData jika ada File dalam data
        addForm.post(route('rooms.store'), {
            onSuccess: () => {
                setOpenAdd(false);
                addForm.reset();
                setPreviewAdd(null);
            },
        });
    };

    const handleEditClick = (room: any) => {
        setSelectedRoom(room);
        editForm.setData({
            name: room.name,
            faculty_name: room.faculty_name,
            photo: null,
            capacity: room.capacity,
            status: room.status,
        });
        setPreviewEdit(room.photo ?? null);
        setOpenEdit(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            route('rooms.update', selectedRoom.id),
            {
                ...editForm.data,
                _method: 'put',
                forceFormData: true,
            },
            {
                onSuccess: () => {
                    setOpenEdit(false);
                    editForm.reset();
                    setPreviewEdit(null);
                },
            },
        );
    };

    const handleDeleteClick = (room: any) => {
        setSelectedRoom(room);
        setOpenDelete(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(route('rooms.destroy', selectedRoom.id), {
            onSuccess: () => setOpenDelete(false),
        });
    };

    // helper untuk preview file local ketika memilih file
    const onAddPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        addForm.setData('photo', file);
        if (file) {
            setPreviewAdd(URL.createObjectURL(file));
        } else {
            setPreviewAdd(null);
        }
    };

    const onEditPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        editForm.setData('photo', file);
        if (file) {
            setPreviewEdit(URL.createObjectURL(file));
        } else {
            // jika user mengosongkan input file, kita tetap show existing preview (selectedRoom.photo)
            setPreviewEdit(selectedRoom?.photo ?? null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Room Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="flex justify-between p-4">
                        <div></div>
                        <div>
                            <Button
                                onClick={() => setOpenAdd(true)}
                                className="border-2 bg-secondary text-black shadow hover:bg-gray-300"
                            >
                                Add New Room
                            </Button>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] text-center">
                                    No
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Faculty</TableHead>
                                <TableHead>Photo</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rooms.data.length > 0 ? (
                                <>
                                    {rooms.data.map((room, index) => (
                                        <TableRow key={room.id}>
                                            <TableCell className="text-center">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>{room.name}</TableCell>
                                            <TableCell>
                                                {room.faculty_name}
                                            </TableCell>
                                            <TableCell>
                                                {room.photo ? (
                                                    <img
                                                        src={room.photo}
                                                        alt={room.name}
                                                        className="h-16 w-16 rounded object-cover"
                                                    />
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {room.capacity}
                                            </TableCell>
                                            <TableCell className="capitalize">
                                                {room.status}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    onClick={() =>
                                                        handleEditClick(room)
                                                    }
                                                    className="ms-1 bg-amber-500 px-2 py-1 text-white hover:bg-amber-700"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        handleDeleteClick(room)
                                                    }
                                                    className="ms-1 bg-red-500 px-2 py-1 text-white hover:bg-red-700"
                                                >
                                                    Hapus
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            ) : (
                                <TableCaption>
                                    Tidak ada data ruangan.
                                </TableCaption>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal Tambah Room */}
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Ruangan</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="space-y-3">
                        <div>
                            <Label>Nama Ruangan</Label>
                            <Input
                                value={addForm.data.name}
                                onChange={(e) =>
                                    addForm.setData('name', e.target.value)
                                }
                                required
                            />
                        </div>
                        <div>
                            <Label>Nama Fakultas</Label>
                            <Input
                                value={addForm.data.faculty_name}
                                onChange={(e) =>
                                    addForm.setData(
                                        'faculty_name',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        </div>
                        <div>
                            <Label>Foto (upload)</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={onAddPhotoChange}
                            />
                            {previewAdd && (
                                <img
                                    src={previewAdd}
                                    alt="preview"
                                    className="mt-2 h-32 w-32 rounded object-cover"
                                />
                            )}
                        </div>
                        <div>
                            <Label>Kapasitas</Label>
                            <Input
                                type="number"
                                value={addForm.data.capacity}
                                onChange={(e) =>
                                    addForm.setData('capacity', e.target.value)
                                }
                                required
                            />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select
                                value={addForm.data.status}
                                onValueChange={(value) =>
                                    addForm.setData('status', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="approved">
                                        Approved
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        Rejected
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={addForm.processing}>
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Room */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Ruangan</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-3">
                        <div>
                            <Label>Nama Ruangan</Label>
                            <Input
                                value={editForm.data.name}
                                onChange={(e) =>
                                    editForm.setData('name', e.target.value)
                                }
                                required
                            />
                        </div>
                        <div>
                            <Label>Nama Fakultas</Label>
                            <Input
                                value={editForm.data.faculty_name}
                                onChange={(e) =>
                                    editForm.setData(
                                        'faculty_name',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        </div>
                        <div>
                            <Label>Foto (upload jika ingin mengganti)</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={onEditPhotoChange}
                            />
                            {previewEdit && (
                                <img
                                    src={previewEdit}
                                    alt="preview"
                                    className="mt-2 h-32 w-32 rounded object-cover"
                                />
                            )}
                        </div>
                        <div>
                            <Label>Kapasitas</Label>
                            <Input
                                type="number"
                                value={editForm.data.capacity}
                                onChange={(e) =>
                                    editForm.setData('capacity', e.target.value)
                                }
                                required
                            />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select
                                value={editForm.data.status}
                                onValueChange={(value) =>
                                    editForm.setData('status', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="approved">
                                        Approved
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        Rejected
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                Perbarui
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Delete Room */}
            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                    </DialogHeader>
                    <p>
                        Apakah Anda yakin ingin menghapus ruangan{' '}
                        <b>{selectedRoom?.name}</b>?
                    </p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenDelete(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            className="bg-red-500 text-white hover:bg-red-700"
                            onClick={handleDeleteConfirm}
                        >
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
