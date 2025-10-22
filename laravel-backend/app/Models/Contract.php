<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_number',
        'contract_date',
        'customer_id',
        'customer_name',
        'delivery_address',
        'location_map_link',
        'total_contract_value',
        'transport_installation_cost',
        'total_discount',
        'total_after_discount',
        'total_payments',
        'contract_notes',
        'contract_type',
        'status',
        'start_date',
        'end_date',
        'created_by',
    ];

    protected $casts = [
        'contract_date' => 'date',
        'start_date' => 'date',
        'end_date' => 'date',
        'total_contract_value' => 'decimal:2',
        'transport_installation_cost' => 'decimal:2',
        'total_discount' => 'decimal:2',
        'total_after_discount' => 'decimal:2',
        'total_payments' => 'decimal:2',
    ];

    /**
     * العلاقات
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function paymentSchedules(): HasMany
    {
        return $this->hasMany(PaymentSchedule::class);
    }

    public function signatures(): HasMany
    {
        return $this->hasMany(ContractSignature::class);
    }

    public function rentalDetails(): HasMany
    {
        return $this->hasMany(RentalDetail::class);
    }

    public function deliveries(): HasMany
    {
        return $this->hasMany(Delivery::class);
    }

    /**
     * Accessors
     */
    public function getRemainingAmountAttribute(): float
    {
        return $this->total_after_discount - $this->total_payments;
    }

    public function getIsPaidAttribute(): bool
    {
        return $this->remaining_amount <= 0;
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->end_date < now() && $this->status === 'ACTIVE';
    }

    public function getDaysUntilExpiryAttribute(): int
    {
        return now()->diffInDays($this->end_date, false);
    }

    public function getFormattedContractDateAttribute(): string
    {
        return $this->contract_date->format('Y-m-d');
    }

    public function getFormattedStartDateAttribute(): string
    {
        return $this->start_date->format('Y-m-d');
    }

    public function getFormattedEndDateAttribute(): string
    {
        return $this->end_date->format('Y-m-d');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'EXPIRED');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'CANCELLED');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'COMPLETED');
    }

    public function scopeRental($query)
    {
        return $query->where('contract_type', 'RENTAL');
    }

    public function scopeSale($query)
    {
        return $query->where('contract_type', 'SALE');
    }

    public function scopeOverdue($query)
    {
        return $query->where('end_date', '<', now())
                    ->where('status', 'ACTIVE');
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('contract_date', [$startDate, $endDate]);
    }

    /**
     * Methods
     */
    public function isActive(): bool
    {
        return $this->status === 'ACTIVE';
    }

    public function isExpired(): bool
    {
        return $this->status === 'EXPIRED' || ($this->end_date < now() && $this->status === 'ACTIVE');
    }

    public function isOverdue(): bool
    {
        return $this->end_date < now() && $this->status === 'ACTIVE' && $this->remaining_amount > 0;
    }

    public function markAsExpired(): void
    {
        $this->update(['status' => 'EXPIRED']);
    }

    public function markAsCompleted(): void
    {
        $this->update(['status' => 'COMPLETED']);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'CANCELLED']);
    }

    public function updatePaymentTotal(): void
    {
        $totalPayments = $this->payments()->where('status', 'completed')->sum('amount');
        $this->update(['total_payments' => $totalPayments]);
    }
}
