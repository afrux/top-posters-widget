import app from 'flarum/forum/app';
import Model from 'flarum/common/Model';
import User from 'flarum/common/models/User';
import Forum from 'flarum/common/models/Forum';

import registerWidget from '../common/registerWidget';

app.initializers.add('afrux/top-posters-widget', () => {
  // @ts-ignore
  User.prototype.prettyCommentCount = Model.attribute('afrux-top-posters-widget.prettyCommentCount');
  // @ts-ignore
  Forum.prototype.topPosters = Model.hasMany('topPosters', User);

  // @ts-ignore
  registerWidget(app);
});
