<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContractSignature extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'signature_data',
        'signer_name',
        'signed_at',
    ];

    protected $casts = [
        'signed_at' => 'datetime',
    ];

    /**
     * العلاقات
     */
    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    /**
     * Accessors
     */
    public function getFormattedSignedAtAttribute(): string
    {
        return $this->signed_at->format('Y-m-d H:i:s');
    }

    /**
     * Methods
     */
    public function getSignatureImageAttribute(): string
    {
        // إرجاع مسار صورة التوقيع
        return $this->signature_data;
    }

    public function isValid(): bool
    {
        // التحقق من صحة التوقيع
        return !empty($this->signature_data) && !empty($this->signer_name);
    }
}
