import data from "@/app/data.json";
import PDFQuittance from "@/app/quittance/quittance";
import { formatQuittanceProps } from "@/lib/utils";

export default function Page({
  searchParams,
}: {
  searchParams: {
    startDate?: string;
    endDate?: string;
    paymentDate?: string;
  };
}) {
  const startDate = searchParams.startDate ?? new Date().toISOString();
  const endDate = searchParams.endDate ?? new Date().toISOString();
  const paymentDate = searchParams.paymentDate ?? new Date().toISOString();

  const quittanceProps = formatQuittanceProps({
    startDate,
    endDate,
    paymentDate,
    rent: data.rent,
    landlord: data.landlord,
    tenant: data.tenant,
    text: data.text,
    period: data.period,
  });

  return <PDFQuittance {...quittanceProps} />;
}
