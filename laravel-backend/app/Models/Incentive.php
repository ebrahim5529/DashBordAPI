<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Incentive extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'incentive_type',
        'amount',
        'reason',
        'date',
        'status',
        'approved_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'date' => 'date',
    ];

    /**
     * العلاقات
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Accessors
     */
    public function getFormattedAmountAttribute(): string
    {
        return number_format($this->amount, 2);
    }

    public function getFormattedDateAttribute(): string
    {
        return $this->date->format('Y-m-d');
    }

    public function getIncentiveTypeNameAttribute(): string
    {
        return match($this->incentive_type) {
            'performance' => 'حافز أداء',
            'bonus' => 'مكافأة',
            'overtime' => 'ساعات إضافية',
            'commission' => 'عمولة',
            'other' => 'أخرى',
            default => $this->incentive_type
        };
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'approved' => 'موافق عليه',
            'pending' => 'قيد الانتظار',
            'rejected' => 'مرفوض',
            default => $this->status
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'approved' => 'green',
            'pending' => 'yellow',
            'rejected' => 'red',
            default => 'gray'
        };
    }

    /**
     * Scopes
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeByIncentiveType($query, $type)
    {
        return $query->where('incentive_type', $type);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    public function scopeByAmountRange($query, $minAmount, $maxAmount)
    {
        return $query->whereBetween('amount', [$minAmount, $maxAmount]);
    }

    /**
     * Methods
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function approve(User $approvedBy): void
    {
        $this->update([
            'status' => 'approved',
            'approved_by' => $approvedBy->id,
        ]);
    }

    public function reject(): void
    {
        $this->update(['status' => 'rejected']);
    }

    public function isPerformanceBonus(): bool
    {
        return $this->incentive_type === 'performance';
    }

    public function isOvertimeBonus(): bool
    {
        return $this->incentive_type === 'overtime';
    }

    public function isCommission(): bool
    {
        return $this->incentive_type === 'commission';
    }

    public function isGeneralBonus(): bool
    {
        return $this->incentive_type === 'bonus';
    }

    public function getFormattedAmountWithCurrency(): string
    {
        return $this->formatted_amount . ' ريال عماني';
    }

    public function isCurrentMonth(): bool
    {
        return $this->date->month === now()->month && $this->date->year === now()->year;
    }

    public function isCurrentYear(): bool
    {
        return $this->date->year === now()->year;
    }
}
