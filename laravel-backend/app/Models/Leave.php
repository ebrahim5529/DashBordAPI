<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Leave extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'leave_type',
        'start_date',
        'end_date',
        'total_days',
        'reason',
        'status',
        'applied_date',
        'approved_by',
        'approved_date',
        'rejection_reason',
        'remaining_balance',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'applied_date' => 'date',
        'approved_date' => 'date',
        'total_days' => 'integer',
        'remaining_balance' => 'integer',
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

    public function documents(): HasMany
    {
        return $this->hasMany(LeaveDocument::class);
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

    public function getFormattedAppliedDateAttribute(): string
    {
        return $this->applied_date->format('Y-m-d');
    }

    public function getFormattedApprovedDateAttribute(): ?string
    {
        return $this->approved_date ? $this->approved_date->format('Y-m-d') : null;
    }

    public function getLeaveTypeNameAttribute(): string
    {
        return match($this->leave_type) {
            'ANNUAL' => 'إجازة سنوية',
            'SICK' => 'إجازة مرضية',
            'EMERGENCY' => 'إجازة طارئة',
            'MATERNITY' => 'إجازة أمومة',
            'PATERNITY' => 'إجازة أبوة',
            'STUDY' => 'إجازة دراسية',
            'UNPAID' => 'إجازة بدون راتب',
            default => $this->leave_type
        };
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'PENDING' => 'قيد الانتظار',
            'APPROVED' => 'موافق عليها',
            'REJECTED' => 'مرفوضة',
            'CANCELLED' => 'ملغية',
            default => $this->status
        };
    }

    public function getLeaveTypeColorAttribute(): string
    {
        return match($this->leave_type) {
            'ANNUAL' => 'blue',
            'SICK' => 'red',
            'EMERGENCY' => 'orange',
            'MATERNITY' => 'pink',
            'PATERNITY' => 'purple',
            'STUDY' => 'green',
            'UNPAID' => 'gray',
            default => 'gray'
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'PENDING' => 'yellow',
            'APPROVED' => 'green',
            'REJECTED' => 'red',
            'CANCELLED' => 'gray',
            default => 'gray'
        };
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'PENDING');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'APPROVED');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'REJECTED');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'CANCELLED');
    }

    public function scopeByLeaveType($query, $leaveType)
    {
        return $query->where('leave_type', $leaveType);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('start_date', [$startDate, $endDate]);
    }

    public function scopeCurrent($query)
    {
        return $query->where('status', 'APPROVED')
                    ->where('start_date', '<=', now())
                    ->where('end_date', '>=', now());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('status', 'APPROVED')
                    ->where('start_date', '>', now());
    }

    /**
     * Methods
     */
    public function isPending(): bool
    {
        return $this->status === 'PENDING';
    }

    public function isApproved(): bool
    {
        return $this->status === 'APPROVED';
    }

    public function isRejected(): bool
    {
        return $this->status === 'REJECTED';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'CANCELLED';
    }

    public function isCurrent(): bool
    {
        return $this->status === 'APPROVED' && 
               $this->start_date <= now() && 
               $this->end_date >= now();
    }

    public function isUpcoming(): bool
    {
        return $this->status === 'APPROVED' && $this->start_date > now();
    }

    public function isPast(): bool
    {
        return $this->end_date < now();
    }

    public function approve(User $approvedBy): void
    {
        $this->update([
            'status' => 'APPROVED',
            'approved_by' => $approvedBy->id,
            'approved_date' => now(),
        ]);
    }

    public function reject(string $reason): void
    {
        $this->update([
            'status' => 'REJECTED',
            'rejection_reason' => $reason,
        ]);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'CANCELLED']);
    }

    public function calculateTotalDays(): int
    {
        $totalDays = $this->start_date->diffInDays($this->end_date) + 1;
        $this->update(['total_days' => $totalDays]);
        return $totalDays;
    }

    public function getDaysRemaining(): int
    {
        if ($this->isCurrent()) {
            return max(0, now()->diffInDays($this->end_date));
        }
        return 0;
    }

    public function overlapsWith(Leave $otherLeave): bool
    {
        return $this->start_date <= $otherLeave->end_date && 
               $this->end_date >= $otherLeave->start_date &&
               $this->id !== $otherLeave->id;
    }

    public function getDocumentsList(): array
    {
        return $this->documents()->get()->toArray();
    }

    public function addDocument(string $name, int $size, string $type, string $url): LeaveDocument
    {
        return $this->documents()->create([
            'name' => $name,
            'size' => $size,
            'type' => $type,
            'url' => $url,
            'uploaded_at' => now(),
        ]);
    }

    public function removeDocument(int $documentId): bool
    {
        return $this->documents()->where('id', $documentId)->delete();
    }
}
