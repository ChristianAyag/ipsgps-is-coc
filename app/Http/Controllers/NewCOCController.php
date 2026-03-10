<?php

namespace App\Http\Controllers;

use App\Models\NewCOC;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\Response;

class NewCOCController extends Controller
{
    /**
     * Show the COC application form (Inertia page).
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('User/COCApplication');
    }

    /**
     * Display a listing of COC records.
     */
    public function index(Request $request): JsonResponse
    {
        $query = NewCOC::with('user');

        // Simple search filter
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('IPLeaderName', 'like', "%{$search}%")
                  ->orWhere('controlID', 'like', "%{$search}%");
            });
        }

        // Location filters using model scope
        if ($request->has('region')) {
            $query->inLocation('region', $request->region);
        }
        if ($request->has('province')) {
            $query->inLocation('province', $request->province);
        }
        if ($request->has('municipality')) {
            $query->inLocation('municipality', $request->municipality);
        }
        if ($request->has('barangay')) {
            $query->inLocation('barangay', $request->barangay);
        }

        // Status filter
        if ($request->has('status')) {
            $query->where('currentStatus', $request->status);
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate(15)
        ]);
    }

    /**
     * Store a newly created COC record.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'userID' => 'required|exists:login_users,userID',
            'IPLeaderName' => 'required|string|max:255',
            'IPLeaderRegion' => 'required|string|max:100',
            'IPLeaderProvince' => 'required|string|max:100',
            'IPLeaderMunicipality' => 'required|string|max:100',
            'IPLeaderBarangay' => 'required|string|max:100',
            'IPLeaderDistrict' => 'nullable|string|max:100',
            'FatherName' => 'required|string|max:255',
            'FatherEthnicity' => 'required|string|max:100',
            'FatherOrigin' => 'required|string|max:255',
            'MotherName' => 'required|string|max:255',
            'MotherEthnicity' => 'required|string|max:100',
            'MotherOrigin' => 'required|string|max:255',
            'applicationType' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            // Create COC record with auto-generated control ID
            $coc = NewCOC::createWithID([
                'userID' => $request->userID,
                'IPLeaderName' => $request->IPLeaderName,
                'IPLeaderRegion' => $request->IPLeaderRegion,
                'IPLeaderProvince' => $request->IPLeaderProvince,
                'IPLeaderDistrict' => $request->IPLeaderDistrict,
                'IPLeaderMunicipality' => $request->IPLeaderMunicipality,
                'IPLeaderBarangay' => $request->IPLeaderBarangay,
                'FatherName' => $request->FatherName,
                'FatherEthnicity' => $request->FatherEthnicity,
                'FatherOrigin' => $request->FatherOrigin,
                'MotherName' => $request->MotherName,
                'MotherEthnicity' => $request->MotherEthnicity,
                'MotherOrigin' => $request->MotherOrigin,
                'applicationType' => $request->applicationType,
                'currentStatus' => 'submitted',
                'submitted_at' => now(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'COC record created successfully',
                'data' => $coc->load('user')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Creation failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified COC record.
     */
    public function show(string $id): JsonResponse
    {
        $coc = NewCOC::with('user')->find($id);

        if (!$coc) {
            return response()->json([
                'success' => false,
                'message' => 'COC record not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $coc
        ]);
    }

    /**
     * Update the specified COC record.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $coc = NewCOC::find($id);

        if (!$coc) {
            return response()->json([
                'success' => false,
                'message' => 'COC record not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'IPLeaderName' => 'sometimes|string|max:255',
            'IPLeaderRegion' => 'sometimes|string|max:100',
            'IPLeaderProvince' => 'sometimes|string|max:100',
            'IPLeaderMunicipality' => 'sometimes|string|max:100',
            'IPLeaderBarangay' => 'sometimes|string|max:100',
            'IPLeaderDistrict' => 'sometimes|nullable|string|max:100',
            'FatherName' => 'sometimes|string|max:255',
            'FatherEthnicity' => 'sometimes|string|max:100',
            'FatherOrigin' => 'sometimes|string|max:255',
            'MotherName' => 'sometimes|string|max:255',
            'MotherEthnicity' => 'sometimes|string|max:100',
            'MotherOrigin' => 'sometimes|string|max:255',
            'applicationType' => 'sometimes|nullable|string|max:100',
            'currentStatus' => 'sometimes|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            $data = $request->only([
                'IPLeaderName', 'IPLeaderRegion', 'IPLeaderProvince',
                'IPLeaderMunicipality', 'IPLeaderBarangay', 'IPLeaderDistrict',
                'FatherName', 'FatherEthnicity', 'FatherOrigin',
                'MotherName', 'MotherEthnicity', 'MotherOrigin',
                'applicationType', 'currentStatus',
            ]);

            $data['last_updated'] = now();

            $coc->update($data);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'COC record updated successfully',
                'data' => $coc->fresh('user')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Update failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified COC record.
     */
    public function destroy(string $id): JsonResponse
    {
        $coc = NewCOC::find($id);

        if (!$coc) {
            return response()->json([
                'success' => false,
                'message' => 'COC record not found'
            ], 404);
        }

        DB::beginTransaction();

        try {
            $coc->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'COC record deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Delete failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get COC records by user.
     */
    public function userRecords(string $userID): JsonResponse
    {
        $records = NewCOC::where('userID', $userID)->latest()->get();

        return response()->json([
            'success' => true,
            'count' => $records->count(),
            'data' => $records
        ]);
    }

    /**
     * Mark COC record as reviewed.
     */
    public function review(Request $request, string $id): JsonResponse
    {
        $coc = NewCOC::find($id);

        if (!$coc) {
            return response()->json([
                'success' => false,
                'message' => 'COC record not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'review_remarks' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $coc->update([
            'reviewed_by' => auth()->user()->userID ?? null,
            'reviewed_at' => now(),
            'review_remarks' => $request->review_remarks,
            'currentStatus' => 'reviewed',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'COC record marked as reviewed',
            'data' => $coc->fresh()
        ]);
    }

    /**
     * Mark COC record as approved.
     */
    public function approve(Request $request, string $id): JsonResponse
    {
        $coc = NewCOC::find($id);

        if (!$coc) {
            return response()->json([
                'success' => false,
                'message' => 'COC record not found'
            ], 404);
        }

        $coc->update([
            'approved_by' => auth()->user()->userID ?? null,
            'approved_at' => now(),
            'currentStatus' => 'approved',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'COC record approved',
            'data' => $coc->fresh()
        ]);
    }

    /**
     * Mark COC record as released.
     */
    public function release(Request $request, string $id): JsonResponse
    {
        $coc = NewCOC::find($id);

        if (!$coc) {
            return response()->json([
                'success' => false,
                'message' => 'COC record not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'released_to' => 'required|string|max:255',
            'released_to_relationship' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $coc->update([
            'released_by' => auth()->user()->userID ?? null,
            'released_to' => $request->released_to,
            'released_to_relationship' => $request->released_to_relationship,
            'release_date' => now(),
            'currentStatus' => 'released',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'COC record released',
            'data' => $coc->fresh()
        ]);
    }
}
