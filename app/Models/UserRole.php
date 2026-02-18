<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_roles';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'roleID';

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
     * @var array<string>
     */
    protected $fillable = [
        'roleID',
        'roleName',
        'roleDescription',
        'permissions',
        'is_default',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'permissions' => 'array',
        'is_default' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'is_default' => false,
    ];

    /**
     * Get the users for this role.
     */
    public function users()
    {
        return $this->hasMany(User::class, 'userAccess', 'roleID');
    }

    /**
     * Get the role audit records for this role.
     */
    public function roleAudits()
    {
        return $this->hasMany(UserRoleAudit::class, 'old_roleID', 'roleID');
    }

    /**
     * Get the new role audit records for this role.
     */
    public function newRoleAudits()
    {
        return $this->hasMany(UserRoleAudit::class, 'new_roleID', 'roleID');
    }

    /**
     * Check if role has a specific permission.
     */
    public function hasPermission(string $permission): bool
    {
        if (!$this->permissions) {
            return false;
        }

        $permissions = is_array($this->permissions) 
            ? $this->permissions 
            : json_decode($this->permissions, true);

        return isset($permissions[$permission]) && $permissions[$permission] === true;
    }

    /**
     * Get all permissions as array.
     */
    public function getPermissionsArrayAttribute(): array
    {
        if (!$this->permissions) {
            return [];
        }

        return is_array($this->permissions) 
            ? $this->permissions 
            : json_decode($this->permissions, true);
    }

    /**
     * Get permission names that are enabled.
     */
    public function getEnabledPermissionsAttribute(): array
    {
        $permissions = $this->permissions_array;
        
        return array_keys(array_filter($permissions, function ($value) {
            return $value === true;
        }));
    }

    /**
     * Check if this is the default role for new users.
     */
    public function isDefault(): bool
    {
        return $this->is_default;
    }

    /**
     * Scope a query to only include default role.
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Scope a query to only include roles with specific permission.
     */
    public function scopeWithPermission($query, string $permission)
    {
        return $query->where(function ($q) use ($permission) {
            // This is a simplified scope - for production, you might want
            // to implement a more sophisticated JSON query
            $q->whereRaw('JSON_EXTRACT(permissions, "$.' . $permission . '") = true');
        });
    }

    /**
     * Get the role name with proper formatting.
     */
    public function getFormattedNameAttribute(): string
    {
        return ucwords(str_replace('_', ' ', $this->roleName));
    }

    /**
     * Get role statistics.
     */
    public function getUserCountAttribute(): int
    {
        return $this->users()->count();
    }

    /**
     * Get role description with fallback.
     */
    public function getDescriptionAttribute(): ?string
    {
        return $this->roleDescription ?? 'No description available.';
    }
}