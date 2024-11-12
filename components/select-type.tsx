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
}: {
  onValueChange: (value: string) => void
}) {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
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
