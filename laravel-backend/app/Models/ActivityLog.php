<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'action',
        'description',
        'entity_type',
        'entity_id',
        'user_id',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'user_agent' => 'string',
    ];

    /**
     * العلاقات
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Accessors
     */
    public function getActionNameAttribute(): string
    {
        return match($this->action) {
            'CREATE' => 'إنشاء',
            'UPDATE' => 'تحديث',
            'DELETE' => 'حذف',
            'VIEW' => 'عرض',
            'LOGIN' => 'تسجيل دخول',
            'LOGOUT' => 'تسجيل خروج',
            'DOWNLOAD' => 'تحميل',
            'UPLOAD' => 'رفع',
            default => $this->action
        };
    }

    public function getFormattedCreatedAtAttribute(): string
    {
        return $this->created_at->format('Y-m-d H:i:s');
    }

    /**
     * Scopes
     */
    public function scopeByAction($query, $action)
    {
        return $query->where('action', $action);
    }

    public function scopeByEntity($query, $entityType, $entityId = null)
    {
        $query = $query->where('entity_type', $entityType);
        
        if ($entityId) {
            $query->where('entity_id', $entityId);
        }
        
        return $query;
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Static Methods
     */
    public static function log($action, $description, $entityType = null, $entityId = null, $userId = null): self
    {
        return self::create([
            'action' => $action,
            'description' => $description,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'user_id' => $userId ?? auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public static function logCreate($entityType, $entityId, $description = null): self
    {
        return self::log('CREATE', $description ?? "تم إنشاء {$entityType} رقم {$entityId}", $entityType, $entityId);
    }

    public static function logUpdate($entityType, $entityId, $description = null): self
    {
        return self::log('UPDATE', $description ?? "تم تحديث {$entityType} رقم {$entityId}", $entityType, $entityId);
    }

    public static function logDelete($entityType, $entityId, $description = null): self
    {
        return self::log('DELETE', $description ?? "تم حذف {$entityType} رقم {$entityId}", $entityType, $entityId);
    }

    public static function logView($entityType, $entityId, $description = null): self
    {
        return self::log('VIEW', $description ?? "تم عرض {$entityType} رقم {$entityId}", $entityType, $entityId);
    }

    public static function logLogin($userId, $description = null): self
    {
        return self::log('LOGIN', $description ?? 'تم تسجيل الدخول', null, null, $userId);
    }

    public static function logLogout($userId, $description = null): self
    {
        return self::log('LOGOUT', $description ?? 'تم تسجيل الخروج', null, null, $userId);
    }

    public static function logDownload($entityType, $entityId, $description = null): self
    {
        return self::log('DOWNLOAD', $description ?? "تم تحميل {$entityType} رقم {$entityId}", $entityType, $entityId);
    }

    public static function logUpload($entityType, $entityId, $description = null): self
    {
        return self::log('UPLOAD', $description ?? "تم رفع ملف لـ {$entityType} رقم {$entityId}", $entityType, $entityId);
    }

    /**
     * Methods
     */
    public function getEntityName(): string
    {
        return $this->entity_type . ' #' . $this->entity_id;
    }

    public function isCreateAction(): bool
    {
        return $this->action === 'CREATE';
    }

    public function isUpdateAction(): bool
    {
        return $this->action === 'UPDATE';
    }

    public function isDeleteAction(): bool
    {
        return $this->action === 'DELETE';
    }

    public function isViewAction(): bool
    {
        return $this->action === 'VIEW';
    }

    public function isLoginAction(): bool
    {
        return $this->action === 'LOGIN';
    }

    public function isLogoutAction(): bool
    {
        return $this->action === 'LOGOUT';
    }

    public function getShortDescription(int $length = 100): string
    {
        return strlen($this->description) > $length 
            ? substr($this->description, 0, $length) . '...'
            : $this->description;
    }
}
