<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Room;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $rooms = Room::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%')
                      ->orWhere('faculty_name', 'like', '%' . $search . '%');
            })
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('rooms/index', [
            'rooms' => $rooms
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi input (photo diizinkan sebagai file gambar)
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'faculty_name' => ['required', 'string', 'max:255'],
            'photo' => ['nullable', 'image', 'max:2048'], // max 2MB (ubah sesuai kebutuhan)
            'capacity' => ['required', 'integer', 'min:1'],
            'status' => ['required', Rule::in(['draft', 'approved', 'rejected'])],
        ]);

        // Jika ada file photo, simpan ke disk public dan ambil URL-nya
        $photoUrl = null;
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('rooms', 'public'); // path seperti "rooms/abcd.jpg"
            $photoUrl = Storage::url($path); // URL seperti "/storage/rooms/abcd.jpg"
        }

        Room::create([
            'name' => $validated['name'],
            'faculty_name' => $validated['faculty_name'],
            'photo' => $photoUrl,
            'capacity' => $validated['capacity'],
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Ruangan berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $room)
    {
        $room = Room::findOrFail($room);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'faculty_name' => ['required', 'string', 'max:255'],
            'photo' => ['nullable', 'image', 'max:2048'],
            'capacity' => ['required', 'integer', 'min:1'],
            'status' => ['required', Rule::in(['draft', 'approved', 'rejected'])],
        ]);

        // Jika ada file photo baru, simpan dan hapus file lama (jika ada dan berada di storage/public)
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('rooms', 'public');
            $photoUrl = Storage::url($path);

            // Hapus file lama apabila file lama ada di disk 'public' (yang disimpan oleh Storage::url)
            if (!empty($room->photo)) {
                // ambil path relatif: mis. /storage/rooms/abcd.jpg -> rooms/abcd.jpg
                $oldPath = null;
                $parsed = parse_url($room->photo, PHP_URL_PATH);
                if ($parsed) {
                    // jika URL berformat /storage/rooms/xxx atau full URL yang mengandung /storage/...
                    $oldPath = ltrim(str_replace('/storage/', '', $parsed), '/');
                }
                if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $room->photo = $photoUrl;
        }

        $room->name = $validated['name'];
        $room->faculty_name = $validated['faculty_name'];
        $room->capacity = $validated['capacity'];
        $room->status = $validated['status'];

        $room->save();

        return redirect()->back()->with('success', 'Ruangan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return redirect()->back()->with('success', 'Ruangan berhasil dihapus.');
    }
}
