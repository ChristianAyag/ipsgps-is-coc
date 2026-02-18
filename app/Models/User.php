<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

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
        'userEmail',
        'userPassword',
        'userAccess',
        'userOffice', // <-- ADD THIS LINE
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
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'userPassword' => 'hashed',
        ];
    }

    /**
     * Check if user has admin access
     */
    public function isAdmin(): bool
    {
        return $this->userAccess === 'admin';
    }

    /**
     * Check if user has specific access level
     */
    public function hasAccess(string $level): bool
    {
        return $this->userAccess === $level;
    }

    /**
     * Get user's full name
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->firstName . ' ' . ($this->middleName ?? '') . ' ' . $this->surName);
    }

    /**
     * Get user's office location (if you want to combine office with other info)
     */
    public function getOfficeDetailsAttribute(): ?string
    {
        if (!$this->userOffice) {
            return null;
        }
        
        return $this->userOffice . ' - ' . $this->fullName;
    }
}