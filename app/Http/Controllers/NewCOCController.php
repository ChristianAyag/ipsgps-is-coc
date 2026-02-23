<?php

namespace App\Http\Controllers;

use App\Models\NewCOC;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;// For download return type

class NewCOCController extends Controller
{
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
                $q->where('userIPLeaderName', 'like', "%{$search}%")
                  ->orWhere('controlID', 'like', "%{$search}%");
            });
        }

        // Location filters
        $filters = ['region', 'province', 'municipality', 'barangay'];
        foreach ($filters as $filter) {
            if ($request->has($filter)) {
                $query->where("userIPLeader" . ucfirst($filter), $request->$filter);
            }
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
            'userID' => 'required|exists:tblUsers,userID',
            'userIPLeaderName' => 'required|string|max:255',
            'userIPLeaderRegion' => 'required|string|max:100',
            'userIPLeaderProvince' => 'required|string|max:100',
            'userIPLeaderMunicipality' => 'required|string|max:100',
            'userIPLeaderBarangay' => 'required|string|max:100',
            'userFatherName' => 'required|string|max:255',
            'userFatherEthnicity' => 'required|string|max:100',
            'userFatherOrigin' => 'required|string|max:255',
            'userMotherName' => 'required|string|max:255',
            'userMotherEthnicity' => 'required|string|max:100',
            'userMotherOrigin' => 'required|string|max:255',
            'userCMIDFile' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'userPhotoFile' => 'required|file|mimes:jpg,jpeg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            $controlID = 'COC' . now()->format('YmdHis') . mt_rand(1000, 9999);

            // Upload files
            $cmidFile = $request->file('userCMIDFile');
            $photoFile = $request->file('userPhotoFile');
            
            $cmidPath = $cmidFile->store("coc/{$controlID}", 'public');
            $photoPath = $photoFile->store("coc/{$controlID}", 'public');

            $coc = NewCOC::create([
                'controlID' => $controlID,
                'userID' => $request->userID,
                'userIPLeaderName' => $request->userIPLeaderName,
                'userIPLeaderRegion' => $request->userIPLeaderRegion,
                'userIPLeaderProvince' => $request->userIPLeaderProvince,
                'userIPLeaderDistrict' => $request->userIPLeaderDistrict,
                'userIPLeaderMunicipality' => $request->userIPLeaderMunicipality,
                'userIPLeaderBarangay' => $request->userIPLeaderBarangay,
                'userFatherName' => $request->userFatherName,
                'userFatherEthnicity' => $request->userFatherEthnicity,
                'userFatherOrigin' => $request->userFatherOrigin,
                'userMotherName' => $request->userMotherName,
                'userMotherEthnicity' => $request->userMotherEthnicity,
                'userMotherOrigin' => $request->userMotherOrigin,
                'userCMIDFileName' => $cmidFile->getClientOriginalName(),
                'userCMIDFilePath' => $cmidPath,
                'userPhotoFileName' => $photoFile->getClientOriginalName(),
                'userPhotoFilePath' => $photoPath,
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
            'userIPLeaderName' => 'sometimes|string|max:255',
            'userIPLeaderRegion' => 'sometimes|string|max:100',
            'userIPLeaderProvince' => 'sometimes|string|max:100',
            'userIPLeaderMunicipality' => 'sometimes|string|max:100',
            'userIPLeaderBarangay' => 'sometimes|string|max:100',
            'userFatherName' => 'sometimes|string|max:255',
            'userFatherEthnicity' => 'sometimes|string|max:100',
            'userFatherOrigin' => 'sometimes|string|max:255',
            'userMotherName' => 'sometimes|string|max:255',
            'userMotherEthnicity' => 'sometimes|string|max:100',
            'userMotherOrigin' => 'sometimes|string|max:255',
            'userCMIDFile' => 'sometimes|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'userPhotoFile' => 'sometimes|file|mimes:jpg,jpeg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            $data = $request->except(['userCMIDFile', 'userPhotoFile']);

            // Handle file updates
            if ($request->hasFile('userCMIDFile')) {
                Storage::disk('public')->delete($coc->userCMIDFilePath);
                
                $file = $request->file('userCMIDFile');
                $data['userCMIDFileName'] = $file->getClientOriginalName();
                $data['userCMIDFilePath'] = $file->store("coc/{$coc->controlID}", 'public');
            }

            if ($request->hasFile('userPhotoFile')) {
                Storage::disk('public')->delete($coc->userPhotoFilePath);
                
                $file = $request->file('userPhotoFile');
                $data['userPhotoFileName'] = $file->getClientOriginalName();
                $data['userPhotoFilePath'] = $file->store("coc/{$coc->controlID}", 'public');
            }

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
            // Delete files
            Storage::disk('public')->delete([$coc->userCMIDFilePath, $coc->userPhotoFilePath]);
            Storage::disk('public')->deleteDirectory("coc/{$coc->controlID}");
            
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
     * Download file.
     */
    public function downloadFile(string $id, string $type)
    {
        $coc = NewCOC::find($id);

        if (!$coc) {
            return response()->json([
                'success' => false,
                'message' => 'Record not found'
            ], 404);
        }

        $path = $type === 'cmid' ? $coc->userCMIDFilePath : $coc->userPhotoFilePath;
        $name = $type === 'cmid' ? $coc->userCMIDFileName : $coc->userPhotoFileName;

        if (!$path || !Storage::disk('public')->exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found'
            ], 404);
        }

        $fullPath = Storage::disk('public')->path($path);
        return response()->download($fullPath, $name);
    }
}