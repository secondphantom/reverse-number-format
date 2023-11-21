import { compactLocaleFormat } from "./data/compact.locale.format";

type SupportedLocale = keyof typeof compactLocaleFormat;
type Options = {
  notation: "standard" | "compact";
};

const getCompactUnitValue = (
  formattedNumberStr: string,
  locale: SupportedLocale
) => {
  const curCompactLocaleFormat = compactLocaleFormat[locale];
  const filteredList = curCompactLocaleFormat.filter(({ compactUnit }) => {
    return formattedNumberStr.includes(compactUnit);
  });

  if (filteredList.length === 0) {
    return 1;
  }

  return filteredList[0].value;
};

export default function reverseNumberFormat(
  formattedNumberStr: string,
  locale: SupportedLocale,
  options?: Options
) {
  const { notation } = {
    notation: "standard",
    ...options,
  };

  const onlyNumberStr = formattedNumberStr.match(/(\.?)(E?)\d(\.?)/g)?.join("");
  if (!onlyNumberStr) throw new Error("Invalid input number string");
  let number = parseFloat(onlyNumberStr);
  if (notation === "compact") {
    number *= getCompactUnitValue(formattedNumberStr, locale);
  }

  return number;
}
