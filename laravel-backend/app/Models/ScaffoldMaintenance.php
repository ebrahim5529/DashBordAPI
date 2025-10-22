<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScaffoldMaintenance extends Model
{
    use HasFactory;

    protected $fillable = [
        'scaffold_id',
        'maintenance_date',
        'description',
        'cost',
        'technician_name',
        'status',
        'next_maintenance_date',
    ];

    protected $casts = [
        'maintenance_date' => 'date',
        'next_maintenance_date' => 'date',
        'cost' => 'decimal:2',
    ];

    /**
     * العلاقات
     */
    public function scaffold(): BelongsTo
    {
        return $this->belongsTo(Scaffold::class);
    }

    /**
     * Accessors
     */
    public function getFormattedMaintenanceDateAttribute(): string
    {
        return $this->maintenance_date->format('Y-m-d');
    }

    public function getFormattedNextMaintenanceDateAttribute(): ?string
    {
        return $this->next_maintenance_date ? $this->next_maintenance_date->format('Y-m-d') : null;
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'scheduled' => 'مجدول',
            'in_progress' => 'قيد التنفيذ',
            'completed' => 'مكتمل',
            'cancelled' => 'ملغي',
            default => $this->status
        };
    }

    public function getFormattedCostAttribute(): string
    {
        return number_format($this->cost, 2);
    }

    /**
     * Scopes
     */
    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('maintenance_date', [$startDate, $endDate]);
    }

    /**
     * Methods
     */
    public function markAsInProgress(): void
    {
        $this->update(['status' => 'in_progress']);
    }

    public function markAsCompleted(): void
    {
        $this->update(['status' => 'completed']);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }

    public function isScheduled(): bool
    {
        return $this->status === 'scheduled';
    }

    public function isInProgress(): bool
    {
        return $this->status === 'in_progress';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function isOverdue(): bool
    {
        return $this->status === 'scheduled' && $this->maintenance_date < now();
    }

    public function updateScaffoldMaintenanceDates(): void
    {
        if ($this->isCompleted() && $this->next_maintenance_date) {
            $this->scaffold->updateMaintenanceDate($this->next_maintenance_date);
        }
    }
}
