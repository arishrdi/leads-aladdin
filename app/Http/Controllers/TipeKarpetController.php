<?php

namespace App\Http\Controllers;

use App\Models\TipeKarpet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TipeKarpetController extends Controller
{
    public function __construct()
    {
        //
    }

    public function index()
    {
        $this->authorize('viewAny', TipeKarpet::class);
        
        $tipeKarpets = TipeKarpet::where('is_active', true)
            ->withCount('leads')
            ->get();

        return Inertia::render('tipe-karpets/index', [
            'tipeKarpets' => $tipeKarpets,
        ]);
    }

    public function create()
    {
        $this->authorize('create', TipeKarpet::class);
        
        return Inertia::render('tipe-karpets/create');
    }

    public function store(Request $request)
    {
        $this->authorize('create', TipeKarpet::class);
        
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        TipeKarpet::create($validated);

        return redirect()->route('tipe-karpets.index')
            ->with('success', 'Tipe karpet berhasil dibuat.');
    }

    public function edit(TipeKarpet $tipeKarpet)
    {
        $this->authorize('update', $tipeKarpet);
        
        return Inertia::render('tipe-karpets/edit', [
            'tipeKarpet' => $tipeKarpet,
        ]);
    }

    public function update(Request $request, TipeKarpet $tipeKarpet)
    {
        $this->authorize('update', $tipeKarpet);
        
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        $tipeKarpet->update($validated);

        return redirect()->route('tipe-karpets.index')
            ->with('success', 'Tipe karpet berhasil diperbarui.');
    }

    public function destroy(TipeKarpet $tipeKarpet)
    {
        $this->authorize('delete', $tipeKarpet);
        
        $tipeKarpet->update(['is_active' => false]);

        return redirect()->route('tipe-karpets.index')
            ->with('success', 'Tipe karpet berhasil dihapus.');
    }
}
