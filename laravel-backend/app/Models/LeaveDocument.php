<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'leave_id',
        'name',
        'size',
        'type',
        'url',
        'uploaded_at',
    ];

    protected $casts = [
        'size' => 'integer',
        'uploaded_at' => 'datetime',
    ];

    /**
     * العلاقات
     */
    public function leave(): BelongsTo
    {
        return $this->belongsTo(Leave::class);
    }

    /**
     * Accessors
     */
    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getFormattedUploadedAtAttribute(): string
    {
        return $this->uploaded_at->format('Y-m-d H:i:s');
    }

    public function getTypeNameAttribute(): string
    {
        return match($this->type) {
            'medical_certificate' => 'شهادة طبية',
            'emergency_proof' => 'إثبات حالة طارئة',
            'study_certificate' => 'شهادة دراسية',
            'other' => 'أخرى',
            default => $this->type
        };
    }

    public function getFileUrlAttribute(): string
    {
        return asset('storage/' . $this->url);
    }

    /**
     * Methods
     */
    public function isImage(): bool
    {
        $imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        $extension = strtolower(pathinfo($this->url, PATHINFO_EXTENSION));
        return in_array($extension, $imageTypes);
    }

    public function isPdf(): bool
    {
        $extension = strtolower(pathinfo($this->url, PATHINFO_EXTENSION));
        return $extension === 'pdf';
    }

    public function isDocument(): bool
    {
        $documentTypes = ['pdf', 'doc', 'docx', 'txt'];
        $extension = strtolower(pathinfo($this->url, PATHINFO_EXTENSION));
        return in_array($extension, $documentTypes);
    }

    public function deleteFile(): bool
    {
        $filePath = storage_path('app/public/' . $this->url);
        if (file_exists($filePath)) {
            return unlink($filePath);
        }
        return false;
    }
}
