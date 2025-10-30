import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'User Management',
    href: dashboard().url,
  },
];

export default function UserIndex({ users }: { users: { current_page: number, data: any[] } }) {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Form tambah user
  const addForm = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user',
  });

  // Form edit user
  const editForm = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addForm.post(route('users.store'), {
      onSuccess: () => {
        setOpenAdd(false);
        addForm.reset();
      },
    });
  };

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    editForm.setData({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      role: user.role,
    });
    setOpenEdit(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editForm.put(route('users.update', selectedUser.id), {
      onSuccess: () => {
        setOpenEdit(false);
      },
    });
  };

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = () => {
    router.delete(route('users.destroy', selectedUser.id), {
      onSuccess: () => setOpenDelete(false),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Management" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <div className='flex justify-between p-4'>
            <div></div>
            <div>
              <Button
                onClick={() => setOpenAdd(true)}
                className="bg-secondary text-black border-2 shadow hover:bg-gray-300"
              >
                Add New
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data.length > 0 ? (
                <>
                  {users.data.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          onClick={() => handleEditClick(user)}
                          className="bg-amber-500 hover:bg-amber-700 text-white px-2 py-1 ms-1"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(user)}
                          className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 ms-1"
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableCaption>Tidak ada data user.</TableCaption>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal Tambah User */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-3">
            <div>
              <Label>Nama</Label>
              <Input value={addForm.data.name} onChange={e => addForm.setData('name', e.target.value)} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={addForm.data.email} onChange={e => addForm.setData('email', e.target.value)} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={addForm.data.password} onChange={e => addForm.setData('password', e.target.value)} required />
            </div>
            <div>
              <Label>Konfirmasi Password</Label>
              <Input type="password" value={addForm.data.password_confirmation} onChange={e => addForm.setData('password_confirmation', e.target.value)} required />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={addForm.data.role} onValueChange={(value) => addForm.setData('role', value)}>
                <SelectTrigger><SelectValue placeholder="Pilih Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={addForm.processing}>Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Edit User */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-3">
            <div>
              <Label>Nama</Label>
              <Input value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={editForm.data.email} onChange={e => editForm.setData('email', e.target.value)} required />
            </div>
            <div>
              <Label>Password (kosongkan jika tidak diubah)</Label>
              <Input type="password" value={editForm.data.password} onChange={e => editForm.setData('password', e.target.value)} />
            </div>
            <div>
              <Label>Konfirmasi Password</Label>
              <Input type="password" value={editForm.data.password_confirmation} onChange={e => editForm.setData('password_confirmation', e.target.value)} />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={editForm.data.role} onValueChange={(value) => editForm.setData('role', value)}>
                <SelectTrigger><SelectValue placeholder="Pilih Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={editForm.processing}>Perbarui</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Delete User */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menghapus user <b>{selectedUser?.name}</b>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>Batal</Button>
            <Button className="bg-red-500 hover:bg-red-700 text-white" onClick={handleDeleteConfirm}>
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
