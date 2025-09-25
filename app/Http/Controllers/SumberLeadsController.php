<?php

namespace App\Http\Controllers;

use App\Models\SumberLeads;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SumberLeadsController extends Controller
{
    public function __construct()
    {
        //
    }

    public function index()
    {
        $this->authorize('viewAny', SumberLeads::class);
        
        $sumberLeads = SumberLeads::where('is_active', true)
            ->withCount('leads')
            ->get();

        return Inertia::render('sumber-leads/index', [
            'sumberLeads' => $sumberLeads,
        ]);
    }

    public function create()
    {
        $this->authorize('create', SumberLeads::class);
        
        return Inertia::render('sumber-leads/create');
    }

    public function store(Request $request)
    {
        $this->authorize('create', SumberLeads::class);
        
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        SumberLeads::create($validated);

        return redirect()->route('sumber-leads.index')
            ->with('success', 'Sumber leads berhasil dibuat.');
    }

    public function edit(SumberLeads $sumberLead)
    {
        $this->authorize('update', $sumberLead);
        
        return Inertia::render('sumber-leads/edit', [
            'sumberLead' => $sumberLead,
        ]);
    }

    public function update(Request $request, SumberLeads $sumberLead)
    {
        $this->authorize('update', $sumberLead);
        
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        $sumberLead->update($validated);

        return redirect()->route('sumber-leads.index')
            ->with('success', 'Sumber leads berhasil diperbarui.');
    }

    public function destroy(SumberLeads $sumberLead)
    {
        $this->authorize('delete', $sumberLead);
        
        $sumberLead->update(['is_active' => false]);

        return redirect()->route('sumber-leads.index')
            ->with('success', 'Sumber leads berhasil dihapus.');
    }
}
