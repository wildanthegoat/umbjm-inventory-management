"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function LokasiFilter({ onSelectLokasi }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [lokasiData, setLokasiData] = useState([]);

  useEffect(() => {
    const fetchLokasi = async () => {
      try {
        const response = await fetch("/api/lokasi");
        const data = await response.json();
        const formattedData = data.map((item) => ({
          value: item.kampus,
          label: item.kampus,
        }));
        setLokasiData(formattedData);
      } catch (error) {
        console.error("Error fetching lokasi:", error);
      }
    };

    fetchLokasi();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? lokasiData.find((item) => item.value === value)?.label
            : "Pilih Lokasi Kampus"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Cari lokasi..." className="h-9" />
          <CommandList>
            <CommandEmpty>Lokasi tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {/* Option for selecting all locations */}
              <CommandItem
                value="all"
                onSelect={() => {
                  setValue("");
                  setOpen(false);
                  onSelectLokasi(""); // Pass empty string for "all" locations
                }}
              >
                Semua Lokasi
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === "" ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              {/* Map over lokasiData for dynamic items */}
              {lokasiData.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    const selectedValue =
                      currentValue === value ? "" : currentValue;
                    setValue(selectedValue);
                    setOpen(false);
                    onSelectLokasi(selectedValue); // Pass the selected location
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
  );
}
