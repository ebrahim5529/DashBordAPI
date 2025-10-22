<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'content',
        'priority',
        'created_by',
    ];

    protected $casts = [
        'priority' => 'string',
    ];

    /**
     * العلاقات
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scopes
     */
    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'HIGH');
    }

    public function scopeUrgentPriority($query)
    {
        return $query->where('priority', 'URGENT');
    }

    /**
     * Methods
     */
    public function isHighPriority(): bool
    {
        return in_array($this->priority, ['HIGH', 'URGENT']);
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
}
