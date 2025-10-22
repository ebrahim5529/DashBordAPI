<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LatePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'contract_number',
        'amount',
        'due_date',
        'days_late',
        'contact_person',
        'phone',
        'email',
        'last_contact',
        'status',
        'priority',
        'notes',
    ];

    protected $casts = [
        'due_date' => 'date',
        'last_contact' => 'date',
        'amount' => 'decimal:2',
        'days_late' => 'integer',
    ];

    /**
     * العلاقات
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Accessors
     */
    public function getFormattedDueDateAttribute(): string
    {
        return $this->due_date->format('Y-m-d');
    }

    public function getFormattedLastContactAttribute(): ?string
    {
        return $this->last_contact ? $this->last_contact->format('Y-m-d') : null;
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'pending' => 'قيد الانتظار',
            'contacted' => 'تم التواصل',
            'escalated' => 'تم تصعيده',
            'resolved' => 'تم حله',
            'cancelled' => 'ملغي',
            default => $this->status
        };
    }

    public function getPriorityNameAttribute(): string
    {
        return match($this->priority) {
            'low' => 'منخفض',
            'medium' => 'متوسط',
            'high' => 'عالي',
            'urgent' => 'عاجل',
            default => $this->priority
        };
    }

    public function getPriorityColorAttribute(): string
    {
        return match($this->priority) {
            'low' => 'green',
            'medium' => 'yellow',
            'high' => 'orange',
            'urgent' => 'red',
            default => 'gray'
        };
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeContacted($query)
    {
        return $query->where('status', 'contacted');
    }

    public function scopeEscalated($query)
    {
        return $query->where('status', 'escalated');
    }

    public function scopeResolved($query)
    {
        return $query->where('status', 'resolved');
    }

    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'high');
    }

    public function scopeUrgentPriority($query)
    {
        return $query->where('priority', 'urgent');
    }

    public function scopeOverdue($query, $days = 30)
    {
        return $query->where('days_late', '>=', $days);
    }

    /**
     * Methods
     */
    public function markAsContacted(): void
    {
        $this->update([
            'status' => 'contacted',
            'last_contact' => now(),
        ]);
    }

    public function escalate(): void
    {
        $this->update(['status' => 'escalated']);
    }

    public function resolve(): void
    {
        $this->update(['status' => 'resolved']);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isContacted(): bool
    {
        return $this->status === 'contacted';
    }

    public function isEscalated(): bool
    {
        return $this->status === 'escalated';
    }

    public function isResolved(): bool
    {
        return $this->status === 'resolved';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function isHighPriority(): bool
    {
        return in_array($this->priority, ['high', 'urgent']);
    }

    public function isUrgent(): bool
    {
        return $this->priority === 'urgent';
    }

    public function updateDaysLate(): void
    {
        $daysLate = now()->diffInDays($this->due_date);
        $this->update(['days_late' => $daysLate]);
    }
}
