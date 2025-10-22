<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'name',
        'arabic_name',
        'email',
        'phone',
        'mobile',
        'address',
        'city',
        'nationality',
        'date_of_birth',
        'gender',
        'marital_status',
        'id_number',
        'passport_number',
        'position',
        'department_id',
        'manager_id',
        'location',
        'hire_date',
        'contract_type',
        'work_schedule',
        'status',
        'basic_salary',
        'allowances',
        'total_salary',
        'currency',
        'payment_method',
        'bank_account',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'hire_date' => 'date',
        'basic_salary' => 'decimal:2',
        'allowances' => 'decimal:2',
        'total_salary' => 'decimal:2',
    ];

    /**
     * العلاقات
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function subordinates(): HasMany
    {
        return $this->hasMany(Employee::class, 'manager_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(EmployeeDocument::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaves(): HasMany
    {
        return $this->hasMany(Leave::class);
    }

    public function salaries(): HasMany
    {
        return $this->hasMany(Salary::class);
    }

    public function incentives(): HasMany
    {
        return $this->hasMany(Incentive::class);
    }

    public function deliveries(): HasMany
    {
        return $this->hasMany(Delivery::class, 'driver_id');
    }

    /**
     * Accessors
     */
    public function getFormattedHireDateAttribute(): string
    {
        return $this->hire_date->format('Y-m-d');
    }

    public function getFormattedDateOfBirthAttribute(): ?string
    {
        return $this->date_of_birth ? $this->date_of_birth->format('Y-m-d') : null;
    }

    public function getAgeAttribute(): ?int
    {
        return $this->date_of_birth ? $this->date_of_birth->age : null;
    }

    public function getYearsOfServiceAttribute(): int
    {
        return $this->hire_date->diffInYears(now());
    }

    public function getFormattedBasicSalaryAttribute(): string
    {
        return number_format($this->basic_salary, 2);
    }

    public function getFormattedAllowancesAttribute(): string
    {
        return number_format($this->allowances, 2);
    }

    public function getFormattedTotalSalaryAttribute(): string
    {
        return number_format($this->total_salary, 2);
    }

    public function getGenderNameAttribute(): string
    {
        return match($this->gender) {
            'male' => 'ذكر',
            'female' => 'أنثى',
            default => $this->gender
        };
    }

    public function getMaritalStatusNameAttribute(): string
    {
        return match($this->marital_status) {
            'single' => 'أعزب',
            'married' => 'متزوج',
            'divorced' => 'مطلق',
            'widowed' => 'أرمل',
            default => $this->marital_status
        };
    }

    public function getContractTypeNameAttribute(): string
    {
        return match($this->contract_type) {
            'full_time' => 'دوام كامل',
            'part_time' => 'دوام جزئي',
            'contract' => 'عقد',
            'intern' => 'متدرب',
            default => $this->contract_type
        };
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'active' => 'نشط',
            'inactive' => 'غير نشط',
            'on_leave' => 'في إجازة',
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

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    public function scopeOnLeave($query)
    {
        return $query->where('status', 'on_leave');
    }

    public function scopeByDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    public function scopeByPosition($query, $position)
    {
        return $query->where('position', 'like', "%{$position}%");
    }

    public function scopeFullTime($query)
    {
        return $query->where('contract_type', 'full_time');
    }

    public function scopePartTime($query)
    {
        return $query->where('contract_type', 'part_time');
    }

    /**
     * Methods
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isInactive(): bool
    {
        return $this->status === 'inactive';
    }

    public function isOnLeave(): bool
    {
        return $this->status === 'on_leave';
    }

    public function isFullTime(): bool
    {
        return $this->contract_type === 'full_time';
    }

    public function isPartTime(): bool
    {
        return $this->contract_type === 'part_time';
    }

    public function activate(): void
    {
        $this->update(['status' => 'active']);
    }

    public function deactivate(): void
    {
        $this->update(['status' => 'inactive']);
    }

    public function putOnLeave(): void
    {
        $this->update(['status' => 'on_leave']);
    }

    public function calculateTotalSalary(): float
    {
        $total = $this->basic_salary + $this->allowances;
        $this->update(['total_salary' => $total]);
        return $total;
    }

    public function hasManager(): bool
    {
        return !is_null($this->manager_id);
    }

    public function hasSubordinates(): bool
    {
        return $this->subordinates()->count() > 0;
    }

    public function getCurrentLeave(): ?Leave
    {
        return $this->leaves()
                   ->where('status', 'APPROVED')
                   ->where('start_date', '<=', now())
                   ->where('end_date', '>=', now())
                   ->first();
    }

    public function isOnLeaveToday(): bool
    {
        return !is_null($this->getCurrentLeave());
    }

    public function getAttendanceToday(): ?Attendance
    {
        return $this->attendances()
                   ->whereDate('date', now()->toDateString())
                   ->first();
    }

    public function hasCheckedInToday(): bool
    {
        $attendance = $this->getAttendanceToday();
        return $attendance && !is_null($attendance->check_in);
    }

    public function hasCheckedOutToday(): bool
    {
        $attendance = $this->getAttendanceToday();
        return $attendance && !is_null($attendance->check_out);
    }
}
