<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'installment_number',
        'amount',
        'due_date',
        'paid_amount',
        'payment_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'due_date' => 'date',
        'payment_date' => 'date',
        'amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'installment_number' => 'integer',
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
    public function getFormattedDueDateAttribute(): string
    {
        return $this->due_date->format('Y-m-d');
    }

    public function getFormattedPaymentDateAttribute(): ?string
    {
        return $this->payment_date ? $this->payment_date->format('Y-m-d') : null;
    }

    public function getRemainingAmountAttribute(): float
    {
        return $this->amount - $this->paid_amount;
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'pending' => 'قيد الانتظار',
            'paid' => 'مدفوع',
            'overdue' => 'متأخر',
            'cancelled' => 'ملغي',
            default => $this->status
        };
    }

    public function getDaysOverdueAttribute(): int
    {
        if ($this->status === 'overdue' || ($this->status === 'pending' && $this->due_date < now())) {
            return now()->diffInDays($this->due_date);
        }
        return 0;
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'overdue');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopeDueSoon($query, $days = 7)
    {
        return $query->where('status', 'pending')
                    ->where('due_date', '<=', now()->addDays($days))
                    ->where('due_date', '>=', now());
    }

    /**
     * Methods
     */
    public function markAsPaid(float $paidAmount = null, $paymentDate = null): void
    {
        $this->update([
            'status' => 'paid',
            'paid_amount' => $paidAmount ?? $this->amount,
            'payment_date' => $paymentDate ?? now(),
        ]);
    }

    public function markAsOverdue(): void
    {
        if ($this->status === 'pending' && $this->due_date < now()) {
            $this->update(['status' => 'overdue']);
        }
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isOverdue(): bool
    {
        return $this->status === 'overdue' || ($this->status === 'pending' && $this->due_date < now());
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function isDueSoon(int $days = 7): bool
    {
        return $this->status === 'pending' 
               && $this->due_date <= now()->addDays($days) 
               && $this->due_date >= now();
    }

    public function updateOverdueStatus(): void
    {
        if ($this->status === 'pending' && $this->due_date < now()) {
            $this->markAsOverdue();
        }
    }
}
