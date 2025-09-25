<?php

namespace App\Http\Controllers;

use App\Models\KunjunganItem;
use App\Models\KunjunganItemCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KunjunganItemController extends Controller
{
    public function index()
    {
        $categories = KunjunganItemCategory::with(['kunjunganItems' => function ($query) {
            $query->orderBy('urutan');
        }])->orderBy('urutan')->get();

        return Inertia::render('kunjungan-items/index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('kunjungan-items/create', [
            'categories' => KunjunganItemCategory::where('is_active', true)->orderBy('urutan')->get(),
        ]);
    }

    public function store(Request $request)
    {
        // Create new category with items (simplified approach)
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'input_type' => 'required|in:radio,checkbox',
            'urutan' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'items' => 'array',
            'items.*.nama' => 'required|string|max:255',
            'items.*.deskripsi' => 'nullable|string',
            'items.*.urutan' => 'nullable|integer|min:0',
            'items.*.is_active' => 'boolean',
        ]);

        // Create category
        $category = KunjunganItemCategory::create([
            'nama' => $validated['nama'],
            'deskripsi' => $validated['deskripsi'],
            'input_type' => $validated['input_type'],
            'urutan' => $validated['urutan'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Create items
        foreach ($request->items ?? [] as $itemData) {
            KunjunganItem::create([
                'kunjungan_item_category_id' => $category->id,
                'nama' => $itemData['nama'],
                'deskripsi' => $itemData['deskripsi'] ?? null,
                'urutan' => $itemData['urutan'] ?? 0,
                'is_active' => $itemData['is_active'] ?? true,
            ]);
        }

        $message = 'Kategori dan ' . count($request->items ?? []) . ' item berhasil ditambahkan.';

        return to_route('kunjungan-items.index')->with('success', $message);
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        // Always edit categories with their items (simplified approach)
        $categoryId = str_replace('category-', '', $id);
        $category = KunjunganItemCategory::with(['kunjunganItems' => function ($query) {
            $query->orderBy('urutan');
        }])->findOrFail($categoryId);
        
        return Inertia::render('kunjungan-items/edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $categoryId = str_replace('category-', '', $id);
        $category = KunjunganItemCategory::findOrFail($categoryId);
        
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'input_type' => 'required|in:radio,checkbox',
            'urutan' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'items' => 'array',
            'items.*.id' => 'nullable', // Can be temp ID for new items
            'items.*.nama' => 'required|string|max:255',
            'items.*.deskripsi' => 'nullable|string',
            'items.*.urutan' => 'nullable|integer|min:0',
            'items.*.is_active' => 'boolean',
        ]);

        // Update category
        $category->update([
            'nama' => $validated['nama'],
            'deskripsi' => $validated['deskripsi'],
            'input_type' => $validated['input_type'],
            'urutan' => $validated['urutan'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Get current items to determine what to update/delete/create
        $existingItems = $category->kunjunganItems()->pluck('id')->toArray();
        $submittedItemIds = collect($request->items ?? [])
            ->pluck('id')
            ->filter(fn($id) => !str_starts_with($id, 'temp-'))
            ->toArray();

        // Delete items that are no longer in the submitted list
        $itemsToDelete = array_diff($existingItems, $submittedItemIds);
        if (!empty($itemsToDelete)) {
            KunjunganItem::whereIn('id', $itemsToDelete)->delete();
        }

        // Update or create items
        foreach ($request->items ?? [] as $itemData) {
            if (str_starts_with($itemData['id'], 'temp-')) {
                // Create new item
                KunjunganItem::create([
                    'kunjungan_item_category_id' => $category->id,
                    'nama' => $itemData['nama'],
                    'deskripsi' => $itemData['deskripsi'] ?? null,
                    'urutan' => $itemData['urutan'] ?? 0,
                    'is_active' => $itemData['is_active'] ?? true,
                ]);
            } else {
                // Update existing item
                $item = KunjunganItem::find($itemData['id']);
                if ($item && $item->kunjungan_item_category_id == $category->id) {
                    $item->update([
                        'nama' => $itemData['nama'],
                        'deskripsi' => $itemData['deskripsi'] ?? null,
                        'urutan' => $itemData['urutan'] ?? 0,
                        'is_active' => $itemData['is_active'] ?? true,
                    ]);
                }
            }
        }

        $message = 'Kategori dan item berhasil diperbarui.';

        return to_route('kunjungan-items.index')->with('success', $message);
    }

    public function destroy(string $id)
    {
        if (str_starts_with($id, 'category-')) {
            $categoryId = str_replace('category-', '', $id);
            $category = KunjunganItemCategory::findOrFail($categoryId);
            
            // Check if category has items
            if ($category->kunjunganItems()->count() > 0) {
                return back()->with('error', 'Tidak dapat menghapus kategori yang masih memiliki item. Hapus semua item terlebih dahulu.');
            }
            
            $category->delete();
            $message = 'Kategori berhasil dihapus.';
        } else {
            $item = KunjunganItem::findOrFail($id);
            
            // Check if item is being used in any kunjungan responses
            if ($item->kunjungans()->count() > 0) {
                return back()->with('error', 'Tidak dapat menghapus item yang sudah digunakan dalam kunjungan.');
            }
            
            $item->delete();
            $message = 'Item berhasil dihapus.';
        }

        return back()->with('success', $message);
    }
}
