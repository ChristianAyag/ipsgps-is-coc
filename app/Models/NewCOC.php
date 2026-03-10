<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewCOC extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'application_newCOC';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'controlID';

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
        'controlID',
        'trackerID',
        'userID',
        'IPLeaderName',
        'IPLeaderRegion',
        'IPLeaderProvince',
        'IPLeaderDistrict',
        'IPLeaderMunicipality',
        'IPLeaderBarangay',
        'FatherName',
        'FatherEthnicity',
        'FatherOrigin',
        'MotherName',
        'MotherEthnicity',
        'MotherOrigin',
        'currentStatus',
        'previousControlID',
        'applicationType',
        'reviewed_by',
        'reviewed_at',
        'review_remarks',
        'approved_by',
        'approved_at',
        'released_by',
        'released_to',
        'released_to_relationship',
        'release_date',
        'submitted_at',
        'last_updated',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'reviewed_at' => 'datetime',
        'approved_at' => 'datetime',
        'release_date' => 'datetime',
        'submitted_at' => 'datetime',
        'last_updated' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'ip_leader_full_address',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        // no hidden columns
    ];

    /**
     * Get the user that owns this COC record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userID', 'userID');
    }

    /**
     * Previous application (if this is a follow‑up).
     */
    public function previous(): BelongsTo
    {
        return $this->belongsTo(self::class, 'previousControlID', 'controlID');
    }

    /**
     * User who reviewed the application (nullable).
     */
    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by', 'userID');
    }

    /**
     * User who approved the application (nullable).
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by', 'userID');
    }

    /**
     * User who released the application (nullable).
     */
    public function releasedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'released_by', 'userID');
    }

    /**
     * Get the full address of the IP Leader.
     */
    public function getIpLeaderFullAddressAttribute(): string
    {
        return implode(', ', array_filter([
            $this->IPLeaderBarangay,
            $this->IPLeaderMunicipality,
            $this->IPLeaderProvince,
            $this->IPLeaderRegion,
        ]));
    }

    // file-related accessors and helpers removed (not in migration)

    /**
     * Scope queries by location (region, province, municipality, barangay)
     */
    public function scopeInLocation($query, string $level, string $value): void
    {
        $column = match($level) {
            'region' => 'IPLeaderRegion',
            'province' => 'IPLeaderProvince',
            'municipality' => 'IPLeaderMunicipality',
            'city' => 'IPLeaderMunicipality',
            'barangay' => 'IPLeaderBarangay',
            'district' => 'IPLeaderDistrict',
            default => null
        };

        if ($column) {
            $query->where($column, $value);
        }
    }

    /**
     * Scope to search by name (IP Leader, father, or mother)
     */
    public function scopeSearchByName($query, string $type, string $search): void
    {
        $column = match($type) {
            'ip_leader' => 'IPLeaderName',
            'father' => 'FatherName',
            'mother' => 'MotherName',
            default => null
        };

        if ($column) {
            $query->where($column, 'LIKE', "%{$search}%");
        }
    }

    /**
     * Scope to filter by ethnicity (father or mother)
     */
    public function scopeByEthnicity($query, string $type, string $ethnicity): void
    {
        $column = match($type) {
            'father' => 'FatherEthnicity',
            'mother' => 'MotherEthnicity',
            default => null
        };

        if ($column) {
            $query->where($column, $ethnicity);
        }
    }

    // scopeHasFiles removed; no file columns exist

    /**
     * Delete associated files when model is deleted.
     */
    // booted method removed since no file paths need cleanup

    /**
     * Generate a unique control ID.
     */
    public static function generateControlID(): string
    {
        $prefix = 'COC';
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $maxIndex = strlen($characters) - 1;
        $random = '';

        for ($i = 0; $i < 6; $i++) {
            $random .= $characters[random_int(0, $maxIndex)];
        }

        return $prefix . $random;
    }

    /**
     * Generate a unique tracker ID.
     */
    public static function generateTrackerID(?string $region = null): string
    {
        $prefix = self::buildTrackerPrefix($region);
        $random = self::generateTrackerSuffix();

        return $prefix . '-' . $random;
    }

    /**
     * Generate random tracker suffix (7 chars, alphanumeric mixed-case).
     */
    protected static function generateTrackerSuffix(int $length = 7): string
    {
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        $maxIndex = strlen($characters) - 1;
        $suffix = '';

        for ($i = 0; $i < $length; $i++) {
            $suffix .= $characters[random_int(0, $maxIndex)];
        }

        return $suffix;
    }

    /**
     * Build a tracker prefix from region name/abbreviation.
     */
    protected static function buildTrackerPrefix(?string $region): string
    {
        if (!$region) {
            return 'R00';
        }

        $normalized = strtoupper(trim($region));
        $compact = preg_replace('/[^A-Z0-9]/', '', $normalized);

        if (preg_match('/\bBARMM\b/', $normalized) === 1) {
            return 'BARMM';
        }

        if (preg_match('/\bCARAGA\b/', $normalized) === 1) {
            return 'CARAGA';
        }

        if (preg_match('/\bCAR\b/', $normalized) === 1) {
            return 'CAR';
        }

        if (str_contains($normalized, 'NCR')) {
            return 'NCR';
        }

        // Region name aliases that may come from user info without "Region <n>" format.
        $nameToNumber = [
            'ILOCOSREGION' => 1,
            'CAGAYANVALLEY' => 2,
            'CENTRALLUZON' => 3,
            'CALABARZON' => 4,
            'MIMAROPA' => 4,
            'BICOLREGION' => 5,
            'WESTERNVISAYAS' => 6,
            'CENTRALVISAYAS' => 7,
            'EASTERNVISAYAS' => 8,
            'ZAMBOANGAPENINSULA' => 9,
            'NORTHERNMINDANAO' => 10,
            'DAVAOREGION' => 11,
            'SOCCSKSARGEN' => 12,
        ];
        foreach ($nameToNumber as $alias => $number) {
            if (str_contains($compact, $alias)) {
                return sprintf('R%02d', $number);
            }
        }

        // Accept values like "II", "IV-A", "02", "2" without the word "Region".
        if (preg_match('/^(0?[1-9]|1[0-2])$/', $compact) === 1) {
            return sprintf('R%02d', (int) $compact);
        }

        if (preg_match('/^(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII)$/', $compact) === 1) {
            $regionNumber = self::parseRegionNumber($compact);
            if ($regionNumber !== null) {
                return sprintf('R%02d', $regionNumber);
            }
        }

        if (str_starts_with($compact, 'IVA') || str_starts_with($compact, 'IVB')) {
            return 'R04';
        }

        if (preg_match('/\bREGION\s*([IVXLCDM]+|\d{1,2})\b/i', $normalized, $matches) === 1) {
            $regionNumber = self::parseRegionNumber($matches[1]);
            if ($regionNumber !== null) {
                return sprintf('R%02d', $regionNumber);
            }
        }

        if (preg_match('/\bR\s*(\d{1,2})\b/i', $normalized, $matches) === 1) {
            return sprintf('R%02d', (int) $matches[1]);
        }

        return 'R00';
    }

    /**
     * Parse a region token that can be arabic or roman numeral.
     */
    protected static function parseRegionNumber(string $token): ?int
    {
        $token = strtoupper(trim($token));

        if (ctype_digit($token)) {
            return (int) $token;
        }

        $romanMap = [
            'I' => 1,
            'V' => 5,
            'X' => 10,
            'L' => 50,
            'C' => 100,
            'D' => 500,
            'M' => 1000,
        ];

        $total = 0;
        $previousValue = 0;

        for ($index = strlen($token) - 1; $index >= 0; $index--) {
            $char = $token[$index];

            if (!isset($romanMap[$char])) {
                return null;
            }

            $currentValue = $romanMap[$char];
            if ($currentValue < $previousValue) {
                $total -= $currentValue;
            } else {
                $total += $currentValue;
                $previousValue = $currentValue;
            }
        }

        return $total > 0 ? $total : null;
    }

    /**
     * Fetch user region from regs_userInformation table.
     */
    protected static function resolveUserRegion(?string $userID): ?string
    {
        if (!$userID) {
            return null;
        }

        return UserInformation::query()
            ->where('userID', $userID)
            ->value('userRegion');
    }

    /**
     * Create a new COC record with auto-generated control ID.
     */
    public static function createWithID(array $attributes = []): self
    {
        // Ensure controlID, controlNumber and trackerID are provided
        if (empty($attributes['controlID'])) {
            $attributes['controlID'] = self::generateControlID();
        }

        $userRegion = self::resolveUserRegion($attributes['userID'] ?? null);
        $region = $userRegion ?? ($attributes['IPLeaderRegion'] ?? null);

        if ($userRegion) {
            $attributes['IPLeaderRegion'] = $userRegion;
        }

        if (empty($attributes['trackerID'])) {
            $attributes['trackerID'] = self::generateTrackerID($region);
        }

        return self::create($attributes);
    }
}
