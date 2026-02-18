<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserInformation extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'regs_userInformation';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'userInfoID';

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
        'userInfoID',
        'userID',
        'birthDate',
        'userAge',
        'userEthnicity',
        'userProvince',
        'userMunicipality',
        'userBarangay',
        'userPurpose',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'userAge' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns this information.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userID', 'userID');
    }

    /**
     * Get the full address (province, municipality, barangay combined)
     */
    public function getFullAddressAttribute(): string
    {
        return "{$this->userBarangay}, {$this->userMunicipality}, {$this->userProvince}";
    }

    /**
     * Get formatted birth date (if you want to customize format)
     */
    public function getFormattedBirthDateAttribute(): string
    {
        // Assuming birthDate is stored in YYYY-MM-DD format
        // Adjust this based on your actual date format
        return date('F j, Y', strtotime($this->birthDate));
    }

    /**
     * Scope a query to filter by province.
     */
    public function scopeFromProvince($query, string $province)
    {
        return $query->where('userProvince', $province);
    }

    /**
     * Scope a query to filter by municipality.
     */
    public function scopeFromMunicipality($query, string $municipality)
    {
        return $query->where('userMunicipality', $municipality);
    }

    /**
     * Scope a query to filter by barangay.
     */
    public function scopeFromBarangay($query, string $barangay)
    {
        return $query->where('userBarangay', $barangay);
    }

    /**
     * Scope a query to filter by age range.
     */
    public function scopeAgeBetween($query, int $min, int $max)
    {
        return $query->whereBetween('userAge', [$min, $max]);
    }

    /**
     * Scope a query to filter by ethnicity.
     */
    public function scopeWithEthnicity($query, string $ethnicity)
    {
        return $query->where('userEthnicity', $ethnicity);
    }

    /**
     * Scope a query to filter by purpose.
     */
    public function scopeWithPurpose($query, string $purpose)
    {
        return $query->where('userPurpose', 'LIKE', "%{$purpose}%");
    }

    /**
     * Check if user is from a specific region/province
     */
    public function isFrom(string $province): bool
    {
        return $this->userProvince === $province;
    }

    /**
     * Calculate age from birthDate (if needed)
     * Use this if you want to calculate age dynamically instead of storing it
     */
    public function calculateAge(): ?int
    {
        if (!$this->birthDate) {
            return null;
        }
        
        $birthDate = new \DateTime($this->birthDate);
        $today = new \DateTime();
        $age = $today->diff($birthDate)->y;
        
        return $age;
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate userInfoID if not provided
        static::creating(function ($model) {
            if (empty($model->userInfoID)) {
                $model->userInfoID = self::generateUserInfoID();
            }
        });
    }

    /**
     * Generate a unique user information ID.
     */
    protected static function generateUserInfoID(): string
    {
        $prefix = 'INFO';
        $timestamp = now()->format('YmdHis');
        $random = mt_rand(1000, 9999);
        
        return $prefix . $timestamp . $random;
    }
}