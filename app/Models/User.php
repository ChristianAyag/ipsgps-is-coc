<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\UserRoleAudit;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'login_users';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'userID';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The data type of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'userID',
        'firstName',
        'middleName',
        'surName',
        'userSuffixName',
        'userEmail',
        'userPassword',
        'userAccess',
        'userOffice',
        'last_login',
        'is_active',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'userPassword',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'userPassword' => 'hashed',
        'last_login' => 'datetime',
        'is_active' => 'boolean',
        'email_verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'is_active' => true,
    ];

    /**
     * Get the user role associated with the user.
     */
    public function userRole()
    {
        return $this->belongsTo(UserRole::class, 'userAccess', 'roleID');
    }

    /**
     * Get the user information for the user.
     */
    public function userInformation()
    {
        return $this->hasOne(UserInformation::class, 'userID', 'userID');
    }

    /**
     * Get the COC applications for the user.
     */
    public function cocApplications()
    {
        return $this->hasMany(ApplicationNewCOC::class, 'userID', 'userID');
    }

    /**
     * Get the role audit records for the user.
     */
    public function roleAudits()
    {
        return $this->hasMany(UserRoleAudit::class, 'userID', 'userID');
    }

    /**
     * Get the applications reviewed by the user.
     */
    public function reviewedApplications()
    {
        return $this->hasMany(ApplicationNewCOC::class, 'reviewed_by', 'userID');
    }

    /**
     * Get the applications approved by the user.
     */
    public function approvedApplications()
    {
        return $this->hasMany(ApplicationNewCOC::class, 'approved_by', 'userID');
    }

    /**
     * Get the applications released by the user.
     */
    public function releasedApplications()
    {
        return $this->hasMany(ApplicationNewCOC::class, 'released_by', 'userID');
    }

    /**
     * Get the documents uploaded by the user.
     */
    public function uploadedDocuments()
    {
        return $this->hasMany(ApplicationDocument::class, 'uploaded_by', 'userID');
    }

    /**
     * Get the documents verified by the user.
     */
    public function verifiedDocuments()
    {
        return $this->hasMany(ApplicationDocument::class, 'verified_by', 'userID');
    }

    /**
     * Get the status changes performed by the user.
     */
    public function statusChanges()
    {
        return $this->hasMany(ApplicationStatus::class, 'changed_by', 'userID');
    }

    /**
     * Get the application logs performed by the user.
     */
    public function applicationLogs()
    {
        return $this->hasMany(ApplicationLog::class, 'performed_by', 'userID');
    }

    /**
     * Get the role changes initiated by the user.
     */
    public function initiatedRoleChanges()
    {
        return $this->hasMany(UserRoleAudit::class, 'changed_by', 'userID');
    }

    /**
     * Check if user has admin access.
     */
    public function isAdmin(): bool
    {
        return $this->userRole && $this->userRole->roleName === 'admin';
    }

    /**
     * Check if user has reviewer access.
     */
    public function isReviewer(): bool
    {
        return $this->userRole && $this->userRole->roleName === 'reviewer';
    }

    /**
     * Check if user has approver access.
     */
    public function isApprover(): bool
    {
        return $this->userRole && $this->userRole->roleName === 'approver';
    }

    /**
     * Check if user has releaser access.
     */
    public function isReleaser(): bool
    {
        return $this->userRole && $this->userRole->roleName === 'releaser';
    }

    /**
     * Check if user has applicant access.
     */
    public function isApplicant(): bool
    {
        return $this->userRole && $this->userRole->roleName === 'applicant';
    }

    /**
     * Check if user has specific permission.
     */
    public function hasPermission(string $permission): bool
    {
        if (!$this->userRole || !$this->userRole->permissions) {
            return false;
        }
        
        $permissions = is_array($this->userRole->permissions) 
            ? $this->userRole->permissions 
            : json_decode($this->userRole->permissions, true);
        
        return isset($permissions[$permission]) && $permissions[$permission] === true;
    }

    /**
     * Check if user has specific access level (backward compatibility).
     */
    public function hasAccess(string $level): bool
    {
        return $this->userRole && $this->userRole->roleName === $level;
    }

    /**
     * Get user's full name.
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->firstName . ' ' . ($this->middleName ?? '') . ' ' . $this->surName);
    }

    /**
     * Get user's office location.
     */
    public function getOfficeDetailsAttribute(): ?string
    {
        if (!$this->userOffice) {
            return null;
        }
        
        return $this->userOffice . ' - ' . $this->fullName;
    }

    /**
     * Check if user account is active.
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Scope a query to only include active users.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include users with specific role.
     */
    public function scopeWithRole($query, string $roleName)
    {
        return $query->whereHas('userRole', function ($q) use ($roleName) {
            $q->where('roleName', $roleName);
        });
    }

    /**
     * Get the email field for authentication.
     */
    public function getEmailForVerification()
    {
        return $this->userEmail;
    }

    /**
     * Get the name of the unique identifier for the user.
     */
    public function getAuthIdentifierName()
    {
        return 'userID';
    }

    /**
     * Get the password for the user.
     */
    public function getAuthPassword()
    {
        return $this->userPassword;
    }

    /**
     * Get the email address used for password reset notifications.
     */
    public function getEmailForPasswordReset()
    {
        return $this->userEmail;
    }
}