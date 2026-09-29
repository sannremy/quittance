import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatCurrency, formatCurrencyToWords, formatDateWithNumber, formatDateWithText, formatIndex } from "./string";
import type { QuittanceProps } from "@/app/quittance/quittance";
import data from "@/app/data.json";
import type { PDFVersion } from "@react-pdf/types/pdf";
import type { EcheanceProps } from "@/app/echeance/echeance";
import type { RevisionProps } from "@/app/revision/revision";
import { formatIrlLabel, getIrlByKey, getPreviousYearIrl, latestIrl } from "./irl";
import type { IrlEntry } from "./irl";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const pdfVersion = "1.7ext3" as PDFVersion;

interface RentAmount {
  label: string;
  amount: number;
}

interface RentInfo {
  amounts: RentAmount[];
  currency: string;
  address: string;
  city: string;
  zipCode: string;
  revision?: {
    currentCharges: number;
    newCharges: number;
  };
}

interface PersonInfo {
  title: string;
  name: string;
  address: string;
  zipCode: string;
  city: string;
}

interface FormatDocumentInput {
  startDate: Date | string;
  endDate: Date | string;
  paymentDate: Date | string;
  rentType: string;
  rent: Record<string, RentInfo>;
  landlord: PersonInfo;
  tenant: PersonInfo;
}

interface FormatRevisionInput extends FormatDocumentInput {
  irlKey: string;
  irlEntries: IrlEntry[];
}

export function formatQuittanceProps({
  startDate,
  endDate,
  paymentDate,
  rentType,
  rent,
  landlord,
  tenant,
}: FormatDocumentInput): QuittanceProps {
  const startDateFmt = startDate instanceof Date ? startDate : new Date(startDate);
  const endDateFmt = endDate instanceof Date ? endDate : new Date(endDate);
  const paymentDateFmt = formatDateWithNumber(paymentDate instanceof Date ? paymentDate : new Date(paymentDate));

  const specificRent = rent[rentType];

  const totalAmount =
  specificRent.amounts.reduce((acc, { amount }) => acc + amount * 100, 0) / 100;
  
  // const title = `Quittance de loyer (${rentType})`;
  const title = `Quittance de loyer`;

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
}: FormatDocumentInput): EcheanceProps {
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

export function formatRevisionProps({
  startDate,
  endDate,
  paymentDate,
  rentType,
  rent,
  landlord,
  tenant,
  irlKey,
  irlEntries,
}: FormatRevisionInput): RevisionProps {
  const startDateFmt = startDate instanceof Date ? startDate : new Date(startDate);
  const endDateFmt = endDate instanceof Date ? endDate : new Date(endDate);
  const paymentDateFmt = formatDateWithNumber(paymentDate instanceof Date ? paymentDate : new Date(paymentDate));

  const specificRent = rent[rentType];

  const sumAmounts = (amounts: RentAmount[]) =>
    amounts.reduce((acc, { amount }) => acc + amount * 100, 0) / 100;

  const currentRent = sumAmounts(
    specificRent.amounts.filter(({ label }) => !/charge/i.test(label)),
  );
  const derivedCharges = sumAmounts(
    specificRent.amounts.filter(({ label }) => /charge/i.test(label)),
  );

  const currentCharges = specificRent.revision?.currentCharges ?? derivedCharges;
  const newCharges = specificRent.revision?.newCharges ?? currentCharges;

  const newIrlEntry = getIrlByKey(irlEntries, irlKey) ?? latestIrl(irlEntries);
  const previousIrlEntry =
    getPreviousYearIrl(irlEntries, newIrlEntry) ?? newIrlEntry;

  const ratio = newIrlEntry.value / previousIrlEntry.value;
  const newRent = Math.round(currentRent * ratio * 100) / 100;
  const newTotal = Math.round((newRent + newCharges) * 100) / 100;

  const currentRentFmt = formatCurrency(currentRent);
  const newRentFmt = formatCurrency(newRent);
  const currentChargesFmt = formatCurrency(currentCharges);
  const newChargesFmt = formatCurrency(newCharges);
  const newTotalFmt = formatCurrency(newTotal);
  const previousIrlLabel = formatIrlLabel(previousIrlEntry);
  const newIrlLabel = formatIrlLabel(newIrlEntry);
  const previousIrlValue = formatIndex(previousIrlEntry.value);
  const newIrlValue = formatIndex(newIrlEntry.value);

  const title = `Révision du loyer et des charges`;

  const periodText = "À compter du {startDate}"

  const descriptionText = "Nous soussignés, {landlordName}, propriétaires du logement désigné ci-dessus, vous informons que le loyer et les charges sont révisés à compter du {startDate}.\n\nFormule de révision : Nouveau loyer mensuel = Loyer mensuel actuel × (Nouvel IRL ÷ IRL de référence).";
  const legalText = "La révision est effectuée conformément à l'article 17-1 de la loi n° 89-462 du 6 juillet 1989. Elle ne peut être appliquée que si le bail comporte une clause de révision, au plus une fois par an, et dans la limite de la variation de l'indice de référence des loyers (IRL).";

  const textFmt = descriptionText
    .replaceAll("{landlordName}", landlord.name)
    .replaceAll("{startDate}", formatDateWithNumber(startDateFmt));

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
    totalAmount: newTotalFmt,
    currentRent: currentRentFmt,
    newRent: newRentFmt,
    currentCharges: currentChargesFmt,
    newCharges: newChargesFmt,
    newTotal: newTotalFmt,
    previousIrlLabel,
    newIrlLabel,
    previousIrlValue,
    newIrlValue,
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
