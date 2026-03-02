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
        $timestamp = now()->format('YmdHis');
        $random = str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
        
        return $prefix . $timestamp . $random;
    }

    /**
     * Generate a unique tracker ID.
     */
    public static function generateTrackerID(): string
    {
        $prefix = 'TRK';
        $timestamp = now()->format('YmdHis');
        $random = str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);

        return $prefix . $timestamp . $random;
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

        if (empty($attributes['trackerID'])) {
            $attributes['trackerID'] = self::generateTrackerID();
        }

        return self::create($attributes);
    }
}