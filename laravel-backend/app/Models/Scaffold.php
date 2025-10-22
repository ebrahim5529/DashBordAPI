<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Scaffold extends Model
{
    use HasFactory;

    protected $fillable = [
        'scaffold_number',
        'type',
        'size',
        'material',
        'condition',
        'status',
        'quantity',
        'available_quantity',
        'location',
        'warehouse_location',
        'selling_price',
        'daily_rental_price',
        'monthly_rental_price',
        'entry_date',
        'last_maintenance_date',
        'next_maintenance_date',
        'images',
        'attachments',
        'notes',
        'supplier_id',
    ];

    protected $casts = [
        'size' => 'array',
        'images' => 'array',
        'attachments' => 'array',
        'entry_date' => 'date',
        'last_maintenance_date' => 'date',
        'next_maintenance_date' => 'date',
        'quantity' => 'integer',
        'available_quantity' => 'integer',
        'selling_price' => 'decimal:2',
        'daily_rental_price' => 'decimal:2',
        'monthly_rental_price' => 'decimal:2',
    ];

    /**
     * العلاقات
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function maintenanceRecords(): HasMany
    {
        return $this->hasMany(ScaffoldMaintenance::class);
    }

    /**
     * Accessors
     */
    public function getTypeNameAttribute(): string
    {
        return match($this->type) {
            'STANDARD' => 'عادي',
            'HEAVY_DUTY' => 'ثقيل',
            'LIGHT_DUTY' => 'خفيف',
            'MOBILE' => 'متحرك',
            default => $this->type
        };
    }

    public function getMaterialNameAttribute(): string
    {
        return match($this->material) {
            'STEEL' => 'حديد',
            'ALUMINUM' => 'ألومنيوم',
            'WOOD' => 'خشب',
            'COMPOSITE' => 'مركب',
            default => $this->material
        };
    }

    public function getConditionNameAttribute(): string
    {
        return match($this->condition) {
            'NEW' => 'جديد',
            'USED' => 'مستعمل',
            'GOOD' => 'جيد',
            'FAIR' => 'مقبول',
            'POOR' => 'ضعيف',
            default => $this->condition
        };
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'AVAILABLE' => 'متاح',
            'RENTED' => 'مستأجر',
            'SOLD' => 'مباع',
            'MAINTENANCE' => 'صيانة',
            'RESERVED' => 'محجوز',
            default => $this->status
        };
    }

    public function getFormattedEntryDateAttribute(): string
    {
        return $this->entry_date->format('Y-m-d');
    }

    public function getFormattedLastMaintenanceDateAttribute(): ?string
    {
        return $this->last_maintenance_date ? $this->last_maintenance_date->format('Y-m-d') : null;
    }

    public function getFormattedNextMaintenanceDateAttribute(): ?string
    {
        return $this->next_maintenance_date ? $this->next_maintenance_date->format('Y-m-d') : null;
    }

    public function getSizeDescriptionAttribute(): string
    {
        $size = $this->size;
        return "{$size['height']}m × {$size['width']}m × {$size['length']}m";
    }

    public function getImagesListAttribute(): array
    {
        return $this->images ?? [];
    }

    public function getAttachmentsListAttribute(): array
    {
        return $this->attachments ?? [];
    }

    /**
     * Scopes
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'AVAILABLE')
                    ->where('available_quantity', '>', 0);
    }

    public function scopeRented($query)
    {
        return $query->where('status', 'RENTED');
    }

    public function scopeSold($query)
    {
        return $query->where('status', 'SOLD');
    }

    public function scopeMaintenance($query)
    {
        return $query->where('status', 'MAINTENANCE');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByMaterial($query, $material)
    {
        return $query->where('material', $material);
    }

    public function scopeByCondition($query, $condition)
    {
        return $query->where('condition', $condition);
    }

    public function scopeNeedsMaintenance($query)
    {
        return $query->where('next_maintenance_date', '<=', now())
                    ->where('status', '!=', 'MAINTENANCE');
    }

    /**
     * Methods
     */
    public function isAvailable(): bool
    {
        return $this->status === 'AVAILABLE' && $this->available_quantity > 0;
    }

    public function isRented(): bool
    {
        return $this->status === 'RENTED';
    }

    public function isSold(): bool
    {
        return $this->status === 'SOLD';
    }

    public function isUnderMaintenance(): bool
    {
        return $this->status === 'MAINTENANCE';
    }

    public function isReserved(): bool
    {
        return $this->status === 'RESERVED';
    }

    public function needsMaintenance(): bool
    {
        return $this->next_maintenance_date && 
               $this->next_maintenance_date <= now() && 
               $this->status !== 'MAINTENANCE';
    }

    public function markAsRented(int $quantity = 1): void
    {
        $newAvailableQuantity = max(0, $this->available_quantity - $quantity);
        
        if ($newAvailableQuantity === 0) {
            $this->update(['status' => 'RENTED']);
        }
        
        $this->update(['available_quantity' => $newAvailableQuantity]);
    }

    public function markAsReturned(int $quantity = 1): void
    {
        $newAvailableQuantity = min($this->quantity, $this->available_quantity + $quantity);
        
        if ($newAvailableQuantity > 0) {
            $this->update(['status' => 'AVAILABLE']);
        }
        
        $this->update(['available_quantity' => $newAvailableQuantity]);
    }

    public function markAsSold(int $quantity = 1): void
    {
        $newQuantity = max(0, $this->quantity - $quantity);
        $newAvailableQuantity = max(0, $this->available_quantity - $quantity);
        
        if ($newQuantity === 0) {
            $this->update(['status' => 'SOLD']);
        }
        
        $this->update([
            'quantity' => $newQuantity,
            'available_quantity' => $newAvailableQuantity,
        ]);
    }

    public function markAsMaintenance(): void
    {
        $this->update(['status' => 'MAINTENANCE']);
    }

    public function markAsAvailable(): void
    {
        $this->update(['status' => 'AVAILABLE']);
    }

    public function reserve(int $quantity = 1): void
    {
        $this->update([
            'status' => 'RESERVED',
            'available_quantity' => max(0, $this->available_quantity - $quantity),
        ]);
    }

    public function unreserve(int $quantity = 1): void
    {
        $newAvailableQuantity = min($this->quantity, $this->available_quantity + $quantity);
        
        if ($newAvailableQuantity > 0) {
            $this->update([
                'status' => 'AVAILABLE',
                'available_quantity' => $newAvailableQuantity,
            ]);
        }
    }

    public function updateMaintenanceDate($nextDate): void
    {
        $this->update([
            'last_maintenance_date' => now(),
            'next_maintenance_date' => $nextDate,
        ]);
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
}
