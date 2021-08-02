import Application from 'flarum/common/Application';
import Widgets from 'flarum/extensions/afrux-forum-widgets-core/common/extend/Widgets';

import TopPostersWidget from './components/TopPostersWidget';

export default function (app: Application) {
  new Widgets()
    .add({
      key: 'topPosters',
      component: TopPostersWidget,
      isDisabled: () => {
        const monthlyCounts = app.forum.attribute('afrux-top-posters-widget.data');

        return !app.forum.attribute('canSearchUsers') || !monthlyCounts || !monthlyCounts.length;
      },
      isUnique: true,
      placement: 'end',
      position: 3,
    })
    .extend(app, 'afrux-top-posters-widget');
}
