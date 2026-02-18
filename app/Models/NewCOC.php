<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class NewCOC extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tblNewCOC';

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
        'userID',
        'userIPLeaderName',
        'userIPLeaderRegion',
        'userIPLeaderProvince',
        'userIPLeaderDistrict',
        'userIPLeaderMunicipality',
        'userIPLeaderBarangay',
        'userFatherName',
        'userFatherEthnicity',
        'userFatherOrigin',
        'userMotherName',
        'userMotherEthnicity',
        'userMotherOrigin',
        'userCMIDFileName',
        'userCMIDFilePath',
        'userPhotoFileName',
        'userPhotoFilePath',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'ip_leader_full_address',
        'cmid_full_url',
        'photo_full_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'userCMIDFilePath',
        'userPhotoFilePath',
    ];

    /**
     * Get the user that owns this COC record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userID', 'userID');
    }

    /**
     * Get the full address of the IP Leader.
     */
    public function getIPLeaderFullAddressAttribute(): string
    {
        return implode(', ', array_filter([
            $this->userIPLeaderBarangay,
            $this->userIPLeaderMunicipality,
            $this->userIPLeaderProvince,
            $this->userIPLeaderRegion,
        ]));
    }

    /**
     * Get the full URL for CMID file.
     */
    public function getCmidFullUrlAttribute(): ?string
    {
        return $this->userCMIDFilePath 
            ? Storage::url($this->userCMIDFilePath) 
            : null;
    }

    /**
     * Get the full URL for photo file.
     */
    public function getPhotoFullUrlAttribute(): ?string
    {
        return $this->userPhotoFilePath 
            ? Storage::url($this->userPhotoFilePath) 
            : null;
    }

    /**
     * Check if CMID file exists.
     */
    public function hasCMIDFile(): bool
    {
        return $this->userCMIDFilePath && Storage::exists($this->userCMIDFilePath);
    }

    /**
     * Check if photo file exists.
     */
    public function hasPhotoFile(): bool
    {
        return $this->userPhotoFilePath && Storage::exists($this->userPhotoFilePath);
    }

    /**
     * Scope queries by location (region, province, municipality, barangay)
     */
    public function scopeInLocation($query, string $level, string $value): void
    {
        $column = match($level) {
            'region' => 'userIPLeaderRegion',
            'province' => 'userIPLeaderProvince',
            'municipality' => 'userIPLeaderMunicipality',
            'city' => 'userIPLeaderMunicipality',
            'barangay' => 'userIPLeaderBarangay',
            'district' => 'userIPLeaderDistrict',
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
            'ip_leader' => 'userIPLeaderName',
            'father' => 'userFatherName',
            'mother' => 'userMotherName',
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
            'father' => 'userFatherEthnicity',
            'mother' => 'userMotherEthnicity',
            default => null
        };

        if ($column) {
            $query->where($column, $ethnicity);
        }
    }

    /**
     * Scope to get records with files
     */
    public function scopeHasFiles($query): void
    {
        $query->where(function($q) {
            $q->whereNotNull('userCMIDFilePath')
              ->orWhereNotNull('userPhotoFilePath');
        });
    }

    /**
     * Delete associated files when model is deleted.
     */
    protected static function booted(): void
    {
        static::deleting(function ($model) {
            $files = array_filter([
                $model->userCMIDFilePath,
                $model->userPhotoFilePath,
            ]);

            foreach ($files as $file) {
                if (Storage::exists($file)) {
                    Storage::delete($file);
                }
            }
        });
    }

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
     * Create a new COC record with auto-generated control ID.
     */
    public static function createWithID(array $attributes = []): self
    {
        $attributes['controlID'] = self::generateControlID();
        return self::create($attributes);
    }
}