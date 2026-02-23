<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserInformation;
use App\Models\UserRole;
use App\Models\UserRoleAudit; // Add this if you're using audit logging
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        // Validate both user and user information
        $request->validate([
            // User table fields
            'firstName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'surName' => 'required|string|max:255',
            'userSuffixName' => 'nullable|string|max:50', // ADDED: suffix name
            'userEmail' => 'required|string|lowercase|email|max:255|unique:login_users,userEmail',
            'userPassword' => ['required', 'confirmed', Rules\Password::defaults()],

            // User Information table fields
            'birthDate' => 'required|date',
            'userAge' => 'required|integer|min:1|max:150',
            'userEthnicity' => 'required|string|max:100',
            'userProvince' => 'required|string|max:100',
            'userMunicipality' => 'required|string|max:100',
            'userBarangay' => 'required|string|max:100',
            'userPurpose' => 'required|string|max:255',
        ]);

        // Use database transaction to ensure both records are created successfully
        DB::beginTransaction();

        try {
            // Get the default role for new registrations (applicant)
            $defaultRole = UserRole::where('is_default', true)->first();
            
            if (!$defaultRole) {
                // Fallback to 'applicant' role if no default is set
                $defaultRole = UserRole::where('roleName', 'Applicant')->first();
            }

            // Generate a unique userID
            $userID = $this->generateUserID();

            // Create User - applicants don't have office
            $user = User::create([
                'userID' => $userID,
                'firstName' => $request->firstName,
                'middleName' => $request->middleName,
                'surName' => $request->surName,
                'userSuffixName' => $request->userSuffixName, // ADDED: suffix name
                'userEmail' => $request->userEmail,
                'userPassword' => Hash::make($request->userPassword),
                'userAccess' => $defaultRole ? $defaultRole->roleID : 'applicant',
                'userOffice' => null, // Always null for applicants
                'is_active' => true,
            ]);

            // Generate a unique userInfoID
            $userInfoID = $this->generateUserInfoID();

            // Create User Information
            $userInformation = UserInformation::create([
                'userInfoID' => $userInfoID,
                'userID' => $user->userID,
                'birthDate' => $request->birthDate,
                'userAge' => $request->userAge,
                'userEthnicity' => $request->userEthnicity,
                'userProvince' => $request->userProvince,
                'userMunicipality' => $request->userMunicipality,
                'userBarangay' => $request->userBarangay,
                'userPurpose' => $request->userPurpose,
            ]);

            DB::commit();

            event(new Registered($user));

            // Check if this is an API request
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'message' => 'User registered successfully',
                    'user' => [
                        'userID' => $user->userID,
                        'firstName' => $user->firstName,
                        'middleName' => $user->middleName,
                        'surName' => $user->surName,
                        'userSuffixName' => $user->userSuffixName, // ADDED: suffix name
                        'userEmail' => $user->userEmail,
                        'userAccess' => $user->userAccess,
                        'userOffice' => null, // Explicitly null for applicants
                        'is_active' => $user->is_active,
                        'userInformation' => [
                            'userInfoID' => $userInformation->userInfoID,
                            'birthDate' => $userInformation->birthDate,
                            'userAge' => $userInformation->userAge,
                            'userEthnicity' => $userInformation->userEthnicity,
                            'userProvince' => $userInformation->userProvince,
                            'userMunicipality' => $userInformation->userMunicipality,
                            'userBarangay' => $userInformation->userBarangay,
                            'userPurpose' => $userInformation->userPurpose,
                        ]
                    ]
                ], 201);
            }

            // Web request - log in and redirect to dashboard
            Auth::login($user);
            return redirect(route('login', absolute: false))->with('success', 'Registration completed successfully!');
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'message' => 'Registration failed',
                    'error' => $e->getMessage()
                ], 500);
            }
            
            return back()->withErrors(['error' => 'Registration failed: ' . $e->getMessage()]);
        }
    }

    /**
     * Admin function to create users (including staff/admin accounts)
     */
    public function adminStore(Request $request): JsonResponse|RedirectResponse
    {
        // Check if user is admin
        if (!Auth::user() || !Auth::user()->isAdmin()) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
            }
            return redirect()->back()->with('error', 'Unauthorized. Admin access required.');
        }

        // Validate with role selection
        $request->validate([
            // User table fields
            'firstName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'surName' => 'required|string|max:255',
            'userSuffixName' => 'nullable|string|max:50', // ADDED: suffix name
            'userEmail' => 'required|string|lowercase|email|max:255|unique:login_users,userEmail',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            // Office is required for non-applicant roles, optional/null for applicants
            'userOffice' => [
                'nullable',
                'string',
                'max:255',
                Rule::requiredIf(function () use ($request) {
                    return $request->userAccess && $request->userAccess !== 'applicant';
                }),
            ],
            'userAccess' => ['required', 'string', Rule::in(['admin', 'regional', 'provincial', 'applicant'])],
            'is_active' => 'boolean',
            
            // User Information table fields (optional for staff accounts)
            'birthDate' => 'nullable|date',
            'userAge' => 'nullable|integer|min:1|max:150',
            'userEthnicity' => 'nullable|string|max:100',
            'userProvince' => 'nullable|string|max:100',
            'userMunicipality' => 'nullable|string|max:100',
            'userBarangay' => 'nullable|string|max:100',
            'userPurpose' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            // Generate a unique userID
            $userID = $this->generateUserID();

            // Create User - only set office for non-applicant roles
            $user = User::create([
                'userID' => $userID,
                'firstName' => $request->firstName,
                'middleName' => $request->middleName,
                'surName' => $request->surName,
                'userSuffixName' => $request->userSuffixName, // ADDED: suffix name
                'userEmail' => $request->userEmail,
                'userPassword' => Hash::make($request->password),
                'userAccess' => $request->userAccess,
                'userOffice' => $request->userAccess === 'applicant' ? null : $request->userOffice,
                'is_active' => $request->is_active ?? true,
            ]);

            // Create User Information if any of the fields are provided
            if ($request->filled('birthDate') || $request->filled('userAge') || $request->filled('userEthnicity')) {
                $userInfoID = $this->generateUserInfoID();

                $userInformation = UserInformation::create([
                    'userInfoID' => $userInfoID,
                    'userID' => $user->userID,
                    'birthDate' => $request->birthDate,
                    'userAge' => $request->userAge,
                    'userEthnicity' => $request->userEthnicity,
                    'userProvince' => $request->userProvince,
                    'userMunicipality' => $request->userMunicipality,
                    'userBarangay' => $request->userBarangay,
                    'userPurpose' => $request->userPurpose,
                ]);
            }

            // Log role change if needed
            // UserRoleAudit::logChange(...);

            DB::commit();

            event(new Registered($user));

            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'message' => 'User created successfully',
                    'user' => [
                        'userID' => $user->userID,
                        'firstName' => $user->firstName,
                        'middleName' => $user->middleName,
                        'surName' => $user->surName,
                        'userSuffixName' => $user->userSuffixName, // ADDED: suffix name
                        'userEmail' => $user->userEmail,
                        'userAccess' => $user->userAccess,
                        'userOffice' => $user->userOffice, // Will be null for applicants
                        'is_active' => $user->is_active,
                        'userInformation' => isset($userInformation) ? [
                            'userInfoID' => $userInformation->userInfoID,
                            'birthDate' => $userInformation->birthDate,
                            'userAge' => $userInformation->userAge,
                            'userEthnicity' => $userInformation->userEthnicity,
                            'userProvince' => $userInformation->userProvince,
                            'userMunicipality' => $userInformation->userMunicipality,
                            'userBarangay' => $userInformation->userBarangay,
                            'userPurpose' => $userInformation->userPurpose,
                        ] : null
                    ]
                ], 201);
            }

            return redirect()->route('admin.users.index')
                ->with('success', 'User created successfully!');
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'message' => 'User creation failed',
                    'error' => $e->getMessage()
                ], 500);
            }
            
            return back()->withErrors(['error' => 'User creation failed: ' . $e->getMessage()]);
        }
    }

    /**
     * Admin function to update user
     */
    public function adminUpdate(Request $request, $userID): JsonResponse|RedirectResponse
    {
        // Check if user is admin
        if (!Auth::user() || !Auth::user()->isAdmin()) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
            }
            return redirect()->back()->with('error', 'Unauthorized. Admin access required.');
        }

        $user = User::findOrFail($userID);

        $request->validate([
            'firstName' => 'sometimes|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'surName' => 'sometimes|string|max:255',
            'userSuffixName' => 'nullable|string|max:50', // ADDED: suffix name
            'userEmail' => ['sometimes', 'string', 'lowercase', 'email', 'max:255', Rule::unique('login_users', 'userEmail')->ignore($user->userID, 'userID')],
            'userOffice' => [
                'nullable',
                'string',
                'max:255',
                Rule::requiredIf(function () use ($request, $user) {
                    $newRole = $request->userAccess ?? $user->userAccess;
                    return $newRole !== 'applicant';
                }),
            ],
            'userAccess' => ['sometimes', 'string', Rule::in(['admin', 'regional', 'provincial', 'applicant'])],
            'is_active' => 'boolean',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        DB::beginTransaction();

        try {
            $oldRole = $user->userAccess;
            $newRole = $request->userAccess ?? $oldRole;
            
            // Prepare update data
            $updateData = $request->only([
                'firstName', 'middleName', 'surName', 'userSuffixName', 'userEmail', 'is_active' // ADDED: userSuffixName
            ]);
            
            // Add userAccess if provided
            if ($request->has('userAccess')) {
                $updateData['userAccess'] = $request->userAccess;
            }
            
            // Handle office field based on role
            if ($newRole === 'applicant') {
                // If role is applicant, set office to null
                $updateData['userOffice'] = null;
            } elseif ($request->has('userOffice')) {
                // If non-applicant role and office provided, use it
                $updateData['userOffice'] = $request->userOffice;
            }
            
            // Update user fields
            $user->fill($updateData);

            if ($request->filled('password')) {
                $user->userPassword = Hash::make($request->password);
            }

            $user->save();

            // Log role change if applicable
            if ($oldRole !== $user->userAccess) {
                // UserRoleAudit::logChange(...);
            }

            DB::commit();

            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'message' => 'User updated successfully',
                    'user' => $user->load('userRole', 'userInformation')
                ]);
            }

            return redirect()->route('admin.users.index')
                ->with('success', 'User updated successfully!');
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'message' => 'User update failed',
                    'error' => $e->getMessage()
                ], 500);
            }
            
            return back()->withErrors(['error' => 'User update failed: ' . $e->getMessage()]);
        }
    }

    /**
     * Admin function to list users with filters
     */
    public function adminIndex(Request $request): JsonResponse|Response
    {
        // Check if user is admin
        if (!Auth::user() || !Auth::user()->isAdmin()) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
            }
            return redirect()->back()->with('error', 'Unauthorized. Admin access required.');
        }

        $users = User::with(['userRole', 'userInformation'])
            ->when($request->role, function ($query, $role) {
                return $query->where('userAccess', $role);
            })
            ->when($request->status, function ($query, $status) {
                return $query->where('is_active', $status === 'active');
            })
            ->when($request->has_office, function ($query, $hasOffice) {
                if ($hasOffice === 'true') {
                    return $query->whereNotNull('userOffice');
                } elseif ($hasOffice === 'false') {
                    return $query->whereNull('userOffice');
                }
            })
            ->when($request->search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('firstName', 'like', "%{$search}%")
                      ->orWhere('middleName', 'like', "%{$search}%")
                      ->orWhere('surName', 'like', "%{$search}%")
                      ->orWhere('userSuffixName', 'like', "%{$search}%") // ADDED: search in suffix
                      ->orWhere('userEmail', 'like', "%{$search}%")
                      ->orWhere('userID', 'like', "%{$search}%");
                });
            })
            ->orderBy($request->sort_by ?? 'created_at', $request->sort_direction ?? 'desc')
            ->paginate($request->per_page ?? 15);

        if ($request->is('api/*') || $request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'data' => $users
            ]);
        }

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => UserRole::all()
        ]);
    }

    /**
     * Get available roles for dropdown
     */
    public function getRoles(Request $request): JsonResponse
    {
        $roles = UserRole::select('roleID', 'roleName', 'roleDescription')->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $roles
        ]);
    }

    /**
     * Generate a unique user ID.
     */
    protected function generateUserID(): string
    {
        $prefix = 'USR';
        $timestamp = now()->format('Y');
        $random = mt_rand(10000, 99999);
        
        return $prefix . $timestamp . $random;
    }

    /**
     * Generate a unique user information ID.
     */
    protected function generateUserInfoID(): string
    {
        // Get the latest userInfoID
        $lastRecord = UserInformation::orderBy('userInfoID', 'desc')->first();

        if (!$lastRecord) {
            // If no record exists, start at INFO00001
            return 'INFO00001';
        }

        // Extract the numeric part (after INFO)
        $lastNumber = (int) substr($lastRecord->userInfoID, 4);
        $nextNumber = $lastNumber + 1;

        // Format with leading zeros (5 digits)
        return 'INFO' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }

    /**
     * Show user with their information
     */
    public function show($userID): JsonResponse
    {
        $user = User::with(['userRole', 'userInformation'])->where('userID', $userID)->first();
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    /**
     * Toggle user active status (admin only)
     */
    public function toggleStatus(Request $request, $userID): JsonResponse|RedirectResponse
    {
        // Check if user is admin
        if (!Auth::user() || !Auth::user()->isAdmin()) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
            }
            return redirect()->back()->with('error', 'Unauthorized. Admin access required.');
        }

        $user = User::findOrFail($userID);
        $user->is_active = !$user->is_active;
        $user->save();

        if ($request->is('api/*') || $request->wantsJson()) {
            return response()->json([
                'message' => 'User status updated successfully',
                'is_active' => $user->is_active
            ]);
        }

        return redirect()->back()->with('success', 'User status updated successfully!');
    }
}