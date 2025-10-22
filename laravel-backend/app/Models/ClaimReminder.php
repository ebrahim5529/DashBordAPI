<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClaimReminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'claim_id',
        'reminder_type',
        'message',
        'scheduled_date',
        'sent_date',
        'status',
    ];

    protected $casts = [
        'scheduled_date' => 'date',
        'sent_date' => 'datetime',
    ];

    /**
     * العلاقات
     */
    public function claim(): BelongsTo
    {
        return $this->belongsTo(Claim::class);
    }

    /**
     * Accessors
     */
    public function getFormattedScheduledDateAttribute(): string
    {
        return $this->scheduled_date->format('Y-m-d');
    }

    public function getFormattedSentDateAttribute(): ?string
    {
        return $this->sent_date ? $this->sent_date->format('Y-m-d H:i:s') : null;
    }

    public function getReminderTypeNameAttribute(): string
    {
        return match($this->reminder_type) {
            'SMS' => 'رسالة نصية',
            'EMAIL' => 'بريد إلكتروني',
            'CALL' => 'مكالمة',
            'LETTER' => 'خطاب',
            default => $this->reminder_type
        };
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'PENDING' => 'قيد الانتظار',
            'SENT' => 'تم الإرسال',
            'FAILED' => 'فشل الإرسال',
            default => $this->status
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'PENDING' => 'yellow',
            'SENT' => 'green',
            'FAILED' => 'red',
            default => 'gray'
        };
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->status === 'PENDING' && $this->scheduled_date < now();
    }

    public function getDaysOverdueAttribute(): int
    {
        if ($this->is_overdue) {
            return now()->diffInDays($this->scheduled_date);
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

    public function scopeSent($query)
    {
        return $query->where('status', 'SENT');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'FAILED');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('reminder_type', $type);
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'PENDING')
                    ->where('scheduled_date', '<', now());
    }

    public function scopeDueToday($query)
    {
        return $query->where('status', 'PENDING')
                    ->whereDate('scheduled_date', now());
    }

    public function scopeDueSoon($query, $days = 7)
    {
        return $query->where('status', 'PENDING')
                    ->where('scheduled_date', '<=', now()->addDays($days))
                    ->where('scheduled_date', '>=', now());
    }

    /**
     * Methods
     */
    public function isPending(): bool
    {
        return $this->status === 'PENDING';
    }

    public function isSent(): bool
    {
        return $this->status === 'SENT';
    }

    public function isFailed(): bool
    {
        return $this->status === 'FAILED';
    }

    public function isOverdue(): bool
    {
        return $this->status === 'PENDING' && $this->scheduled_date < now();
    }

    public function isDueToday(): bool
    {
        return $this->status === 'PENDING' && $this->scheduled_date->isToday();
    }

    public function isDueSoon(int $days = 7): bool
    {
        return $this->status === 'PENDING' && 
               $this->scheduled_date <= now()->addDays($days) && 
               $this->scheduled_date >= now();
    }

    public function markAsSent(): void
    {
        $this->update([
            'status' => 'SENT',
            'sent_date' => now(),
        ]);
    }

    public function markAsFailed(): void
    {
        $this->update(['status' => 'FAILED']);
    }

    public function reschedule($newDate): void
    {
        $this->update([
            'scheduled_date' => $newDate,
            'status' => 'PENDING',
        ]);
    }

    public function getFormattedMessage(): string
    {
        // إضافة معلومات إضافية للرسالة
        $customer = $this->claim->customer;
        $message = $this->message;
        
        // استبدال المتغيرات في الرسالة
        $message = str_replace('{customer_name}', $customer->name, $message);
        $message = str_replace('{amount}', $this->claim->formatted_pending_amount, $message);
        $message = str_replace('{due_date}', $this->claim->formatted_next_due_date, $message);
        
        return $message;
    }

    public function canBeSent(): bool
    {
        return $this->status === 'PENDING' && 
               $this->scheduled_date <= now() && 
               !$this->isFailed();
    }

    public function getDaysUntilScheduled(): int
    {
        return now()->diffInDays($this->scheduled_date, false);
    }
}
