<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Claim extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'total_contracts',
        'total_payments',
        'pending_amount',
        'comments',
        'status',
        'last_payment_date',
        'next_due_date',
        'last_contact_date',
        'next_contact_date',
        'priority',
    ];

    protected $casts = [
        'total_contracts' => 'integer',
        'total_payments' => 'integer',
        'pending_amount' => 'decimal:2',
        'last_payment_date' => 'date',
        'next_due_date' => 'date',
        'last_contact_date' => 'date',
        'next_contact_date' => 'date',
    ];

    /**
     * العلاقات
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ClaimComment::class);
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(ClaimReminder::class);
    }

    /**
     * Accessors
     */
    public function getFormattedPendingAmountAttribute(): string
    {
        return number_format($this->pending_amount, 2);
    }

    public function getFormattedLastPaymentDateAttribute(): ?string
    {
        return $this->last_payment_date ? $this->last_payment_date->format('Y-m-d') : null;
    }

    public function getFormattedNextDueDateAttribute(): ?string
    {
        return $this->next_due_date ? $this->next_due_date->format('Y-m-d') : null;
    }

    public function getFormattedLastContactDateAttribute(): ?string
    {
        return $this->last_contact_date ? $this->last_contact_date->format('Y-m-d') : null;
    }

    public function getFormattedNextContactDateAttribute(): ?string
    {
        return $this->next_contact_date ? $this->next_contact_date->format('Y-m-d') : null;
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'PENDING' => 'قيد الانتظار',
            'PARTIAL' => 'جزئي',
            'PAID' => 'مدفوع',
            'OVERDUE' => 'متأخر',
            'CANCELLED' => 'ملغي',
            default => $this->status
        };
    }

    public function getPriorityNameAttribute(): string
    {
        return match($this->priority) {
            'LOW' => 'منخفض',
            'NORMAL' => 'عادي',
            'HIGH' => 'عالي',
            'URGENT' => 'عاجل',
            default => $this->priority
        };
    }

    public function getPriorityColorAttribute(): string
    {
        return match($this->priority) {
            'LOW' => 'green',
            'NORMAL' => 'blue',
            'HIGH' => 'orange',
            'URGENT' => 'red',
            default => 'gray'
        };
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->status === 'OVERDUE' || 
               ($this->status === 'PENDING' && $this->next_due_date && $this->next_due_date < now());
    }

    public function getDaysOverdueAttribute(): int
    {
        if ($this->is_overdue) {
            $dueDate = $this->next_due_date ?? now();
            return now()->diffInDays($dueDate);
        }
        return 0;
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'PENDING');
    }

    public function scopePartial($query)
    {
        return $query->where('status', 'PARTIAL');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'PAID');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'OVERDUE');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'CANCELLED');
    }

    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'HIGH');
    }

    public function scopeUrgentPriority($query)
    {
        return $query->where('priority', 'URGENT');
    }

    public function scopeByAmountRange($query, $minAmount, $maxAmount)
    {
        return $query->whereBetween('pending_amount', [$minAmount, $maxAmount]);
    }

    /**
     * Methods
     */
    public function isPending(): bool
    {
        return $this->status === 'PENDING';
    }

    public function isPartial(): bool
    {
        return $this->status === 'PARTIAL';
    }

    public function isPaid(): bool
    {
        return $this->status === 'PAID';
    }

    public function isOverdue(): bool
    {
        return $this->status === 'OVERDUE' || 
               ($this->status === 'PENDING' && $this->next_due_date && $this->next_due_date < now());
    }

    public function isCancelled(): bool
    {
        return $this->status === 'CANCELLED';
    }

    public function isHighPriority(): bool
    {
        return in_array($this->priority, ['HIGH', 'URGENT']);
    }

    public function isUrgent(): bool
    {
        return $this->priority === 'URGENT';
    }

    public function markAsPaid(): void
    {
        $this->update(['status' => 'PAID']);
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

    public function updateLastContact(): void
    {
        $this->update(['last_contact_date' => now()]);
    }

    public function setNextContactDate($date): void
    {
        $this->update(['next_contact_date' => $date]);
    }

    public function addComment(string $content, array $hashtags = []): ClaimComment
    {
        return $this->comments()->create([
            'content' => $content,
            'hashtags' => $hashtags,
            'created_by' => auth()->id(),
        ]);
    }

    public function addReminder(string $type, string $message, $scheduledDate): ClaimReminder
    {
        return $this->reminders()->create([
            'reminder_type' => $type,
            'message' => $message,
            'scheduled_date' => $scheduledDate,
        ]);
    }

    public function getFormattedPendingAmountWithCurrency(): string
    {
        return $this->formatted_pending_amount . ' ريال عماني';
    }

    public function updateOverdueStatus(): void
    {
        if ($this->status === 'PENDING' && $this->next_due_date && $this->next_due_date < now()) {
            $this->markAsOverdue();
        }
    }

    public function isDueSoon(int $days = 7): bool
    {
        return $this->status === 'PENDING' && 
               $this->next_due_date && 
               $this->next_due_date <= now()->addDays($days) && 
               $this->next_due_date >= now();
    }
}
