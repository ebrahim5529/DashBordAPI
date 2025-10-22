<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Delivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'receipt_number',
        'customer_id',
        'customer_name',
        'customer_phone',
        'delivery_date',
        'delivery_address',
        'driver_id',
        'driver_name',
        'driver_phone',
        'items_count',
        'total_items',
        'value',
        'status',
        'notes',
        'completed_date',
        'receiver_name',
        'receiver_phone',
        'receiver_signature',
        'deliverer_signature',
        'signature',
        'images',
        'related_orders',
    ];

    protected $casts = [
        'delivery_date' => 'date',
        'completed_date' => 'date',
        'images' => 'array',
        'related_orders' => 'array',
        'value' => 'decimal:2',
        'items_count' => 'integer',
        'total_items' => 'integer',
    ];

    /**
     * العلاقات
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'driver_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(DeliveryItem::class);
    }

    /**
     * Accessors
     */
    public function getFormattedDeliveryDateAttribute(): string
    {
        return $this->delivery_date->format('Y-m-d');
    }

    public function getFormattedCompletedDateAttribute(): ?string
    {
        return $this->completed_date ? $this->completed_date->format('Y-m-d') : null;
    }

    public function getFormattedValueAttribute(): string
    {
        return number_format($this->value, 2);
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'pending' => 'قيد الانتظار',
            'completed' => 'مكتمل',
            'cancelled' => 'ملغي',
            default => $this->status
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'yellow',
            'completed' => 'green',
            'cancelled' => 'red',
            default => 'gray'
        };
    }

    public function getImagesListAttribute(): array
    {
        return $this->images ?? [];
    }

    public function getRelatedOrdersListAttribute(): array
    {
        return $this->related_orders ?? [];
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopeByDate($query, $date)
    {
        return $query->whereDate('delivery_date', $date);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('delivery_date', [$startDate, $endDate]);
    }

    public function scopeByDriver($query, $driverId)
    {
        return $query->where('driver_id', $driverId);
    }

    public function scopeByCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    /**
     * Methods
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function complete($completedDate = null): void
    {
        $this->update([
            'status' => 'completed',
            'completed_date' => $completedDate ?? now(),
        ]);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }

    public function addItem(string $name, int $quantity, string $condition = 'good', string $notes = null): DeliveryItem
    {
        return $this->items()->create([
            'name' => $name,
            'quantity' => $quantity,
            'condition' => $condition,
            'notes' => $notes,
        ]);
    }

    public function removeItem(int $itemId): bool
    {
        return $this->items()->where('id', $itemId)->delete();
    }

    public function updateItemsCount(): void
    {
        $count = $this->items()->count();
        $totalItems = $this->items()->sum('quantity');
        
        $this->update([
            'items_count' => $count,
            'total_items' => $totalItems,
        ]);
    }

    public function addSignature(string $signatureData, string $signerType = 'receiver'): void
    {
        if ($signerType === 'receiver') {
            $this->update(['receiver_signature' => $signatureData]);
        } else {
            $this->update(['deliverer_signature' => $signatureData]);
        }
    }

    public function hasReceiverSignature(): bool
    {
        return !empty($this->receiver_signature);
    }

    public function hasDelivererSignature(): bool
    {
        return !empty($this->deliverer_signature);
    }

    public function addImage(string $imagePath): void
    {
        $images = $this->images ?? [];
        $images[] = $imagePath;
        $this->update(['images' => $images]);
    }

    public function removeImage(string $imagePath): void
    {
        $images = $this->images ?? [];
        $images = array_filter($images, fn($img) => $img !== $imagePath);
        $this->update(['images' => array_values($images)]);
    }

    public function addRelatedOrder(string $orderNumber): void
    {
        $orders = $this->related_orders ?? [];
        if (!in_array($orderNumber, $orders)) {
            $orders[] = $orderNumber;
            $this->update(['related_orders' => $orders]);
        }
    }

    public function removeRelatedOrder(string $orderNumber): void
    {
        $orders = $this->related_orders ?? [];
        $orders = array_filter($orders, fn($order) => $order !== $orderNumber);
        $this->update(['related_orders' => array_values($orders)]);
    }

    public function getFormattedValueWithCurrency(): string
    {
        return $this->formatted_value . ' ريال عماني';
    }

    public function isOverdue(): bool
    {
        return $this->status === 'pending' && $this->delivery_date < now();
    }

    public function getDaysOverdue(): int
    {
        if ($this->isOverdue()) {
            return now()->diffInDays($this->delivery_date);
        }
        return 0;
    }
}
