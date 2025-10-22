<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'name',
        'type',
        'file_path',
        'upload_date',
        'status',
        'expiry_date',
    ];

    protected $casts = [
        'upload_date' => 'date',
        'expiry_date' => 'date',
    ];

    /**
     * العلاقات
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Accessors
     */
    public function getFormattedUploadDateAttribute(): string
    {
        return $this->upload_date->format('Y-m-d');
    }

    public function getFormattedExpiryDateAttribute(): ?string
    {
        return $this->expiry_date ? $this->expiry_date->format('Y-m-d') : null;
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'valid' => 'صالح',
            'expired' => 'منتهي الصلاحية',
            'pending' => 'قيد المراجعة',
            default => $this->status
        };
    }

    public function getTypeNameAttribute(): string
    {
        return match($this->type) {
            'id_card' => 'بطاقة هوية',
            'passport' => 'جواز سفر',
            'contract' => 'عقد عمل',
            'certificate' => 'شهادة',
            'license' => 'رخصة',
            'other' => 'أخرى',
            default => $this->type
        };
    }

    public function getFileUrlAttribute(): string
    {
        return asset('storage/' . $this->file_path);
    }

    /**
     * Scopes
     */
    public function scopeValid($query)
    {
        return $query->where('status', 'valid');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeExpiringSoon($query, $days = 30)
    {
        return $query->where('status', 'valid')
                    ->where('expiry_date', '<=', now()->addDays($days))
                    ->where('expiry_date', '>=', now());
    }

    /**
     * Methods
     */
    public function isValid(): bool
    {
        return $this->status === 'valid';
    }

    public function isExpired(): bool
    {
        return $this->status === 'expired' || 
               ($this->expiry_date && $this->expiry_date < now());
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isExpiringSoon(int $days = 30): bool
    {
        return $this->status === 'valid' && 
               $this->expiry_date && 
               $this->expiry_date <= now()->addDays($days) && 
               $this->expiry_date >= now();
    }

    public function markAsValid(): void
    {
        $this->update(['status' => 'valid']);
    }

    public function markAsExpired(): void
    {
        $this->update(['status' => 'expired']);
    }

    public function markAsPending(): void
    {
        $this->update(['status' => 'pending']);
    }

    public function updateExpiryStatus(): void
    {
        if ($this->expiry_date && $this->expiry_date < now() && $this->status === 'valid') {
            $this->markAsExpired();
        }
    }

    public function getDaysUntilExpiry(): ?int
    {
        if (!$this->expiry_date) {
            return null;
        }

        return now()->diffInDays($this->expiry_date, false);
    }
}
