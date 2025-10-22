<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Salary extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'month',
        'year',
        'basic_salary',
        'allowances',
        'deductions',
        'total_salary',
        'payment_date',
        'status',
        'payment_method',
        'notes',
    ];

    protected $casts = [
        'month' => 'integer',
        'year' => 'integer',
        'basic_salary' => 'decimal:2',
        'allowances' => 'decimal:2',
        'deductions' => 'decimal:2',
        'total_salary' => 'decimal:2',
        'payment_date' => 'date',
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
    public function getFormattedBasicSalaryAttribute(): string
    {
        return number_format($this->basic_salary, 2);
    }

    public function getFormattedAllowancesAttribute(): string
    {
        return number_format($this->allowances, 2);
    }

    public function getFormattedDeductionsAttribute(): string
    {
        return number_format($this->deductions, 2);
    }

    public function getFormattedTotalSalaryAttribute(): string
    {
        return number_format($this->total_salary, 2);
    }

    public function getFormattedPaymentDateAttribute(): ?string
    {
        return $this->payment_date ? $this->payment_date->format('Y-m-d') : null;
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'paid' => 'مدفوع',
            'pending' => 'قيد الانتظار',
            'overdue' => 'متأخر',
            default => $this->status
        };
    }

    public function getPaymentMethodNameAttribute(): string
    {
        return match($this->payment_method) {
            'bank_transfer' => 'تحويل بنكي',
            'cash' => 'نقداً',
            'check' => 'شيك',
            default => $this->payment_method
        };
    }

    public function getMonthNameAttribute(): string
    {
        $months = [
            1 => 'يناير', 2 => 'فبراير', 3 => 'مارس', 4 => 'أبريل',
            5 => 'مايو', 6 => 'يونيو', 7 => 'يوليو', 8 => 'أغسطس',
            9 => 'سبتمبر', 10 => 'أكتوبر', 11 => 'نوفمبر', 12 => 'ديسمبر'
        ];
        
        return $months[$this->month] ?? $this->month;
    }

    public function getPeriodAttribute(): string
    {
        return $this->month_name . ' ' . $this->year;
    }

    /**
     * Scopes
     */
    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'overdue');
    }

    public function scopeByMonth($query, $month)
    {
        return $query->where('month', $month);
    }

    public function scopeByYear($query, $year)
    {
        return $query->where('year', $year);
    }

    public function scopeByPeriod($query, $month, $year)
    {
        return $query->where('month', $month)->where('year', $year);
    }

    public function scopeByPaymentMethod($query, $method)
    {
        return $query->where('payment_method', $method);
    }

    /**
     * Methods
     */
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
        return $this->status === 'overdue';
    }

    public function markAsPaid($paymentDate = null, $paymentMethod = null): void
    {
        $this->update([
            'status' => 'paid',
            'payment_date' => $paymentDate ?? now(),
            'payment_method' => $paymentMethod ?? $this->payment_method,
        ]);
    }

    public function markAsOverdue(): void
    {
        $this->update(['status' => 'overdue']);
    }

    public function calculateTotalSalary(): float
    {
        $total = $this->basic_salary + $this->allowances - $this->deductions;
        $this->update(['total_salary' => $total]);
        return $total;
    }

    public function getNetSalary(): float
    {
        return $this->basic_salary + $this->allowances - $this->deductions;
    }

    public function getGrossSalary(): float
    {
        return $this->basic_salary + $this->allowances;
    }

    public function addAllowance(float $amount): void
    {
        $this->update(['allowances' => $this->allowances + $amount]);
        $this->calculateTotalSalary();
    }

    public function addDeduction(float $amount): void
    {
        $this->update(['deductions' => $this->deductions + $amount]);
        $this->calculateTotalSalary();
    }

    public function isCurrentMonth(): bool
    {
        return $this->month === now()->month && $this->year === now()->year;
    }

    public function isPastMonth(): bool
    {
        return $this->year < now()->year || 
               ($this->year === now()->year && $this->month < now()->month);
    }

    public function isFutureMonth(): bool
    {
        return $this->year > now()->year || 
               ($this->year === now()->year && $this->month > now()->month);
    }
}
