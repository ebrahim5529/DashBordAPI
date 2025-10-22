<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'content',
        'hashtags',
        'created_by',
    ];

    protected $casts = [
        'hashtags' => 'array',
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
     * Accessors
     */
    public function getHashtagsListAttribute(): array
    {
        return $this->hashtags ?? [];
    }

    /**
     * Methods
     */
    public function addHashtag(string $hashtag): void
    {
        $hashtags = $this->hashtags ?? [];
        if (!in_array($hashtag, $hashtags)) {
            $hashtags[] = $hashtag;
            $this->update(['hashtags' => $hashtags]);
        }
    }

    public function removeHashtag(string $hashtag): void
    {
        $hashtags = $this->hashtags ?? [];
        $hashtags = array_filter($hashtags, fn($h) => $h !== $hashtag);
        $this->update(['hashtags' => array_values($hashtags)]);
    }

    public function hasHashtag(string $hashtag): bool
    {
        return in_array($hashtag, $this->hashtags ?? []);
    }

    public function extractHashtagsFromContent(): array
    {
        preg_match_all('/#(\w+)/', $this->content, $matches);
        return $matches[1] ?? [];
    }
}
