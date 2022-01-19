import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import Backend from 'i18next-xhr-backend';
import translationEn from "./locales/english/translationEN.json"
import translationTe from "./locales/telugu/translationTE.json"
import translationHi from "./locales/hindi/translationHN.json"
import translationUr from "./locales/urdu/translationUR.json"
import translationAr from "./locales/arabic/translationAR.json"
import translationTa from "./locales/tamil/translationTA.json"
import translationKn from "./locales/kannada/translationKN.json"
import translationMl from "./locales/malyalam/translationML.json"
import translationMr from "./locales/marati/translationMR.json"
import translationGu from "./locales/gujarathi/translationGU.json"

import {localStore } from "./helpers";

const resources={
    en:{
        translation:translationEn
    },
    te:{
        translation:translationTe
    },
    hi:{
        translation:translationHi
    },
    ur:{
        translation:translationUr
    },
    ar:{
        translation:translationAr
    },
    ta:{
        translation:translationTa
    },
    kn:{
        translation:translationKn
    },
    ml:{
        translation:translationMl
    },
    mr:{
        translation:translationMr
    },
    gu:{
        translation:translationGu
    }
}

let language=localStore.getItem('language') || 'en'

i18n.use(Backend)
.use(initReactI18next).init({
    resources,
    fallbackLng: language,
    debug: true,

    interpolation: {
      escapeValue: false,
    }
})

export default i18n;