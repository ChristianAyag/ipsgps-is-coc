<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserInformation; // <-- ADD THIS
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB; // <-- ADD THIS FOR TRANSACTIONS

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
            'userEmail' => 'required|string|lowercase|email|max:255|unique:tblUsers,userEmail',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            
            // User Information table fields
            'birthDate' => 'required|string|max:20',
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
            // Generate a unique userID
            $userID = $this->generateUserID();

            // Create User
            $user = User::create([
                'userID' => $userID,
                'firstName' => $request->firstName,
                'middleName' => $request->middleName,
                'surName' => $request->surName,
                'userEmail' => $request->userEmail,
                'userPassword' => Hash::make($request->password),
                'userAccess' => 'Applicant', // Default value for new registrations
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
                        'userEmail' => $user->userEmail,
                        'userAccess' => $user->userAccess,
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
            return redirect(route('dashboard', absolute: false))->with('success', 'Registration completed successfully!');
            
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
     * Add a method to show user with their information (optional)
     */
    public function show($userID): JsonResponse
    {
        $user = User::with('userInformation')->where('userID', $userID)->first();
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    /**
     * Update user information (optional)
     */
    public function updateInformation(Request $request, $userID): JsonResponse
    {
        $user = User::where('userID', $userID)->first();
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        $request->validate([
            'birthDate' => 'sometimes|string|max:20',
            'userAge' => 'sometimes|integer|min:1|max:150',
            'userEthnicity' => 'sometimes|string|max:100',
            'userProvince' => 'sometimes|string|max:100',
            'userMunicipality' => 'sometimes|string|max:100',
            'userBarangay' => 'sometimes|string|max:100',
            'userPurpose' => 'sometimes|string|max:255',
        ]);
        
        $userInformation = $user->userInformation;
        
        if (!$userInformation) {
            // Create if doesn't exist
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
        } else {
            // Update existing
            $userInformation->update($request->only([
                'birthDate', 'userAge', 'userEthnicity', 
                'userProvince', 'userMunicipality', 'userBarangay', 'userPurpose'
            ]));
        }
        
        return response()->json([
            'message' => 'User information updated successfully',
            'data' => $userInformation
        ]);
    }
}