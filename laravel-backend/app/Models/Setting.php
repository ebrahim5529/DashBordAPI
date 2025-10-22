<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'description',
    ];

    /**
     * Scopes
     */
    public function scopeByKey($query, $key)
    {
        return $query->where('key', $key);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Static Methods
     */
    public static function get($key, $default = null)
    {
        $setting = self::byKey($key)->first();
        
        if (!$setting) {
            return $default;
        }

        return match($setting->type) {
            'boolean' => (bool) $setting->value,
            'integer' => (int) $setting->value,
            'float' => (float) $setting->value,
            'json' => json_decode($setting->value, true),
            default => $setting->value
        };
    }

    public static function set($key, $value, $type = 'string', $description = null): self
    {
        $setting = self::byKey($key)->first();

        $processedValue = match($type) {
            'boolean' => $value ? '1' : '0',
            'integer', 'float' => (string) $value,
            'json' => json_encode($value),
            default => (string) $value
        };

        if ($setting) {
            $setting->update([
                'value' => $processedValue,
                'type' => $type,
                'description' => $description ?? $setting->description,
            ]);
        } else {
            $setting = self::create([
                'key' => $key,
                'value' => $processedValue,
                'type' => $type,
                'description' => $description,
            ]);
        }

        return $setting;
    }

    public static function getBoolean($key, $default = false): bool
    {
        return (bool) self::get($key, $default);
    }

    public static function getInteger($key, $default = 0): int
    {
        return (int) self::get($key, $default);
    }

    public static function getFloat($key, $default = 0.0): float
    {
        return (float) self::get($key, $default);
    }

    public static function getJson($key, $default = []): array
    {
        return self::get($key, $default);
    }

    public static function setBoolean($key, $value, $description = null): self
    {
        return self::set($key, $value, 'boolean', $description);
    }

    public static function setInteger($key, $value, $description = null): self
    {
        return self::set($key, $value, 'integer', $description);
    }

    public static function setFloat($key, $value, $description = null): self
    {
        return self::set($key, $value, 'float', $description);
    }

    public static function setJson($key, $value, $description = null): self
    {
        return self::set($key, $value, 'json', $description);
    }

    /**
     * Methods
     */
    public function getValueAttribute($value)
    {
        return match($this->type) {
            'boolean' => (bool) $value,
            'integer' => (int) $value,
            'float' => (float) $value,
            'json' => json_decode($value, true),
            default => $value
        };
    }

    public function setValueAttribute($value)
    {
        $this->attributes['value'] = match($this->type) {
            'boolean' => $value ? '1' : '0',
            'integer', 'float' => (string) $value,
            'json' => json_encode($value),
            default => (string) $value
        };
    }

    public function isBoolean(): bool
    {
        return $this->type === 'boolean';
    }

    public function isInteger(): bool
    {
        return $this->type === 'integer';
    }

    public function isFloat(): bool
    {
        return $this->type === 'float';
    }

    public function isJson(): bool
    {
        return $this->type === 'json';
    }

    public function isString(): bool
    {
        return $this->type === 'string';
    }

    /**
     * Company Settings
     */
    public static function getCompanyName(): string
    {
        return self::get('company.name', 'شركة أسهل');
    }

    public static function getCompanyEmail(): string
    {
        return self::get('company.email', 'info@easier.com');
    }

    public static function getCompanyPhone(): string
    {
        return self::get('company.phone', '+968 1234 5678');
    }

    public static function getCompanyAddress(): string
    {
        return self::get('company.address', 'سلطنة عمان');
    }

    public static function getCompanyLogo(): string
    {
        return self::get('company.logo', '');
    }

    public static function setCompanyName(string $name): self
    {
        return self::set('company.name', $name, 'string', 'اسم الشركة');
    }

    public static function setCompanyEmail(string $email): self
    {
        return self::set('company.email', $email, 'string', 'بريد الشركة الإلكتروني');
    }

    public static function setCompanyPhone(string $phone): self
    {
        return self::set('company.phone', $phone, 'string', 'هاتف الشركة');
    }

    public static function setCompanyAddress(string $address): self
    {
        return self::set('company.address', $address, 'string', 'عنوان الشركة');
    }

    public static function setCompanyLogo(string $logo): self
    {
        return self::set('company.logo', $logo, 'string', 'شعار الشركة');
    }

    /**
     * System Settings
     */
    public static function getSystemCurrency(): string
    {
        return self::get('system.currency', 'OMR');
    }

    public static function getSystemLanguage(): string
    {
        return self::get('system.language', 'ar');
    }

    public static function getSystemTimezone(): string
    {
        return self::get('system.timezone', 'Asia/Muscat');
    }

    public static function getSystemDateFormat(): string
    {
        return self::get('system.date_format', 'Y-m-d');
    }

    public static function setSystemCurrency(string $currency): self
    {
        return self::set('system.currency', $currency, 'string', 'عملة النظام');
    }

    public static function setSystemLanguage(string $language): self
    {
        return self::set('system.language', $language, 'string', 'لغة النظام');
    }

    public static function setSystemTimezone(string $timezone): self
    {
        return self::set('system.timezone', $timezone, 'string', 'المنطقة الزمنية');
    }

    public static function setSystemDateFormat(string $format): self
    {
        return self::set('system.date_format', $format, 'string', 'تنسيق التاريخ');
    }
}
