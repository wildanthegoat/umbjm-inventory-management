"use client";

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function KategoriFilter({ onSelectKategori }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [kategoriData, setKategoriData] = useState([])
  
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await fetch("/api/kategori")
        const data = await response.json()
        const formattedData = data.map(item => ({
          value: item.id,
          label: item.nama_kategori
        }))
        setKategoriData(formattedData)
      } catch (error) {
        console.error("Error fetching kategori:", error)
      }
    }
    fetchKategori()
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[140px] justify-between"
        >
          {value
            ? kategoriData.find((item) => item.value === value)?.label
            : "Pilih Kategori"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[150px] p-0">
        <Command>
          <CommandInput placeholder="Cari kategori..." className="h-9" />
          <CommandList>
            <CommandEmpty>Kategori tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  setValue("")
                  setOpen(false)
                  onSelectKategori("")
                }}
              >
                Semua Kategori
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === "" ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              {kategoriData.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    onSelectKategori(currentValue === value ? "" : currentValue)
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}