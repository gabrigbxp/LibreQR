import translations from "@ui/i18n"
import { useSelector } from "@ui/hooks/useRedux"

type NestedKeyOf<T> = T extends object
    ? {
          [K in keyof T]: K extends string ? `${K}` | `${K}.${NestedKeyOf<T[K]>}` : never
      }[keyof T]
    : never

type TranslationKeys = NestedKeyOf<typeof translations.en>

export default function useTranslation() {
    const locale = useSelector((state) => state.locale.current)
    const t = translations[locale]

    const translate = (key: TranslationKeys, params?: Record<string, string | number>): string => {
        const keys = key.split(".")
        let value: unknown = t

        for (const k of keys) {
            if (typeof value === "object" && value !== null && k in value) {
                value = (value as Record<string, unknown>)[k]
            } else {
                return key
            }
            if (value === undefined) return key
        }

        if (typeof value !== "string") return key

        if (params) {
            return value.replace(/\{\{(\w+)\}\}/g, (_, p) => String(params[p] ?? ""))
        }

        return value
    }

    return { t: translate, locale }
}
