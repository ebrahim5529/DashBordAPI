<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_id',
        'name',
        'description',
        'quantity',
        'unit_price',
        'total_price',
        'category',
        'unit',
        'received_date',
        'status',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'received_date' => 'date',
    ];

    /**
     * العلاقات
     */
    public function purchase(): BelongsTo
    {
        return $this->belongsTo(SupplierPurchase::class, 'purchase_id');
    }

    /**
     * Accessors
     */
    public function getFormattedUnitPriceAttribute(): string
    {
        return number_format($this->unit_price, 2);
    }

    public function getFormattedTotalPriceAttribute(): string
    {
        return number_format($this->total_price, 2);
    }

    public function getFormattedReceivedDateAttribute(): ?string
    {
        return $this->received_date ? $this->received_date->format('Y-m-d') : null;
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'مستلم' => 'مستلم',
            'في الطريق' => 'في الطريق',
            'معلق' => 'معلق',
            default => $this->status
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'مستلم' => 'green',
            'في الطريق' => 'yellow',
            'معلق' => 'red',
            default => 'gray'
        };
    }

    /**
     * Scopes
     */
    public function scopeReceived($query)
    {
        return $query->where('status', 'مستلم');
    }

    public function scopeInTransit($query)
    {
        return $query->where('status', 'في الطريق');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'معلق');
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Methods
     */
    public function isReceived(): bool
    {
        return $this->status === 'مستلم';
    }

    public function isInTransit(): bool
    {
        return $this->status === 'في الطريق';
    }

    public function isPending(): bool
    {
        return $this->status === 'معلق';
    }

    public function markAsReceived($receivedDate = null): void
    {
        $this->update([
            'status' => 'مستلم',
            'received_date' => $receivedDate ?? now(),
        ]);
    }

    public function markAsInTransit(): void
    {
        $this->update(['status' => 'في الطريق']);
    }

    public function markAsPending(): void
    {
        $this->update(['status' => 'معلق']);
    }

    public function calculateTotalPrice(): float
    {
        $total = $this->quantity * $this->unit_price;
        $this->update(['total_price' => $total]);
        return $total;
    }

    public function updateQuantity(int $newQuantity): void
    {
        $this->update(['quantity' => $newQuantity]);
        $this->calculateTotalPrice();
    }

    public function updateUnitPrice(float $newUnitPrice): void
    {
        $this->update(['unit_price' => $newUnitPrice]);
        $this->calculateTotalPrice();
    }

    public function getFormattedTotalPriceWithCurrency(): string
    {
        return $this->formatted_total_price . ' ريال عماني';
    }

    public function getFormattedUnitPriceWithCurrency(): string
    {
        return $this->formatted_unit_price . ' ريال عماني';
    }

    public function isOverdue(): bool
    {
        return $this->status === 'في الطريق' && 
               $this->purchase->delivery_date && 
               $this->purchase->delivery_date < now();
    }
}
