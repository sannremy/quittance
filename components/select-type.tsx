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

export function SelectType({
  onValueChange,
  defaultValue,
}: {
  onValueChange: (value: string) => void
  defaultValue?: string
}) {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner un bien" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Type de bien</SelectLabel>
          <SelectItem value="appartement">Appartement</SelectItem>
          <SelectItem value="parking">Parking</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
