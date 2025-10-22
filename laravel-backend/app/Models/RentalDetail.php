<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RentalDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'start_date',
        'end_date',
        'duration',
        'duration_type',
        'item_code',
        'item_description',
        'daily_rate',
        'monthly_rate',
        'quantity',
        'total',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'duration' => 'integer',
        'daily_rate' => 'decimal:2',
        'monthly_rate' => 'decimal:2',
        'quantity' => 'integer',
        'total' => 'decimal:2',
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
    public function getFormattedStartDateAttribute(): string
    {
        return $this->start_date->format('Y-m-d');
    }

    public function getFormattedEndDateAttribute(): string
    {
        return $this->end_date->format('Y-m-d');
    }

    public function getDurationInDaysAttribute(): int
    {
        return $this->start_date->diffInDays($this->end_date);
    }

    public function getCalculatedTotalAttribute(): float
    {
        if ($this->duration_type === 'daily') {
            return $this->daily_rate * $this->quantity * $this->duration;
        } else {
            return $this->monthly_rate * $this->quantity * $this->duration;
        }
    }

    /**
     * Methods
     */
    public function calculateTotal(): float
    {
        $total = $this->calculated_total;
        $this->update(['total' => $total]);
        return $total;
    }

    public function isActive(): bool
    {
        $now = now()->toDateString();
        return $this->start_date <= $now && $this->end_date >= $now;
    }

    public function isExpired(): bool
    {
        return $this->end_date < now();
    }

    public function getDaysRemaining(): int
    {
        return max(0, now()->diffInDays($this->end_date, false));
    }
}
