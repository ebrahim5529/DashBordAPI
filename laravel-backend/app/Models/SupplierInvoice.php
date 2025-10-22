<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SupplierInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'supplier_id',
        'amount',
        'status',
        'due_date',
        'payment_date',
        'payment_method',
        'description',
    ];

    protected $casts = [
        'due_date' => 'date',
        'payment_date' => 'date',
        'amount' => 'decimal:2',
    ];

    /**
     * العلاقات
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(SupplierPurchase::class);
    }

    /**
     * Accessors
     */
    public function getFormattedAmountAttribute(): string
    {
        return number_format($this->amount, 2);
    }

    public function getFormattedDueDateAttribute(): string
    {
        return $this->due_date->format('Y-m-d');
    }

    public function getFormattedPaymentDateAttribute(): ?string
    {
        return $this->payment_date ? $this->payment_date->format('Y-m-d') : null;
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'PENDING' => 'قيد الانتظار',
            'PAID' => 'مدفوعة',
            'PARTIAL' => 'جزئية',
            'OVERDUE' => 'متأخرة',
            'CANCELLED' => 'ملغية',
            default => $this->status
        };
    }

    public function getPaymentMethodNameAttribute(): string
    {
        return match($this->payment_method) {
            'CASH' => 'نقداً',
            'BANK_TRANSFER' => 'تحويل بنكي',
            'CHECK' => 'شيك',
            'CREDIT_CARD' => 'بطاقة ائتمان',
            default => $this->payment_method
        };
    }

    public function getDaysOverdueAttribute(): int
    {
        if ($this->status === 'OVERDUE' || ($this->status === 'PENDING' && $this->due_date < now())) {
            return now()->diffInDays($this->due_date);
        }
        return 0;
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->status === 'OVERDUE' || ($this->status === 'PENDING' && $this->due_date < now());
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'PENDING');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'PAID');
    }

    public function scopePartial($query)
    {
        return $query->where('status', 'PARTIAL');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'CANCELLED');
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('due_date', [$startDate, $endDate]);
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
                    ->whereIn('status', ['PENDING', 'PARTIAL']);
    }

    /**
     * Methods
     */
    public function isPending(): bool
    {
        return $this->status === 'PENDING';
    }

    public function isPaid(): bool
    {
        return $this->status === 'PAID';
    }

    public function isPartial(): bool
    {
        return $this->status === 'PARTIAL';
    }

    public function isOverdue(): bool
    {
        return $this->status === 'OVERDUE' || ($this->status === 'PENDING' && $this->due_date < now());
    }

    public function isCancelled(): bool
    {
        return $this->status === 'CANCELLED';
    }

    public function markAsPaid($paymentDate = null, $paymentMethod = null): void
    {
        $this->update([
            'status' => 'PAID',
            'payment_date' => $paymentDate ?? now(),
            'payment_method' => $paymentMethod ?? $this->payment_method,
        ]);
    }

    public function markAsPartial(): void
    {
        $this->update(['status' => 'PARTIAL']);
    }

    public function markAsOverdue(): void
    {
        $this->update(['status' => 'OVERDUE']);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'CANCELLED']);
    }

    public function updateOverdueStatus(): void
    {
        if ($this->status === 'PENDING' && $this->due_date < now()) {
            $this->markAsOverdue();
        }
    }

    public function getFormattedAmountWithCurrency(): string
    {
        return $this->formatted_amount . ' ريال عماني';
    }

    public function isDueSoon(int $days = 7): bool
    {
        return $this->status === 'PENDING' && 
               $this->due_date <= now()->addDays($days) && 
               $this->due_date >= now();
    }
}
