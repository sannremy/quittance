import { ToWords } from "to-words";

const locale = 'fr-FR';

const formatCurrency = (value: number) => {
  return value
    .toLocaleString(locale, { style: 'currency', currency: 'EUR' })
    // AfacadFlux displays a slash instead of a non-breaking space as a thousands separator in fr-FR
    .replace(' ', ' ');
};

const formatDateWithNumber = (date: Date) => {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};

const formatDateWithText = (date: Date) => {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


const toWords = new ToWords({
  localeCode: locale,
  converterOptions: {
    currency: true,
  },
});

const formatCurrencyToWords = (value: number) => {
  return toWords.convert(value).toLocaleLowerCase();
};

export {
  formatCurrency,
  formatDateWithNumber,
  formatDateWithText,
  formatCurrencyToWords,
};