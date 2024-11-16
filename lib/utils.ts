import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatCurrency, formatCurrencyToWords, formatDateWithNumber, formatDateWithText } from "./string";
import { QuittanceProps } from "@/app/quittance/quittance";
import data from "@/app/data.json";
import { PDFVersion } from "@react-pdf/types/pdf";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatQuittanceProps({
  startDate,
  endDate,
  paymentDate,
  rent,
  text,
  landlord,
  tenant,
  period,
}: {
  startDate: Date | string;
  endDate: Date | string;
  paymentDate: Date | string;
  rent: {
    amounts: {
      label: string;
      amount: number;
    }[];
    currency: string;
    address: string;
    city: string;
    zipCode: string;
  };
  landlord: {
    title: string;
    name: string;
    address: string;
    zipCode: string;
    city: string;
  };
  tenant: {
    title: string;
    name: string;
    address: string;
    city: string;
    zipCode: string;
  };
  text: string;
  period: string;
}): QuittanceProps {
  const startDateFmt = startDate instanceof Date ? startDate : new Date(startDate);
  const endDateFmt = endDate instanceof Date ? endDate : new Date(endDate);
  const paymentDateFmt = formatDateWithNumber(paymentDate instanceof Date ? paymentDate : new Date(paymentDate));

  const totalAmount =
    rent.amounts.reduce((acc, { amount }) => acc + amount * 100, 0) / 100;

  const textFmt = text
    .replaceAll("{landlordName}", landlord.name)
    .replaceAll("{tenantTitle}", tenant.title)
    .replaceAll("{tenantName}", tenant.name)
    .replaceAll("{totalAmountWords}", formatCurrencyToWords(totalAmount))
    .replaceAll("{totalAmount}", formatCurrency(totalAmount))
    .replaceAll("{startDate}", formatDateWithNumber(startDateFmt))
    .replaceAll("{endDate}", formatDateWithNumber(endDateFmt));

  const periodFmt = period
    .replaceAll("{startDate}", formatDateWithText(startDateFmt))
    .replaceAll("{endDate}", formatDateWithText(endDateFmt));

  const rentFmt = {
    ...rent,
    amounts: rent.amounts.map(({ amount, label }) => ({
      label,
      amount: formatCurrency(amount),
    })),
  };

  return {
    ...data,
    startDate: startDateFmt,
    endDate: endDateFmt,
    paymentDate: paymentDateFmt,
    period: periodFmt,
    text: textFmt,
    rent: rentFmt,
    totalAmount: formatCurrency(totalAmount),
    metadata: {
      ...data.metadata,
      pdfVersion: data.metadata.pdfVersion as PDFVersion,
    },
  };
}