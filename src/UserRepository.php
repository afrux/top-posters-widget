<?php

/*
 * This file is part of afrux/top-posters-widget.
 *
 * Copyright (c) 2021 Sami Mazouz.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Afrux\TopPosters;

use Afrux\ForumWidgets\SafeCacheRepositoryAdapter;
use Carbon\Carbon;
use Flarum\Post\CommentPost;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Cache\Repository as IlluminateCache;

class UserRepository
{
    static $cacheKey = 'afrux-top-posters-widget.top_poster_counts';
    
    /**
     * @var SafeCacheRepositoryAdapter
     */
    private $cache;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var IlluminateCache
     */
    protected $illuminateCache;

    public function __construct(SafeCacheRepositoryAdapter $cache, SettingsRepositoryInterface $settings, IlluminateCache $illuminateCache)
    {
        $this->cache = $cache;
        $this->settings = $settings;
        $this->illuminateCache = $illuminateCache;
    }

    public function getTopPosters(): array
    {
        return $this->cache->remember(self::$cacheKey, 2400, function (): array {
            $excludeGroups = $this->getexcludeGroups();

            return CommentPost::query()
                ->selectRaw('user_id, count(id) as count')
                ->where('created_at', '>', Carbon::now()->subMonth())
                ->whereNotIn('user_id', function ($query) use ($excludeGroups) {
                    $query->select('user_id')
                        ->from('group_user')
                        ->whereIn('group_id', $excludeGroups);
                })
                ->groupBy('user_id')
                ->orderBy('count', 'desc')
                ->limit(5)
                ->get()
                ->mapWithKeys(function ($post) {
                    return [$post->user_id => (int) $post->count];
                })
                ->toArray();
        }) ?: [];
    }

    protected function getexcludeGroups(): array
    {
        return array_map('intval', json_decode($this->settings->get('afrux-top-posters-widget.excludeGroups'), true));
    }

    public function clearTopPosterCache(): bool
    {
        return $this->illuminateCache->forget(self::$cacheKey);
    }
}
