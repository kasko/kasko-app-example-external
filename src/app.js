import TitleComponent from './components/custom-title.jsx';
import { setAgeFromDobService } from './services/set-age-from-dob.js';
import { disallowOddNumberValidator } from './validators/disallow-odd-number.js';

import './app.css';

window.registerKaskoPlugin('webapp-plugin', (kasko) => {
  setAgeFromDobService(kasko);

  return {
    components: [
      {
        type: 'custom-title',
        component: TitleComponent(kasko),
      },
    ],
    validators: [
      {
        name: 'disallowed_odd_number',
        validate: disallowOddNumberValidator(kasko),
      }
    ],
  };
});
