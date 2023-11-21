import { compactLocaleFormat } from "../data/compact.locale.format";
import reverseNumberFormat from "../index";

describe("index", () => {
  const supportedLocale = Object.keys(compactLocaleFormat);

  // style
  //  decimal
  //  currency
  //  percent
  //  unit
  describe("style", () => {
    test.each<{
      message: string;
      dto: {
        locale: string;
        options: {
          style: string;
          currency?: string;
          unit?: string;
          notation: string;
        };
      };
    }>(
      [
        {
          message: "decimal",
          options: {
            style: "decimal",
          },
        },
        {
          message: "currency",
          options: {
            style: "currency",
            currency: "USD",
          },
        },
        {
          message: "decimal",
          options: {
            style: "percent",
          },
        },
        {
          message: "unit",
          options: {
            style: "unit",
            unit: "meter",
          },
        },
      ]
        .map(({ message, options }) => {
          return supportedLocale.map((locale: string) => ({
            message,
            dto: {
              locale,
              options,
            },
          }));
        })
        .flat()
        .map(({ message, dto }) => {
          return ["compact", "standard"].map((notation: string) => ({
            message,
            dto: {
              ...dto,
              options: {
                ...dto.options,
                notation,
              },
            },
          }));
        })
        .flat()
    )("$message", ({ dto: { locale, options } }) => {
      const numberFormat = new Intl.NumberFormat(locale, options as any);

      for (let i = 1; i < 6; i = i + 10) {
        const num = 1000 ** i * 1;
        const formattedNumberStr = numberFormat.format(num);
        const convertedNum = reverseNumberFormat(
          formattedNumberStr,
          locale as any,
          options as any
        );

        expect(num).toEqual(convertedNum);
      }
    });
  });
});
