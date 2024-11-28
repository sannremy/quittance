"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { DatePicker } from "@/components/date-picker"
import { useRouter } from "next/navigation"

const FormSchema = z.object({
  document: z
    .string({
      required_error: "Veuillez sélectionner un type de document.",
    })
    .regex(/quittance|echeance/, {
      message: "Veuillez sélectionner un type de document valide.",
    }),
  bien: z.string({
    required_error: "Veuillez sélectionner un type de bien.",
  })
    .regex(/appartement|parking/, {
      message: "Veuillez sélectionner un type de bien valide.",
    }),
  periode: z.object({
    from: z.date(),
    to: z.date(),
  }, {
    required_error: "Veuillez sélectionner une période.",
  }),
  paymentDate: z.date({
    required_error: "Veuillez sélectionner une date de paiement.",
  }).optional(),
})

export default function ToolForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const document = useWatch({
    control: form.control,
    name: 'document'
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const {
      document,
      periode: { from: startDate, to: endDate },
      paymentDate,
      bien: type,
    } = data;

    const searchParams = new URLSearchParams();
    if (startDate) {
      searchParams.set("startDate", startDate.toISOString());
    }

    if (endDate) {
      searchParams.set("endDate", endDate.toISOString());
    }

    if (type) {
      searchParams.set("type", type);
    }

    if (paymentDate) {
      searchParams.set("paymentDate", paymentDate?.toISOString());
    }

    if (document === 'quittance') {
      router.push(`/quittance?${searchParams.toString()}`);
    } else if (document === 'echeance') {
      router.push(`/echeance?${searchParams.toString()}`);
    }
  }

  return (
    <div className="py-10 space-y-5 max-w-xs w-full mx-auto">
      <h1 className="font-semibold tracking-tight text-2xl">Outils du bailleur 🥱</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Type de document */}
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de document</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un document" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Type de document</SelectLabel>
                      <SelectItem value="echeance">Avis d'échéance</SelectItem>
                      <SelectItem value="quittance">Quittance</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type de bien */}
          <FormField
            control={form.control}
            name="bien"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de bien</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un bien" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Type de bien</SelectLabel>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Période concernée */}
          <FormField
            control={form.control}
            name="periode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Période concernée</FormLabel>
                <DatePickerWithRange onValueChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date du paiement</FormLabel>
                <DatePicker onValueChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Valider</Button>
        </form>
      </Form>
    </div>
  )
}
