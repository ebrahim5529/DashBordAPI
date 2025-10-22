<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'date',
        'check_in',
        'check_out',
        'total_hours',
        'overtime',
        'status',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'check_in' => 'datetime',
        'check_out' => 'datetime',
        'total_hours' => 'decimal:2',
        'overtime' => 'decimal:2',
    ];

    /**
     * العلاقات
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Accessors
     */
    public function getFormattedDateAttribute(): string
    {
        return $this->date->format('Y-m-d');
    }

    public function getFormattedCheckInAttribute(): ?string
    {
        return $this->check_in ? $this->check_in->format('H:i:s') : null;
    }

    public function getFormattedCheckOutAttribute(): ?string
    {
        return $this->check_out ? $this->check_out->format('H:i:s') : null;
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'present' => 'حاضر',
            'absent' => 'غائب',
            'late' => 'متأخر',
            'half_day' => 'نصف يوم',
            'on_leave' => 'في إجازة',
            default => $this->status
        };
    }

    public function getFormattedTotalHoursAttribute(): string
    {
        return number_format($this->total_hours, 2) . ' ساعة';
    }

    public function getFormattedOvertimeAttribute(): string
    {
        return number_format($this->overtime, 2) . ' ساعة';
    }

    /**
     * Scopes
     */
    public function scopePresent($query)
    {
        return $query->where('status', 'present');
    }

    public function scopeAbsent($query)
    {
        return $query->where('status', 'absent');
    }

    public function scopeLate($query)
    {
        return $query->where('status', 'late');
    }

    public function scopeHalfDay($query)
    {
        return $query->where('status', 'half_day');
    }

    public function scopeOnLeave($query)
    {
        return $query->where('status', 'on_leave');
    }

    public function scopeByDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    public function scopeWithOvertime($query)
    {
        return $query->where('overtime', '>', 0);
    }

    /**
     * Methods
     */
    public function isPresent(): bool
    {
        return $this->status === 'present';
    }

    public function isAbsent(): bool
    {
        return $this->status === 'absent';
    }

    public function isLate(): bool
    {
        return $this->status === 'late';
    }

    public function isHalfDay(): bool
    {
        return $this->status === 'half_day';
    }

    public function isOnLeave(): bool
    {
        return $this->status === 'on_leave';
    }

    public function hasCheckedIn(): bool
    {
        return !is_null($this->check_in);
    }

    public function hasCheckedOut(): bool
    {
        return !is_null($this->check_out);
    }

    public function hasOvertime(): bool
    {
        return $this->overtime > 0;
    }

    public function checkIn($time = null): void
    {
        $this->update([
            'check_in' => $time ?? now(),
            'status' => 'present',
        ]);
    }

    public function checkOut($time = null): void
    {
        $this->update(['check_out' => $time ?? now()]);
        $this->calculateHours();
    }

    public function calculateHours(): void
    {
        if ($this->check_in && $this->check_out) {
            $totalMinutes = $this->check_out->diffInMinutes($this->check_in);
            $totalHours = $totalMinutes / 60;
            
            // حساب ساعات العمل العادية (8 ساعات)
            $regularHours = min($totalHours, 8);
            $overtimeHours = max(0, $totalHours - 8);
            
            $this->update([
                'total_hours' => $totalHours,
                'overtime' => $overtimeHours,
            ]);
        }
    }

    public function markAsAbsent(): void
    {
        $this->update([
            'status' => 'absent',
            'check_in' => null,
            'check_out' => null,
            'total_hours' => 0,
            'overtime' => 0,
        ]);
    }

    public function markAsLate(): void
    {
        $this->update(['status' => 'late']);
    }

    public function markAsHalfDay(): void
    {
        $this->update(['status' => 'half_day']);
    }

    public function markAsOnLeave(): void
    {
        $this->update([
            'status' => 'on_leave',
            'check_in' => null,
            'check_out' => null,
            'total_hours' => 0,
            'overtime' => 0,
        ]);
    }

    public function getWorkingHours(): float
    {
        return $this->total_hours;
    }

    public function getOvertimeHours(): float
    {
        return $this->overtime;
    }

    public function getRegularHours(): float
    {
        return $this->total_hours - $this->overtime;
    }
}
