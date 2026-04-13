import { defineBoot } from "#q-app/wrappers";
import {createI18n} from "vue-i18n"
import messages from 'src/i18n'


const i18n = createI18n({
  locale: 'es-ES',
  fallbackLocale: 'en-EN',
  messages
})

export default defineBoot(({ app }) => {
  app.use(i18n)
})

export {i18n}
