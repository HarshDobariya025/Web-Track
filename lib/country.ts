import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

// ✅ register locale ONCE
countries.registerLocale(enLocale);

export function getCountryCode(countryName: string): string | null {
  return countries.getAlpha2Code(countryName, "en") || null;
}
