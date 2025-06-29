import app from 'flarum/admin/app';
import registerWidget from '../common/registerWidget';
import ExtensionPage from "flarum/admin/components/ExtensionPage";
import Group from 'flarum/common/models/Group';
import Badge from 'flarum/common/components/Badge';

app.initializers.add('afrux/top-posters-widget', () => {
  // @ts-ignore
  registerWidget(app);

  app.extensionData
    .for('afrux-top-posters-widget')
    .registerSetting(function (this: ExtensionPage) {
      const selected = this.setting('afrux-top-posters-widget.excludeGroups', '[]');
      let selectedGroupIds = JSON.parse(selected());

      return (
        <div className="Form-group EditUserModal-groups">
          <label>{app.translator.trans('afrux-top-posters-widget.admin.settings.info')}</label>

          {app.store
            .all<Group>('groups')
            .filter((g: Group) => g.id() !== Group.GUEST_ID)
            .map((g: Group) => (
              <div>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedGroupIds.includes(g.id())}
                    onchange={(event: Event) => {
                      const checkbox = event.target as HTMLInputElement;

                      if (checkbox.checked) {
                        selectedGroupIds.push(g.id());
                      } else {
                        selectedGroupIds = selectedGroupIds.filter((id: string) => id !== g.id());
                      }

                      selected(JSON.stringify(selectedGroupIds));
                    }}
                  />
                  <Badge icon={g.icon() || 'fas fa-user'} color={g.color()}/> {g.namePlural()}
                </label>
              </div>
            ))}
        </div>
      );
    });
});
