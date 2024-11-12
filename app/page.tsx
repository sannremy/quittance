import data from "@/app/data.json";
import PDFQuittance, { type QuittanceProps } from "@/app/quittance";
import {
  formatCurrency,
  formatCurrencyToWords,
  formatDateWithNumber,
  formatDateWithText,
} from "@/lib/string";

export default function Home() {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const paymentDate = formatDateWithNumber(new Date(data.paymentDate));

  const totalAmount =
    data.rent.amounts.reduce((acc, { amount }) => acc + amount * 100, 0) / 100;

  const text = data.text
    .replaceAll("{landlordName}", data.landlord.name)
    .replaceAll("{tenantTitle}", data.tenant.title)
    .replaceAll("{tenantName}", data.tenant.name)
    .replaceAll("{totalAmountWords}", formatCurrencyToWords(totalAmount))
    .replaceAll("{totalAmount}", formatCurrency(totalAmount))
    .replaceAll("{startDate}", formatDateWithNumber(startDate))
    .replaceAll("{endDate}", formatDateWithNumber(endDate));

  const period = data.period
    .replaceAll("{startDate}", formatDateWithText(startDate))
    .replaceAll("{endDate}", formatDateWithText(endDate));

  const rent = {
    ...data.rent,
    amounts: data.rent.amounts.map(({ amount, label }) => ({
      label,
      amount: formatCurrency(amount),
    })),
  };

  const quittanceProps = {
    ...data,
    startDate,
    endDate,
    paymentDate,
    period,
    text,
    rent,
    totalAmount: formatCurrency(totalAmount),
  } as QuittanceProps;

  return <PDFQuittance {...quittanceProps} />;
}
