import * as Mithril from 'mithril';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import avatar from 'flarum/common/helpers/avatar';
import icon from 'flarum/common/helpers/icon';
import Widget from 'flarum/extensions/afrux-forum-widgets-core/common/components/Widget';
import type User from 'flarum/common/models/User';

export default class TopPostersWidget extends Widget {
  private monthlyCounts!: any;

  oninit(vnode): void {
    super.oninit(vnode);

    this.monthlyCounts = app.forum.attribute('afrux-top-posters-widget.topPosterCounts');
    this.loadWithInitialResponse = app.forum.attribute('afrux-forum-widgets-core.preferDataWithInitialLoad');
    this.attrs.state.users ??= [];
    this.attrs.state.isLoading ??= true;
    this.attrs.state.hasLoaded ??= false;
  }

  oncreate(vnode): void {
    super.oncreate(vnode);

    if (!this.attrs.state.hasLoaded) {
      setTimeout(this.load.bind(this), this.loadWithInitialResponse ? 0 : 800);
    }
  }

  className(): string {
    return 'Afrux-TopPostersWidget';
  }

  icon(): string {
    return 'fas fa-sort-numeric-down';
  }

  title(): string {
    return app.translator.trans('afrux-top-posters-widget.forum.widget.title');
  }

  description(): string {
    return '';
  }

  content(): Mithril.Children {
    if (this.attrs.state.isLoading) {
      return <LoadingIndicator />;
    }

    const users = this.attrs.state.users.sort((a: User, b: User) => this.monthlyCounts[b.id()] - this.monthlyCounts[a.id()]);

    return (
      <div className="Afrux-TopPostersWidget-users">
        {users.map((user: User) => (
          <div className="Afrux-TopPostersWidget-users-item">
            <div className="Afrux-TopPostersWidget-users-item-avatar">{avatar(user)}</div>
            <div className="Afrux-TopPostersWidget-users-item-content">
              <div className="Afrux-TopPostersWidget-users-item-name">{user.displayName()}</div>
              <div className="Afrux-TopPostersWidget-users-item-value">
                {icon('fas fa-comment-dots')} {this.monthlyCounts[user.id()]}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  load(): void {
    if (this.loadWithInitialResponse) {
      this.setResults(app.forum.topPosters());

      return;
    }

    this.attrs.state.isLoading = true;

    app.store.find('users', { filter: { top_poster: true } }).then((users: User[]) => {
      this.setResults(users);
    });
  }

  setResults(users) {
    this.attrs.state.users = users;
    this.attrs.state.isLoading = false;
    this.attrs.state.hasLoaded = true;
    m.redraw();
  }
}
