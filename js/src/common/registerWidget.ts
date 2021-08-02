import Application from 'flarum/common/Application';
import Widgets from 'flarum/extensions/afrux-forum-widgets-core/common/extend/Widgets';

import TopPostersWidget from './components/TopPostersWidget';

export default function (app: Application) {
  new Widgets()
    .add({
      key: 'topPosters',
      component: TopPostersWidget,
      isDisabled: () => !app.forum.attribute('canSearchUsers'),
      isUnique: true,
      placement: 'end',
      position: 3,
    })
    .extend(app, 'afrux-top-posters-widget');
}
