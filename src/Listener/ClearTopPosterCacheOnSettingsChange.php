<?php

namespace Afrux\TopPosters\Listener;

use Afrux\TopPosters\UserRepository;
use Flarum\Settings\Event\Saved;
use Illuminate\Support\Arr;

class ClearTopPosterCacheOnSettingsChange
{
    /**
     * @var UserRepository
     */
    private $repository;
    
    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
    }
    
    public function handle(Saved $event)
    {
        if (Arr::get($event->settings, 'afrux-top-posters-widget.excludeGroups')) {
            $this->repository->clearTopPosterCache();
        }
    }
}
