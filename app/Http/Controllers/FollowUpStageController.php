<?php

namespace App\Http\Controllers;

use App\Models\FollowUpStage;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class FollowUpStageController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $this->authorize('viewAny', FollowUpStage::class);

        $stages = FollowUpStage::orderBy('display_order')
            ->get()
            ->map(function ($stage) {
                return [
                    'id' => $stage->id,
                    'key' => $stage->key,
                    'name' => $stage->name,
                    'display_order' => $stage->display_order,
                    'next_stage_key' => $stage->next_stage_key,
                    'is_active' => $stage->is_active,
                    'followup_count' => $stage->followUps()->count(),
                    'created_at' => $stage->created_at,
                    'updated_at' => $stage->updated_at,
                ];
            });

        return Inertia::render('follow-up-stages/index', [
            'stages' => $stages,
            'availableStageKeys' => $stages->pluck('key'),
        ]);
    }

    public function create()
    {
        $this->authorize('create', FollowUpStage::class);

        $stages = FollowUpStage::where('is_active', true)
            ->orderBy('display_order')
            ->get(['key', 'name']);

        return Inertia::render('follow-up-stages/create', [
            'availableStages' => $stages,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', FollowUpStage::class);

        $request->validate([
            'key' => 'required|string|max:50|unique:follow_up_stages,key',
            'name' => 'required|string|max:100',
            'next_stage_key' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        // Custom validation for next_stage_key
        if ($request->next_stage_key && $request->next_stage_key !== '' && $request->next_stage_key !== 'null' && !FollowUpStage::where('key', $request->next_stage_key)->exists()) {
            return back()->withErrors(['next_stage_key' => 'The selected next stage key is invalid.']);
        }

        $maxOrder = FollowUpStage::max('display_order') ?? 0;

        $stage = FollowUpStage::create([
            'key' => $request->key,
            'name' => $request->name,
            'display_order' => $maxOrder + 1,
            'next_stage_key' => ($request->next_stage_key === 'null' || !$request->next_stage_key) ? null : $request->next_stage_key,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->route('follow-up-stages.index')
            ->with('success', 'Tahap follow-up berhasil dibuat.');
    }

    public function show(FollowUpStage $followUpStage)
    {
        $this->authorize('view', $followUpStage);

        return Inertia::render('follow-up-stages/show', [
            'stage' => [
                'id' => $followUpStage->id,
                'key' => $followUpStage->key,
                'name' => $followUpStage->name,
                'display_order' => $followUpStage->display_order,
                'next_stage_key' => $followUpStage->next_stage_key,
                'is_active' => $followUpStage->is_active,
                'followup_count' => $followUpStage->followUps()->count(),
                'created_at' => $followUpStage->created_at,
                'updated_at' => $followUpStage->updated_at,
            ],
        ]);
    }

    public function edit(FollowUpStage $followUpStage)
    {
        $this->authorize('update', $followUpStage);

        $stages = FollowUpStage::where('is_active', true)
            ->where('key', '!=', $followUpStage->key)
            ->orderBy('display_order')
            ->get(['key', 'name']);

        return Inertia::render('follow-up-stages/edit', [
            'stage' => [
                'id' => $followUpStage->id,
                'key' => $followUpStage->key,
                'name' => $followUpStage->name,
                'next_stage_key' => $followUpStage->next_stage_key,
                'is_active' => $followUpStage->is_active,
            ],
            'availableStages' => $stages,
        ]);
    }

    public function update(Request $request, FollowUpStage $followUpStage)
    {
        $this->authorize('update', $followUpStage);

        $request->validate([
            'key' => [
                'required',
                'string',
                'max:50',
                Rule::unique('follow_up_stages', 'key')->ignore($followUpStage->id),
            ],
            'name' => 'required|string|max:100',
            'next_stage_key' => 'nullable|string|different:key',
            'is_active' => 'boolean',
        ]);

        // Custom validation for next_stage_key
        if ($request->next_stage_key && $request->next_stage_key !== '' && $request->next_stage_key !== 'null' && !FollowUpStage::where('key', $request->next_stage_key)->exists()) {
            return back()->withErrors(['next_stage_key' => 'The selected next stage key is invalid.']);
        }

        $followUpStage->update([
            'key' => $request->key,
            'name' => $request->name,
            'next_stage_key' => ($request->next_stage_key === 'null' || !$request->next_stage_key) ? null : $request->next_stage_key,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->route('follow-up-stages.index')
            ->with('success', 'Tahap follow-up berhasil diperbarui.');
    }

    public function destroy(FollowUpStage $followUpStage)
    {
        $this->authorize('delete', $followUpStage);

        $followupCount = $followUpStage->followUps()->count();
        
        if ($followupCount > 0) {
            return redirect()->back()
                ->withErrors(['error' => 'Tidak dapat menghapus tahap yang sudah memiliki follow-up.']);
        }

        $followUpStage->delete();

        return redirect()->route('follow-up-stages.index')
            ->with('success', 'Tahap follow-up berhasil dihapus.');
    }

    public function updateOrder(Request $request)
    {
        $this->authorize('update', FollowUpStage::class);

        $request->validate([
            'stages' => 'required|array',
            'stages.*.id' => 'required|exists:follow_up_stages,id',
            'stages.*.display_order' => 'required|integer',
        ]);

        foreach ($request->stages as $stageData) {
            FollowUpStage::where('id', $stageData['id'])
                ->update(['display_order' => $stageData['display_order']]);
        }

        return response()->json(['success' => true]);
    }
}
