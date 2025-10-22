import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatCurrency, formatCurrencyToWords, formatDateWithNumber, formatDateWithText } from "./string";
import { QuittanceProps } from "@/app/quittance/quittance";
import data from "@/app/data.json";
import { PDFVersion } from "@react-pdf/types/pdf";
import { EcheanceProps } from "@/app/echeance/echeance";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const pdfVersion = "1.7ext3" as PDFVersion;

export function formatQuittanceProps({
  startDate,
  endDate,
  paymentDate,
  rentType,
  rent,
  landlord,
  tenant,
}: {
  startDate: Date | string;
  endDate: Date | string;
  paymentDate: Date | string;
  rentType: string;
  rent: {
    [key: string]: {
      amounts: {
        label: string;
        amount: number;
      }[];
      currency: string;
      address: string;
      city: string;
      zipCode: string;
    };
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
}): QuittanceProps {
  const startDateFmt = startDate instanceof Date ? startDate : new Date(startDate);
  const endDateFmt = endDate instanceof Date ? endDate : new Date(endDate);
  const paymentDateFmt = formatDateWithNumber(paymentDate instanceof Date ? paymentDate : new Date(paymentDate));

  const specificRent = rent[rentType];

  const totalAmount =
  specificRent.amounts.reduce((acc, { amount }) => acc + amount * 100, 0) / 100;
  
  const title = `Quittance de loyer (${rentType})`;

  const periodText = "Du {startDate} au {endDate}"

  const descriptionText = "Nous soussignées, {landlordName}, propriétaires du logement désigné ci-dessus, déclare avoir reçu de {tenantTitle} {tenantName}, la somme de {totalAmountWords} ({totalAmount}) au titre du paiement du loyer et des charges pour la période de location du {startDate} au {endDate} et lui en donne quittance, sous réserve de tous nos droits.";
  const legalText = "Cette quittance annule tous les reçus qui auraient pu être établis précédemment en cas de paiement partiel du montant du présent terme. Elle est à conserver pendant trois ans par le locataire (loi n° 89-462 du 6 juillet 1989 : art. 7-1).";

  const textFmt = descriptionText
    .replaceAll("{landlordName}", landlord.name)
    .replaceAll("{tenantTitle}", tenant.title)
    .replaceAll("{tenantName}", tenant.name)
    .replaceAll("{totalAmountWords}", formatCurrencyToWords(totalAmount))
    .replaceAll("{totalAmount}", formatCurrency(totalAmount))
    .replaceAll("{startDate}", formatDateWithNumber(startDateFmt))
    .replaceAll("{endDate}", formatDateWithNumber(endDateFmt));

  const periodFmt = periodText
    .replaceAll("{startDate}", formatDateWithText(startDateFmt))
    .replaceAll("{endDate}", formatDateWithText(endDateFmt));

  const rentFmt = {
    ...specificRent,
    amounts: specificRent.amounts.map(({ amount, label }) => ({
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
    title,
    text: textFmt,
    legalText,
    rent: rentFmt,
    totalAmount: formatCurrency(totalAmount),
    metadata: {
      title,
      author: landlord.name,
      subject: title,
      keywords: title,
      creator: landlord.name,
      producer: landlord.name,
      pdfVersion,
      language: "fr",
    },
  };
}

export function formatEcheanceProps({
  startDate,
  endDate,
  paymentDate,
  rentType,
  rent,
  landlord,
  tenant,
}: {
  startDate: Date | string;
  endDate: Date | string;
  paymentDate: Date | string;
  rentType: string;
  rent: {
    [key: string]: {
      amounts: {
        label: string;
        amount: number;
      }[];
      currency: string;
      address: string;
      city: string;
      zipCode: string;
    };
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
}): EcheanceProps {
  const startDateFmt = startDate instanceof Date ? startDate : new Date(startDate);
  const endDateFmt = endDate instanceof Date ? endDate : new Date(endDate);
  const paymentDateFmt = formatDateWithNumber(paymentDate instanceof Date ? paymentDate : new Date(paymentDate));

  const specificRent = rent[rentType];

  const totalAmount =
  specificRent.amounts.reduce((acc, { amount }) => acc + amount * 100, 0) / 100;
  
  // const title = `Avis d'échéance (${rentType})`;
  const title = `Avis d'échéance`;

  const periodText = "Du {startDate} au {endDate}"

  const descriptionText = "Somme à payer avant le {paymentDate} sur le terme du {startDate} au {endDate}.";
  // const legalText = "Paiement à réaliser par virement au plus tard le {paymentDate}.";
  const legalText = "";

  const textFmt = descriptionText
    .replaceAll("{landlordName}", landlord.name)
    .replaceAll("{tenantTitle}", tenant.title)
    .replaceAll("{tenantName}", tenant.name)
    .replaceAll("{totalAmountWords}", formatCurrencyToWords(totalAmount))
    .replaceAll("{totalAmount}", formatCurrency(totalAmount))
    .replaceAll("{startDate}", formatDateWithNumber(startDateFmt))
    .replaceAll("{endDate}", formatDateWithNumber(endDateFmt))
    .replaceAll("{paymentDate}", paymentDateFmt);

  const periodFmt = periodText
    .replaceAll("{startDate}", formatDateWithText(startDateFmt))
    .replaceAll("{endDate}", formatDateWithText(endDateFmt));

  const rentFmt = {
    ...specificRent,
    amounts: specificRent.amounts.map(({ amount, label }) => ({
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
    title,
    text: textFmt,
    legalText,
    rent: rentFmt,
    totalAmount: formatCurrency(totalAmount),
    metadata: {
      title,
      author: landlord.name,
      subject: title,
      keywords: title,
      creator: landlord.name,
      producer: landlord.name,
      pdfVersion,
      language: "fr",
    },
  };
}