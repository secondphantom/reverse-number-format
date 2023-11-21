type SupportedLocale = keyof typeof compactLocaleFormat;
type Options = {
  notation: "standard" | "compact";
};

const compactLocaleFormat: {
  [key in string]: { compactUnit: string; value: number }[];
} = {};

const setCompactLocaleFormatByLocale = (locale: string) => {
  const numberFormat = new Intl.NumberFormat(locale, { notation: "compact" });

  let num = 1;
  let limit = 1000000;
  let compactUnit = "";
  let localeFormatAry = [];
  while (true) {
    num *= 10;
    const formattedStr = numberFormat.format(num);

    const compactUnitMatchAry = formattedStr.match(/[^,.\s\d]/g);
    const digitMatchAry = formattedStr.match(/\d/g);

    if (compactUnitMatchAry === null) continue;
    if (digitMatchAry === null) break;
    const newCompactUnit = compactUnitMatchAry.join("");
    if (compactUnit === newCompactUnit) continue;
    if (num === Infinity) break;
    compactUnit = newCompactUnit;
    localeFormatAry.push({
      compactUnit,
      value: num,
    });
    if (parseInt(digitMatchAry.join("")) > limit) break;
  }
  compactLocaleFormat[locale] = localeFormatAry;
};

const getCompactUnitValue = (
  formattedNumberStr: string,
  locale: SupportedLocale
) => {
  if (!compactLocaleFormat[locale]) {
    setCompactLocaleFormatByLocale(locale);
  }
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
  if (formattedNumberStr.includes("%")) {
    number /= 100;
  }

  return number;
}
