import reverseNumberFormat from "../index";
import locale from "locale-codes";
describe("index", () => {
  const supportedLocale = Array.from(
    new Set(
      locale.all
        .map((info) => {
          return info["iso639-1"];
        })
        .filter((v) => v)
    )
  ) as string[];

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
            message: `${message} ${locale}`,
            dto: {
              locale,
              options,
            },
          }));
        })
        .flat()
        .map(({ message, dto }) => {
          return ["compact", "standard"].map((notation: string) => ({
            message: `${message} ${notation}`,
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
    )("$message", ({ message, dto: { locale, options } }) => {
      const numberFormat = new Intl.NumberFormat(locale, options as any);

      if (message !== "decimal hi compact") return;
      for (let i = 1; i < 20; i = i + 10) {
        const inputNum = 10 ** i * 1;
        const formattedNumberStr = numberFormat.format(inputNum);
        console.log(inputNum);
        console.log(formattedNumberStr);

        const convertedNum = reverseNumberFormat(
          formattedNumberStr,
          locale as any,
          options as any
        );

        expect(inputNum).toEqual(convertedNum);
      }
    });
  });
});
