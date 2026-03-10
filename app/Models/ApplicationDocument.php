<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationDocument extends Model
{
    use HasFactory;

    protected $table = 'application_documents';

    protected $primaryKey = 'docID';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'docID',
        'controlID',
        'docType',
        'fileName',
        'filePath',
        'uploaded_at',
        'uploaded_by',
        'isVerified',
        'verified_at',
        'verified_by',
        'verification_remarks',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
        'isVerified' => 'boolean',
        'verified_at' => 'datetime',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(NewCOC::class, 'controlID', 'controlID');
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by', 'userID');
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by', 'userID');
    }
}

