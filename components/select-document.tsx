import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectDocument({
  defaultValue,
  onValueChange,
}: {
  defaultValue?: string
  onValueChange: (value: string) => void
}) {
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner un document" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Type de document</SelectLabel>
          <SelectItem value="echeance">Avis d'échéance</SelectItem>
          <SelectItem value="quittance">Quittance</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
