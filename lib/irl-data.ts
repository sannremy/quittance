import type { IrlEntry, IrlQuarter } from "./irl";

const IRL_SERIES_IDBANK = "001515333";
const IRL_SERIES_URL = `https://bdm.insee.fr/series/sdmx/data/SERIES_BDM/${IRL_SERIES_IDBANK}`;
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export function parseIrlXml(xml: string): IrlEntry[] {
  const entries: IrlEntry[] = [];

  for (const observation of xml.match(/<Obs\b[^>]*>/g) ?? []) {
    const period = observation.match(/TIME_PERIOD="([^"]+)"/)?.[1];
    const rawValue = observation.match(/OBS_VALUE="([^"]+)"/)?.[1];
    if (!period || !rawValue) {
      continue;
    }

    const [, year, quarter] = period.match(/^(\d{4})-Q([1-4])$/) ?? [];
    const value = Number.parseFloat(rawValue);
    if (!year || !quarter || Number.isNaN(value)) {
      continue;
    }

    entries.push({
      year: Number.parseInt(year, 10),
      quarter: Number.parseInt(quarter, 10) as IrlQuarter,
      value,
    });
  }

  return entries.sort((a, b) => b.year - a.year || b.quarter - a.quarter);
}

export async function fetchIrlEntries(): Promise<IrlEntry[]> {
  const response = await fetch(IRL_SERIES_URL, {
    headers: {
      Accept: "application/xml",
    },
    next: { revalidate: ONE_DAY_IN_SECONDS },
  });

  if (!response.ok) {
    throw new Error(
      `INSEE IRL request failed with status ${response.status} ${response.statusText}`,
    );
  }

  return parseIrlXml(await response.text());
}
