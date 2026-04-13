import { boot } from "quasar/wrappers";
import {createI18n} from "vue-i18n"
import messages from 'src/i18n'
import App from "src/App.vue";

const i18n = createI18n({
  locale: 'es-ES',
  fallbackLocale: 'en-EN',
  messages
})

export default boot(({ App })) => {
  App.use(i18n)
}

export{i18n}
