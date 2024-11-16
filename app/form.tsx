"use client";

import { DatePicker } from "@/components/date-picker";
import { DatePickerWithRange } from "@/components/date-picker-with-range";
import { SelectDocument } from "@/components/select-document";
import { SelectType } from "@/components/select-type";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export default function Form() {
  const router = useRouter();

  const [document, setDocument] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(undefined);

  const handleDateRange = (value: DateRange | undefined) => {
    setStartDate(value?.from);
    setEndDate(value?.to);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!document || !type || !startDate || !endDate) {
      return;
    }

    const searchParams = new URLSearchParams();
    searchParams.set("startDate", startDate.toISOString());
    searchParams.set("endDate", endDate.toISOString());
    searchParams.set("paymentDate", paymentDate?.toISOString() ?? '');

    if (document === 'quittance') {
      router.push(`/quittance?${searchParams.toString()}`);
    } else if (document === 'echeance') {
      router.push(`/echeance?${searchParams.toString()}`);
    }
  }

  return (
    <div>
      <div className="py-10 space-y-5 max-w-xs w-full mx-auto">
        <h1 className="font-semibold tracking-tight text-2xl">Outils du bailleur</h1>
        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          <fieldset>
            <Label className="block mb-2">
              Type de document
            </Label>
            <SelectDocument onValueChange={setDocument} />
          </fieldset>

          <fieldset>
            <Label className="block mb-2">
              Type de bien
            </Label>
            <SelectType onValueChange={setType} />
          </fieldset>

          <fieldset>
            <Label className="block mb-2">
              Période concernée
            </Label>
            <DatePickerWithRange onValueChange={handleDateRange} />
          </fieldset>

          {document === 'quittance' && (
            <fieldset>
              <Label className="block mb-2">
                Date du paiement
              </Label>
              <DatePicker onValueChange={setPaymentDate} />
            </fieldset>
          )}

          <Button type="submit">Générer le document</Button>
        </form>
      </div>
    </div>
  );
}
