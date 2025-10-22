<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SupplierPurchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_number',
        'supplier_id',
        'purchase_date',
        'delivery_date',
        'status',
        'total_amount',
        'invoice_id',
        'notes',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'delivery_date' => 'date',
        'total_amount' => 'decimal:2',
    ];

    /**
     * العلاقات
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(SupplierInvoice::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseItem::class);
    }

    /**
     * Accessors
     */
    public function getFormattedPurchaseDateAttribute(): string
    {
        return $this->purchase_date->format('Y-m-d');
    }

    public function getFormattedDeliveryDateAttribute(): ?string
    {
        return $this->delivery_date ? $this->delivery_date->format('Y-m-d') : null;
    }

    public function getFormattedTotalAmountAttribute(): string
    {
        return number_format($this->total_amount, 2);
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'PENDING' => 'قيد الانتظار',
            'CONFIRMED' => 'مؤكدة',
            'DELIVERED' => 'مستلمة',
            'CANCELLED' => 'ملغية',
            default => $this->status
        };
    }

    public function getItemsCountAttribute(): int
    {
        return $this->items()->count();
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'PENDING');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'CONFIRMED');
    }

    public function scopeDelivered($query)
    {
        return $query->where('status', 'DELIVERED');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'CANCELLED');
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('purchase_date', [$startDate, $endDate]);
    }

    public function scopeBySupplier($query, $supplierId)
    {
        return $query->where('supplier_id', $supplierId);
    }

    /**
     * Methods
     */
    public function isPending(): bool
    {
        return $this->status === 'PENDING';
    }

    public function isConfirmed(): bool
    {
        return $this->status === 'CONFIRMED';
    }

    public function isDelivered(): bool
    {
        return $this->status === 'DELIVERED';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'CANCELLED';
    }

    public function confirm(): void
    {
        $this->update(['status' => 'CONFIRMED']);
    }

    public function markAsDelivered($deliveryDate = null): void
    {
        $this->update([
            'status' => 'DELIVERED',
            'delivery_date' => $deliveryDate ?? now(),
        ]);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'CANCELLED']);
    }

    public function calculateTotalAmount(): float
    {
        $total = $this->items()->sum('total_price');
        $this->update(['total_amount' => $total]);
        return $total;
    }

    public function addItem(string $name, string $description, int $quantity, float $unitPrice, string $category, string $unit = 'قطعة'): PurchaseItem
    {
        $totalPrice = $quantity * $unitPrice;
        
        $item = $this->items()->create([
            'name' => $name,
            'description' => $description,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'total_price' => $totalPrice,
            'category' => $category,
            'unit' => $unit,
        ]);

        $this->calculateTotalAmount();
        return $item;
    }

    public function removeItem(int $itemId): bool
    {
        $deleted = $this->items()->where('id', $itemId)->delete();
        if ($deleted) {
            $this->calculateTotalAmount();
        }
        return $deleted;
    }

    public function getFormattedTotalAmountWithCurrency(): string
    {
        return $this->formatted_total_amount . ' ريال عماني';
    }

    public function isOverdue(): bool
    {
        return $this->status === 'CONFIRMED' && 
               $this->delivery_date && 
               $this->delivery_date < now();
    }

    public function getDaysOverdue(): int
    {
        if ($this->isOverdue()) {
            return now()->diffInDays($this->delivery_date);
        }
        return 0;
    }
}
