export type IrlQuarter = 1 | 2 | 3 | 4;

export interface IrlEntry {
  year: number;
  quarter: IrlQuarter;
  value: number;
}

export const getIrlKey = ({ year, quarter }: IrlEntry) => `${year}-T${quarter}`;

export const formatIrlLabel = ({ year, quarter }: IrlEntry) =>
  `T${quarter} ${year}`;

export const getIrlByKey = (entries: IrlEntry[], key: string) =>
  entries.find((entry) => getIrlKey(entry) === key);

export const getPreviousYearIrl = (entries: IrlEntry[], entry: IrlEntry) =>
  entries.find(
    (candidate) =>
      candidate.year === entry.year - 1 && candidate.quarter === entry.quarter,
  );

export const latestIrl = (entries: IrlEntry[]) => entries[0];
