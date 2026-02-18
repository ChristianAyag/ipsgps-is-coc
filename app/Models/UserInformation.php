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
    protected $casts = [
        'birthDate' => 'date',
        'userAge' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        // No defaults needed
    ];

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
        $parts = array_filter([
            $this->userBarangay,
            $this->userMunicipality,
            $this->userProvince
        ]);
        
        return implode(', ', $parts);
    }

    /**
     * Get formatted birth date.
     */
    public function getFormattedBirthDateAttribute(): string
    {
        if (!$this->birthDate) {
            return 'N/A';
        }
        
        return $this->birthDate->format('F j, Y');
    }

    /**
     * Get age with suffix (e.g., "25 years old").
     */
    public function getAgeWithSuffixAttribute(): string
    {
        if (!$this->userAge) {
            return 'N/A';
        }
        
        return $this->userAge . ' year' . ($this->userAge > 1 ? 's' : '') . ' old';
    }

    /**
     * Get ethnicity with proper formatting.
     */
    public function getFormattedEthnicityAttribute(): string
    {
        return $this->userEthnicity ? ucwords(strtolower($this->userEthnicity)) : 'N/A';
    }

    /**
     * Get location hierarchy.
     */
    public function getLocationHierarchyAttribute(): array
    {
        return [
            'province' => $this->userProvince,
            'municipality' => $this->userMunicipality,
            'barangay' => $this->userBarangay,
        ];
    }

    /**
     * Check if the user is from a specific location.
     */
    public function isFromLocation(string $province = null, string $municipality = null, string $barangay = null): bool
    {
        if ($province && $this->userProvince !== $province) {
            return false;
        }
        
        if ($municipality && $this->userMunicipality !== $municipality) {
            return false;
        }
        
        if ($barangay && $this->userBarangay !== $barangay) {
            return false;
        }
        
        return true;
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
     * Scope a query to filter by full location.
     */
    public function scopeFromLocation($query, string $province = null, string $municipality = null, string $barangay = null)
    {
        if ($province) {
            $query->where('userProvince', $province);
        }
        
        if ($municipality) {
            $query->where('userMunicipality', $municipality);
        }
        
        if ($barangay) {
            $query->where('userBarangay', $barangay);
        }
        
        return $query;
    }

    /**
     * Scope a query to filter by age range.
     */
    public function scopeAgeBetween($query, ?int $min, ?int $max)
    {
        if ($min && $max) {
            return $query->whereBetween('userAge', [$min, $max]);
        } elseif ($min) {
            return $query->where('userAge', '>=', $min);
        } elseif ($max) {
            return $query->where('userAge', '<=', $max);
        }
        
        return $query;
    }

    /**
     * Scope a query to filter by minimum age.
     */
    public function scopeMinAge($query, int $min)
    {
        return $query->where('userAge', '>=', $min);
    }

    /**
     * Scope a query to filter by maximum age.
     */
    public function scopeMaxAge($query, int $max)
    {
        return $query->where('userAge', '<=', $max);
    }

    /**
     * Scope a query to filter by ethnicity.
     */
    public function scopeWithEthnicity($query, string $ethnicity)
    {
        return $query->where('userEthnicity', $ethnicity);
    }

    /**
     * Scope a query to filter by multiple ethnicities.
     */
    public function scopeInEthnicities($query, array $ethnicities)
    {
        return $query->whereIn('userEthnicity', $ethnicities);
    }

    /**
     * Scope a query to filter by purpose.
     */
    public function scopeWithPurpose($query, string $purpose)
    {
        return $query->where('userPurpose', 'LIKE', "%{$purpose}%");
    }

    /**
     * Scope a query to filter by birth date range.
     */
    public function scopeBirthDateBetween($query, string $startDate, string $endDate)
    {
        return $query->whereBetween('birthDate', [$startDate, $endDate]);
    }

    /**
     * Scope a query to get users by age group.
     */
    public function scopeAgeGroup($query, string $group)
    {
        return match($group) {
            'minor' => $query->where('userAge', '<', 18),
            'adult' => $query->whereBetween('userAge', [18, 59]),
            'senior' => $query->where('userAge', '>=', 60),
            'youth' => $query->whereBetween('userAge', [15, 30]),
            default => $query,
        };
    }

    /**
     * Check if user is a minor.
     */
    public function isMinor(): bool
    {
        return $this->userAge && $this->userAge < 18;
    }

    /**
     * Check if user is an adult.
     */
    public function isAdult(): bool
    {
        return $this->userAge && $this->userAge >= 18;
    }

    /**
     * Check if user is a senior citizen.
     */
    public function isSenior(): bool
    {
        return $this->userAge && $this->userAge >= 60;
    }

    /**
     * Check if user is a youth.
     */
    public function isYouth(): bool
    {
        return $this->userAge && $this->userAge >= 15 && $this->userAge <= 30;
    }

    /**
     * Calculate age from birthDate (if needed to verify stored age).
     */
    public function calculateAge(): ?int
    {
        if (!$this->birthDate) {
            return null;
        }
        
        return $this->birthDate->age;
    }

    /**
     * Verify if the stored age matches calculated age.
     */
    public function verifyAge(): bool
    {
        if (!$this->birthDate || !$this->userAge) {
            return false;
        }
        
        return $this->calculateAge() === $this->userAge;
    }

    /**
     * Get location statistics for this user's area.
     */
    public function getLocationStatsAttribute(): array
    {
        return [
            'total_from_province' => self::fromProvince($this->userProvince)->count(),
            'total_from_municipality' => self::fromMunicipality($this->userMunicipality)->count(),
            'total_from_barangay' => self::fromBarangay($this->userBarangay)->count(),
        ];
    }

    /**
     * Get all unique provinces in the database.
     */
    public static function getAllProvinces(): array
    {
        return self::distinct()->pluck('userProvince')->filter()->values()->toArray();
    }

    /**
     * Get all unique municipalities in a province.
     */
    public static function getMunicipalitiesByProvince(string $province): array
    {
        return self::where('userProvince', $province)
            ->distinct()
            ->pluck('userMunicipality')
            ->filter()
            ->values()
            ->toArray();
    }

    /**
     * Get all unique barangays in a municipality.
     */
    public static function getBarangaysByMunicipality(string $province, string $municipality): array
    {
        return self::where('userProvince', $province)
            ->where('userMunicipality', $municipality)
            ->distinct()
            ->pluck('userBarangay')
            ->filter()
            ->values()
            ->toArray();
    }

    /**
     * Get all unique ethnicities.
     */
    public static function getAllEthnicities(): array
    {
        return self::distinct()->pluck('userEthnicity')->filter()->values()->toArray();
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

        // Auto-calculate age from birthDate if age is not provided
        static::saving(function ($model) {
            if ($model->birthDate && !$model->userAge) {
                $model->userAge = $model->birthDate->age;
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

    /**
     * Generate a sequential user information ID (alternative method).
     */
    protected static function generateSequentialUserInfoID(): string
    {
        $lastRecord = self::orderBy('userInfoID', 'desc')->first();

        if (!$lastRecord) {
            return 'INFO00001';
        }

        $lastNumber = (int) substr($lastRecord->userInfoID, 4);
        $nextNumber = $lastNumber + 1;

        return 'INFO' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }
}