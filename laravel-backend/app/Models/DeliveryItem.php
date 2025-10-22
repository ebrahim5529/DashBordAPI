<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'delivery_id',
        'name',
        'quantity',
        'condition',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    /**
     * العلاقات
     */
    public function delivery(): BelongsTo
    {
        return $this->belongsTo(Delivery::class);
    }

    /**
     * Accessors
     */
    public function getConditionNameAttribute(): string
    {
        return match($this->condition) {
            'good' => 'جيد',
            'damaged' => 'تالف',
            'missing' => 'مفقود',
            default => $this->condition
        };
    }

    public function getConditionColorAttribute(): string
    {
        return match($this->condition) {
            'good' => 'green',
            'damaged' => 'orange',
            'missing' => 'red',
            default => 'gray'
        };
    }

    /**
     * Scopes
     */
    public function scopeGood($query)
    {
        return $query->where('condition', 'good');
    }

    public function scopeDamaged($query)
    {
        return $query->where('condition', 'damaged');
    }

    public function scopeMissing($query)
    {
        return $query->where('condition', 'missing');
    }

    /**
     * Methods
     */
    public function isGood(): bool
    {
        return $this->condition === 'good';
    }

    public function isDamaged(): bool
    {
        return $this->condition === 'damaged';
    }

    public function isMissing(): bool
    {
        return $this->condition === 'missing';
    }

    public function markAsGood(): void
    {
        $this->update(['condition' => 'good']);
    }

    public function markAsDamaged(): void
    {
        $this->update(['condition' => 'damaged']);
    }

    public function markAsMissing(): void
    {
        $this->update(['condition' => 'missing']);
    }

    public function updateQuantity(int $newQuantity): void
    {
        $this->update(['quantity' => $newQuantity]);
    }

    public function hasNotes(): bool
    {
        return !empty($this->notes);
    }

    public function addNote(string $note): void
    {
        $currentNotes = $this->notes ?? '';
        $newNotes = $currentNotes ? $currentNotes . "\n" . $note : $note;
        $this->update(['notes' => $newNotes]);
    }
}
