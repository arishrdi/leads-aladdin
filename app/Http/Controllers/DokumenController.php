<?php

namespace App\Http\Controllers;

use App\Models\Dokumen;
use App\Models\Leads;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DokumenController extends Controller
{
    public function __construct()
    {
        //
    }

    public function allIndex(Request $request)
    {
        $user = auth()->user();
        $activeBranch = $request->get('active_branch_object');
        
        $query = Dokumen::with(['leads.user', 'leads.cabang', 'user']);
        
        // Apply active branch filtering first (if set)
        if ($activeBranch) {
            $query->whereHas('leads', function ($q) use ($activeBranch) {
                $q->where('cabang_id', $activeBranch->id);
            });
        }
        // Apply role-based filtering if no active branch is set
        elseif ($user->role === 'marketing') {
            $query->whereHas('leads', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        } elseif ($user->role === 'supervisor') {
            $query->whereHas('leads.cabang', function ($q) use ($user) {
                $q->whereIn('id', $user->cabangs()->pluck('cabangs.id'));
            });
        }
        // Super user can see all documents (no additional filter)
        
        $dokumens = $query->latest()->paginate(20);

        return Inertia::render('dokumens/all-index', [
            'dokumens' => $dokumens,
            'config' => [
                'dokumenKategori' => config('leads.dokumen_kategori'),
            ],
        ]);
    }

    public function generalCreate(Request $request)
    {
        $user = auth()->user();
        $activeBranch = $request->get('active_branch_object');
        
        // Get leads that the user can create documents for
        $leadsQuery = Leads::with(['user', 'cabang']);
        
        // Apply active branch filtering first (if set)
        if ($activeBranch) {
            $leadsQuery->where('cabang_id', $activeBranch->id);
        }
        // Apply role-based filtering if no active branch is set
        elseif ($user->role === 'marketing') {
            $leadsQuery->where('user_id', $user->id);
        } elseif ($user->role === 'supervisor') {
            $leadsQuery->whereHas('cabang', function ($q) use ($user) {
                $q->whereIn('id', $user->cabangs()->pluck('cabangs.id'));
            });
        }
        // Super user can see all leads (no additional filter)
        
        $leads = $leadsQuery->orderBy('nama_pelanggan')->get();

        return Inertia::render('dokumens/general-create', [
            'leads' => $leads,
            'config' => [
                'dokumenKategori' => config('leads.dokumen_kategori'),
            ],
        ]);
    }

    public function generalStore(Request $request)
    {
        $validated = $request->validate([
            'leads_id' => 'required|exists:leads,id',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'kategori' => 'required|in:penawaran,sketsa_survey,lainnya',
            'file' => 'required|file|max:10240|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png',
        ]);

        $lead = Leads::findOrFail($validated['leads_id']);
        $user = auth()->user();
        
        // Check if user can add documents to this lead
        if ($user->role === 'marketing' && $lead->user_id !== $user->id) {
            abort(403, 'Anda tidak dapat menambah dokumen untuk lead ini.');
        } elseif ($user->role === 'supervisor') {
            $userBranchIds = $user->cabangs()->pluck('cabangs.id')->toArray();
            if (!in_array($lead->cabang_id, $userBranchIds)) {
                abort(403, 'Anda tidak dapat menambah dokumen untuk lead ini.');
            }
        }

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        
        // Store file directly in public directory as requested
        $filePath = $file->storeAs('dokumens', $fileName, 'public');

        Dokumen::create([
            'leads_id' => $lead->id,
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'],
            'kategori' => $validated['kategori'],
            'file_path' => $filePath,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('dokumens.all')
            ->with('success', 'Dokumen berhasil diupload.');
    }

    public function index(Leads $lead)
    {
        $user = auth()->user();
        
        // Check if user can access this lead's documents
        if ($user->role === 'marketing' && $lead->user_id !== $user->id) {
            abort(403, 'Anda tidak dapat melihat dokumen untuk lead ini.');
        } elseif ($user->role === 'supervisor') {
            $userBranchIds = $user->cabangs()->pluck('cabangs.id')->toArray();
            if (!in_array($lead->cabang_id, $userBranchIds)) {
                abort(403, 'Anda tidak dapat melihat dokumen untuk lead ini.');
            }
        }
        // Super user can access all documents (no additional check)

        $dokumens = $lead->dokumens()->with('user')->latest()->get();

        return Inertia::render('dokumens/index', [
            'lead' => $lead->load(['user', 'cabang']),
            'dokumens' => $dokumens,
            'config' => [
                'dokumenKategori' => config('leads.dokumen_kategori'),
            ],
        ]);
    }

    public function create(Leads $lead)
    {
        $user = auth()->user();
        
        // Check if user can add documents to this lead
        if ($user->role === 'marketing' && $lead->user_id !== $user->id) {
            abort(403, 'Anda tidak dapat menambah dokumen untuk lead ini.');
        } elseif ($user->role === 'supervisor') {
            $userBranchIds = $user->cabangs()->pluck('cabangs.id')->toArray();
            if (!in_array($lead->cabang_id, $userBranchIds)) {
                abort(403, 'Anda tidak dapat menambah dokumen untuk lead ini.');
            }
        }
        // Super user can add documents to all leads (no additional check)

        return Inertia::render('dokumens/create', [
            'lead' => $lead->load(['user', 'cabang']),
            'config' => [
                'dokumenKategori' => config('leads.dokumen_kategori'),
            ],
        ]);
    }

    public function store(Request $request, Leads $lead)
    {
        $user = auth()->user();
        
        // Check if user can add documents to this lead
        if ($user->role === 'marketing' && $lead->user_id !== $user->id) {
            abort(403, 'Anda tidak dapat menambah dokumen untuk lead ini.');
        } elseif ($user->role === 'supervisor') {
            $userBranchIds = $user->cabangs()->pluck('cabangs.id')->toArray();
            if (!in_array($lead->cabang_id, $userBranchIds)) {
                abort(403, 'Anda tidak dapat menambah dokumen untuk lead ini.');
            }
        }
        // Super user can add documents to all leads (no additional check)

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'kategori' => 'required|in:penawaran,sketsa_survey,lainnya',
            'file' => 'required|file|max:10240|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png',
        ]);

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        
        // Store file directly in public directory as requested
        $filePath = $file->storeAs('dokumens', $fileName, 'public');

        Dokumen::create([
            'leads_id' => $lead->id,
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'],
            'kategori' => $validated['kategori'],
            'file_path' => $filePath,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('dokumens.index', $lead)
            ->with('success', 'Dokumen berhasil diupload.');
    }

    public function show(Dokumen $dokumen)
    {
        $user = auth()->user();
        $lead = $dokumen->leads;
        
        // Check if user can view this document
        if ($user->role === 'marketing' && $lead->user_id !== $user->id) {
            abort(403, 'Anda tidak dapat melihat dokumen ini.');
        } elseif ($user->role === 'supervisor') {
            $userBranchIds = $user->cabangs()->pluck('cabangs.id')->toArray();
            if (!in_array($lead->cabang_id, $userBranchIds)) {
                abort(403, 'Anda tidak dapat melihat dokumen ini.');
            }
        }
        // Super user can view all documents (no additional check)

        $dokumen->load(['leads.user', 'leads.cabang', 'user']);

        return Inertia::render('dokumens/show', [
            'dokumen' => $dokumen,
        ]);
    }

    public function download(Dokumen $dokumen)
    {
        $user = auth()->user();
        $lead = $dokumen->leads;
        
        // Check if user can download this document
        if ($user->role === 'marketing' && $lead->user_id !== $user->id) {
            abort(403, 'Anda tidak dapat mengunduh dokumen ini.');
        } elseif ($user->role === 'supervisor') {
            $userBranchIds = $user->cabangs()->pluck('cabangs.id')->toArray();
            if (!in_array($lead->cabang_id, $userBranchIds)) {
                abort(403, 'Anda tidak dapat mengunduh dokumen ini.');
            }
        }
        // Super user can download all documents (no additional check)

        $filePath = storage_path('app/public/' . $dokumen->file_path);
        
        if (!file_exists($filePath)) {
            return back()->with('error', 'File tidak ditemukan.');
        }

        return response()->download($filePath, $dokumen->file_name);
    }

    public function destroy(Dokumen $dokumen)
    {
        $user = auth()->user();
        $lead = $dokumen->leads;
        
        // Check if user can delete this document
        if ($user->role === 'marketing' && $lead->user_id !== $user->id) {
            abort(403, 'Anda tidak dapat menghapus dokumen ini.');
        } elseif ($user->role === 'supervisor') {
            $userBranchIds = $user->cabangs()->pluck('cabangs.id')->toArray();
            if (!in_array($lead->cabang_id, $userBranchIds)) {
                abort(403, 'Anda tidak dapat menghapus dokumen ini.');
            }
        }
        // Super user can delete all documents (no additional check)

        // Delete file from storage
        if (Storage::disk('public')->exists($dokumen->file_path)) {
            Storage::disk('public')->delete($dokumen->file_path);
        }

        $dokumen->delete();

        return redirect()->route('dokumens.index', $dokumen->leads)
            ->with('success', 'Dokumen berhasil dihapus.');
    }
}
