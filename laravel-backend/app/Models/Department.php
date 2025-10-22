<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'manager_id',
    ];

    /**
     * العلاقات
     */
    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    /**
     * Accessors
     */
    public function getEmployeesCountAttribute(): int
    {
        return $this->employees()->count();
    }

    public function getActiveEmployeesCountAttribute(): int
    {
        return $this->employees()->where('status', 'active')->count();
    }

    /**
     * Methods
     */
    public function hasManager(): bool
    {
        return !is_null($this->manager_id);
    }

    public function setManager(User $user): void
    {
        $this->update(['manager_id' => $user->id]);
    }

    public function removeManager(): void
    {
        $this->update(['manager_id' => null]);
    }
}
