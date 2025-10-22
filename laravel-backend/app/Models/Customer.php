<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_number',
        'name',
        'email',
        'phone',
        'phones',
        'address',
        'nationality',
        'customer_type',
        'id_number',
        'commercial_record',
        'status',
        'registration_date',
        'guarantor_name',
        'guarantor_phone',
        'guarantor_id',
        'guarantor_data',
        'notes',
        'warnings',
        'rating',
        'attachments',
        'id_card_copy',
        'guarantor_id_card_copy',
    ];

    protected $casts = [
        'phones' => 'array',
        'guarantor_data' => 'array',
        'registration_date' => 'date',
        'rating' => 'integer',
    ];

    /**
     * العلاقات
     */
    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(CustomerNote::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(CustomerComment::class);
    }

    public function deliveries(): HasMany
    {
        return $this->hasMany(Delivery::class);
    }

    public function claims(): HasMany
    {
        return $this->hasMany(Claim::class);
    }

    public function latePayments(): HasMany
    {
        return $this->hasMany(LatePayment::class);
    }

    /**
     * Accessors
     */
    public function getFormattedRegistrationDateAttribute(): string
    {
        return $this->registration_date->format('Y-m-d');
    }

    public function getTotalContractsCountAttribute(): int
    {
        return $this->contracts()->count();
    }

    public function getTotalPaymentsAmountAttribute(): float
    {
        return $this->payments()->sum('amount');
    }

    public function getPendingAmountAttribute(): float
    {
        return $this->contracts()->sum('total_after_discount') - $this->contracts()->sum('total_payments');
    }

    /**
     * Mutators
     */
    public function setPhonesAttribute($value): void
    {
        $this->attributes['phones'] = is_array($value) ? json_encode($value) : $value;
    }

    public function setGuarantorDataAttribute($value): void
    {
        $this->attributes['guarantor_data'] = is_array($value) ? json_encode($value) : $value;
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function scopeInactive($query)
    {
        return $query->where('status', 'INACTIVE');
    }

    public function scopeSuspended($query)
    {
        return $query->where('status', 'SUSPENDED');
    }

    public function scopeIndividual($query)
    {
        return $query->where('customer_type', 'INDIVIDUAL');
    }

    public function scopeCompany($query)
    {
        return $query->where('customer_type', 'COMPANY');
    }

    public function scopeByNationality($query, $nationality)
    {
        return $query->where('nationality', $nationality);
    }

    /**
     * Methods
     */
    public function hasWarnings(): bool
    {
        return !empty($this->warnings);
    }

    public function isActive(): bool
    {
        return $this->status === 'ACTIVE';
    }

    public function getFullAddressAttribute(): string
    {
        return trim($this->address . ' - ' . $this->nationality);
    }
}
