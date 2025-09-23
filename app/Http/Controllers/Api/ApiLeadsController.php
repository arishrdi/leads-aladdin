<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SearchLeadsRequest;
use App\Http\Requests\Api\UpdateLeadStatusRequest;
use App\Http\Resources\LeadResource;
use App\Models\Leads;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ApiLeadsController extends Controller
{
    /**
     * Search leads by phone number (partial matching)
     * 
     * @param SearchLeadsRequest $request
     * @return JsonResponse
     */
    public function search(SearchLeadsRequest $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $phone = $request->validated('phone');
            $limit = $request->validated('limit', 20);
            $offset = $request->validated('offset', 0);

            // Build query with phone number search
            $query = Leads::with(['user', 'cabang', 'sumberLeads', 'tipeKarpet'])
                ->where('is_active', true)
                ->where('no_whatsapp', 'LIKE', "%{$phone}%");

            // Apply branch restrictions based on user role
            if ($user->isMarketing()) {
                // Marketing can only see leads from their assigned branches
                $userBranchIds = $user->cabangs()->pluck('cabangs.id')->toArray();
                $query->whereIn('cabang_id', $userBranchIds);
            } elseif ($user->isSupervisor()) {
                // Supervisor can see leads from their assigned branches
                $userBranchIds = $user->cabangs()->pluck('cabangs.id')->toArray();
                if (!empty($userBranchIds)) {
                    $query->whereIn('cabang_id', $userBranchIds);
                }
            }
            // Super user can see all leads (no additional restrictions)

            // Get total count before applying pagination
            $total = $query->count();

            // Apply pagination
            $leads = $query->orderBy('created_at', 'desc')
                ->offset($offset)
                ->limit($limit)
                ->get();

            // Log the search for audit purposes
            Log::info('API Lead Search', [
                'user_id' => $user->id,
                'phone_search' => $phone,
                'results_count' => $leads->count(),
                'total_matches' => $total,
            ]);

            return response()->json([
                'success' => true,
                'data' => LeadResource::collection($leads),
                'meta' => [
                    'total' => $total,
                    'limit' => $limit,
                    'offset' => $offset,
                    'phone_search' => $phone,
                ],
                'message' => "Found {$total} leads matching phone number: {$phone}"
            ]);

        } catch (\Exception $e) {
            Log::error('API Lead Search Error', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'phone' => $request->input('phone'),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while searching leads',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Update lead status
     * 
     * @param UpdateLeadStatusRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateStatus(UpdateLeadStatusRequest $request, int $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $validated = $request->validated();

            // Find the lead
            $lead = Leads::with(['user', 'cabang', 'sumberLeads', 'tipeKarpet'])
                ->where('is_active', true)
                ->findOrFail($id);

            // Check authorization based on user role and branch access
            if ($user->isMarketing()) {
                $userBranchIds = $user->cabangs()->pluck('cabangs.id')->toArray();
                if (!in_array($lead->cabang_id, $userBranchIds)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You do not have permission to update this lead'
                    ], 403);
                }
            } elseif ($user->isSupervisor()) {
                $userBranchIds = $user->cabangs()->pluck('cabangs.id')->toArray();
                if (!empty($userBranchIds) && !in_array($lead->cabang_id, $userBranchIds)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You do not have permission to update this lead'
                    ], 403);
                }
            }
            // Super user can update any lead

            $oldStatus = $lead->status;
            $newStatus = $validated['status'];

            // Update the lead status
            $lead->update([
                'status' => $newStatus,
            ]);

            // If notes are provided, you might want to create a follow-up or log entry
            // This depends on your business logic requirements

            // Log the status change for audit purposes
            Log::info('API Lead Status Update', [
                'user_id' => $user->id,
                'lead_id' => $lead->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'notes' => $validated['notes'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'data' => new LeadResource($lead->fresh(['user', 'cabang', 'sumberLeads', 'tipeKarpet'])),
                'message' => "Lead status updated from {$oldStatus} to {$newStatus}",
                'changes' => [
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                    'updated_by' => $user->name,
                    'updated_at' => now()->toISOString(),
                ]
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lead not found'
            ], 404);

        } catch (\Exception $e) {
            Log::error('API Lead Status Update Error', [
                'user_id' => auth()->id(),
                'lead_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating lead status',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get lead details by ID
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $user = auth()->user();

            // Find the lead
            $lead = Leads::with(['user', 'cabang', 'sumberLeads', 'tipeKarpet', 'followUps', 'dokumens'])
                ->where('is_active', true)
                ->findOrFail($id);

            // Check authorization based on user role and branch access
            if ($user->isMarketing()) {
                $userBranchIds = $user->cabangs()->pluck('cabangs.id')->toArray();
                if (!in_array($lead->cabang_id, $userBranchIds)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You do not have permission to view this lead'
                    ], 403);
                }
            } elseif ($user->isSupervisor()) {
                $userBranchIds = $user->cabangs()->pluck('cabangs.id')->toArray();
                if (!empty($userBranchIds) && !in_array($lead->cabang_id, $userBranchIds)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You do not have permission to view this lead'
                    ], 403);
                }
            }
            // Super user can view any lead

            return response()->json([
                'success' => true,
                'data' => new LeadResource($lead),
                'message' => 'Lead details retrieved successfully'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lead not found'
            ], 404);

        } catch (\Exception $e) {
            Log::error('API Lead Show Error', [
                'user_id' => auth()->id(),
                'lead_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving lead details',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}