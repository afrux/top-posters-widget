import app from 'flarum/admin/app';
import registerWidget from '../common/registerWidget';
import TopPostersSettingsPage from './components/TopPostersSettingsPage';

app.initializers.add('afrux/top-posters-widget', () => {
  app.extensionData.for('afrux-top-posters-widget').registerPage(TopPostersSettingsPage);
  registerWidget(app);
});
