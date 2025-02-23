import data from "@/app/data.json";
import PDFEcheance from "@/app/echeance/echeance";
import { formatEcheanceProps } from "@/lib/utils";

export default async function Page(
  props: {
    searchParams: Promise<{
      type: string;
      startDate?: string;
      endDate?: string;
      paymentDate?: string;
    }>;
  }
) {
  const searchParams = await props.searchParams;
  const rentType = searchParams.type;
  const startDate = searchParams.startDate ?? new Date().toISOString();
  const endDate = searchParams.endDate ?? new Date().toISOString();
  const paymentDate = searchParams.paymentDate ?? new Date().toISOString();

  const echeanceProps = formatEcheanceProps({
    startDate,
    endDate,
    paymentDate,
    rentType,
    rent: data.rent,
    landlord: data.landlord,
    tenant: data.tenant,
  });

  return <PDFEcheance {...echeanceProps} />;
}
