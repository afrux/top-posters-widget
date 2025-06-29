import type Application from 'flarum/common/Application';
import Widgets from 'flarum/extensions/afrux-forum-widgets-core/common/extend/Widgets';

import TopPostersWidget from './components/TopPostersWidget';

export default function (app: Application) {
  new Widgets()
    .add({
      key: 'topPosters',
      component: TopPostersWidget,
      isDisabled: () => {
        const loadWithInitialResponse = app.forum.attribute('afrux-forum-widgets-core.preferDataWithInitialLoad');
        const monthlyCounts = app.forum.attribute('afrux-top-posters-widget.topPosterCounts');

        return (!loadWithInitialResponse && !app.forum.attribute('canSearchUsers')) || !monthlyCounts || !Object.keys(monthlyCounts).length;
      },
      isUnique: true,
      placement: 'end',
      position: 3,
    })
    .extend(app, 'afrux-top-posters-widget');
}
