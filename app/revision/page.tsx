import data from "@/app/data.json";
import PDFRevision from "@/app/revision/revision";
import { formatRevisionProps } from "@/lib/utils";
import { getIrlKey, latestIrl } from "@/lib/irl";
import { fetchIrlEntries } from "@/lib/irl-data";

export default async function Page(
  props: {
    searchParams: Promise<{
      type: string;
      startDate?: string;
      endDate?: string;
      paymentDate?: string;
      irl?: string;
    }>;
  }
) {
  const searchParams = await props.searchParams;
  const rentType = searchParams.type;
  const startDate = searchParams.startDate ?? new Date().toISOString();
  const endDate = searchParams.endDate ?? new Date().toISOString();
  const paymentDate = searchParams.paymentDate ?? new Date().toISOString();
  const irlEntries = await fetchIrlEntries();
  const irlKey = searchParams.irl ?? getIrlKey(latestIrl(irlEntries));

  const revisionProps = formatRevisionProps({
    startDate,
    endDate,
    paymentDate,
    rentType,
    rent: data.rent,
    landlord: data.landlord,
    tenant: data.tenant,
    irlKey,
    irlEntries,
  });

  return <PDFRevision {...revisionProps} />;
}
