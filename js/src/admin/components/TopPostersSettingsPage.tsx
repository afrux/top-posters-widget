import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Group from 'flarum/common/models/Group';
import icon from 'flarum/common/helpers/icon';
import type Mithril from 'mithril';

export default class TopPostersSettingsPage extends ExtensionPage {
  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    // Initialize the selected groups with an empty array or the saved settings
    this.selected = this.setting('afrux-top-posters-widget.excludeGroups', '[]');
  }

  content() {
    // Parse the selected group IDs from the settings
    const selectedGroupIds = JSON.parse(this.selected());

    return [
      <div className="container">
        <div className="TopPostersSettingsPage">
          <div className="Form-group">
            <h4>{app.translator.trans('afrux-top-posters-widget.admin.settings.info')}</h4>

            {app.store
              .all<Group>('groups')
              .filter((g: Group) => g.id() !== Group.GUEST_ID)
              .map((g: Group) => (
                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedGroupIds.includes(g.id())}
                      onchange={(event: Event) => {
                        const checkbox = event.target as HTMLInputElement;
                        if (checkbox.checked) {
                          selectedGroupIds.push(g.id());
                        } else {
                          const index = selectedGroupIds.indexOf(g.id());
                          if (index !== -1) {
                            selectedGroupIds.splice(index, 1);
                          }
                        }
                        // Update the setting with the new selected groups
                        this.selected(JSON.stringify(selectedGroupIds));
                      }}
                    />
                    {icon(g.icon() || 'fas fa-user')}{g.namePlural()}
                  </label>
                </div>
              ))}
          </div>
          {this.submitButton()}
        </div>
      </div>,
    ];
  }
}
