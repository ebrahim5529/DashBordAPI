<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_number',
        'name',
        'email',
        'phone',
        'address',
        'nationality',
        'supplier_type',
        'commercial_record',
        'tax_number',
        'status',
        'registration_date',
        'contact_person',
        'contact_person_phone',
        'contact_person_email',
        'bank_name',
        'bank_account',
        'iban',
        'swift_code',
        'notes',
        'rating',
    ];

    protected $casts = [
        'registration_date' => 'date',
        'rating' => 'integer',
    ];

    /**
     * العلاقات
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(SupplierInvoice::class);
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(SupplierPurchase::class);
    }

    public function scaffolds(): HasMany
    {
        return $this->hasMany(Scaffold::class);
    }

    /**
     * Accessors
     */
    public function getFormattedRegistrationDateAttribute(): string
    {
        return $this->registration_date->format('Y-m-d');
    }

    public function getSupplierTypeNameAttribute(): string
    {
        return match($this->supplier_type) {
            'INDIVIDUAL' => 'فرد',
            'COMPANY' => 'شركة',
            default => $this->supplier_type
        };
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'ACTIVE' => 'نشط',
            'INACTIVE' => 'غير نشط',
            'SUSPENDED' => 'معلق',
            default => $this->status
        };
    }

    public function getRatingStarsAttribute(): string
    {
        $stars = '';
        for ($i = 1; $i <= 5; $i++) {
            $stars .= $i <= $this->rating ? '★' : '☆';
        }
        return $stars;
    }

    public function getTotalInvoicesCountAttribute(): int
    {
        return $this->invoices()->count();
    }

    public function getTotalPurchasesCountAttribute(): int
    {
        return $this->purchases()->count();
    }

    public function getTotalInvoicesAmountAttribute(): float
    {
        return $this->invoices()->sum('amount');
    }

    public function getTotalPurchasesAmountAttribute(): float
    {
        return $this->purchases()->sum('total_amount');
    }

    public function getPaidAmountAttribute(): float
    {
        return $this->invoices()->where('status', 'PAID')->sum('amount');
    }

    public function getPendingAmountAttribute(): float
    {
        return $this->invoices()->whereIn('status', ['PENDING', 'PARTIAL'])->sum('amount');
    }

    public function getOverdueAmountAttribute(): float
    {
        return $this->invoices()->where('status', 'OVERDUE')->sum('amount');
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
        return $query->where('supplier_type', 'INDIVIDUAL');
    }

    public function scopeCompany($query)
    {
        return $query->where('supplier_type', 'COMPANY');
    }

    public function scopeByNationality($query, $nationality)
    {
        return $query->where('nationality', $nationality);
    }

    public function scopeByRating($query, $rating)
    {
        return $query->where('rating', '>=', $rating);
    }

    /**
     * Methods
     */
    public function isActive(): bool
    {
        return $this->status === 'ACTIVE';
    }

    public function isInactive(): bool
    {
        return $this->status === 'INACTIVE';
    }

    public function isSuspended(): bool
    {
        return $this->status === 'SUSPENDED';
    }

    public function isIndividual(): bool
    {
        return $this->supplier_type === 'INDIVIDUAL';
    }

    public function isCompany(): bool
    {
        return $this->supplier_type === 'COMPANY';
    }

    public function activate(): void
    {
        $this->update(['status' => 'ACTIVE']);
    }

    public function deactivate(): void
    {
        $this->update(['status' => 'INACTIVE']);
    }

    public function suspend(): void
    {
        $this->update(['status' => 'SUSPENDED']);
    }

    public function updateRating(int $rating): void
    {
        $this->update(['rating' => max(0, min(5, $rating))]);
    }

    public function getContactInfo(): array
    {
        return [
            'person' => $this->contact_person,
            'phone' => $this->contact_person_phone,
            'email' => $this->contact_person_email,
        ];
    }

    public function getBankInfo(): array
    {
        return [
            'bank_name' => $this->bank_name,
            'account' => $this->bank_account,
            'iban' => $this->iban,
            'swift_code' => $this->swift_code,
        ];
    }

    public function hasWarnings(): bool
    {
        // يمكن إضافة منطق للتحقق من وجود تحذيرات
        return $this->overdue_amount > 0 || $this->rating < 3;
    }

    public function getWarnings(): array
    {
        $warnings = [];
        
        if ($this->overdue_amount > 0) {
            $warnings[] = 'يوجد فواتير متأخرة';
        }
        
        if ($this->rating < 3) {
            $warnings[] = 'تقييم منخفض';
        }
        
        return $warnings;
    }
}
