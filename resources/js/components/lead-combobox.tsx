import * as React from "react"
import { Check, ChevronsUpDown, User, Building } from "lucide-react"

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

interface Lead {
  id: number;
  nama_pelanggan: string;
  sapaan: string;
  no_whatsapp: string;
  nama_masjid_instansi: string;
  status: string;
  user: {
    name: string;
  };
  cabang: {
    nama_cabang: string;
    lokasi: string;
  };
}

interface LeadComboboxProps {
  leads: Lead[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
}

export function LeadCombobox({
  leads,
  value,
  onValueChange,
  placeholder = "Pilih lead...",
  className,
  hasError = false
}: LeadComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedLead = leads.find((lead) => lead.id.toString() === value);

  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith('62')) {
      return '+' + phone;
    }
    return phone;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedLead && "text-muted-foreground",
            hasError && "border-red-500",
            className
          )}
        >
          {selectedLead ? (
            <div className="flex items-center gap-2 truncate">
              <User className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="truncate">
                {selectedLead.sapaan} {selectedLead.nama_pelanggan}
                {selectedLead.nama_masjid_instansi && ` • ${selectedLead.nama_masjid_instansi}`}
              </span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[300px] p-0">
        <Command>
          <CommandInput placeholder="Cari lead..." />
          <CommandList>
            <CommandEmpty>Lead tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {leads.map((lead) => (
                <CommandItem
                  key={lead.id}
                  value={`${lead.nama_pelanggan} ${lead.sapaan} ${lead.nama_masjid_instansi || ''} ${lead.no_whatsapp}`}
                  onSelect={() => {
                    onValueChange(lead.id.toString() === value ? "" : lead.id.toString())
                    setOpen(false)
                  }}
                  className="flex items-start gap-3 p-3"
                >
                  <Check
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      value === lead.id.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="font-medium truncate">
                        {lead.sapaan} {lead.nama_pelanggan}
                      </span>
                    </div>
                    
                    {lead.nama_masjid_instansi && (
                      <div className="flex items-center gap-2 mb-1">
                        <Building className="h-4 w-4 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-600 truncate">
                          {lead.nama_masjid_instansi}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📱 {formatPhoneNumber(lead.no_whatsapp)}</span>
                      <span>🏢 {lead.cabang.nama_cabang}</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        lead.status === 'WARM' && "bg-yellow-100 text-yellow-800",
                        lead.status === 'HOT' && "bg-orange-100 text-orange-800",
                        lead.status === 'CUSTOMER' && "bg-green-100 text-green-800",
                        lead.status === 'COLD' && "bg-gray-100 text-gray-800",
                        lead.status === 'CROSS_SELLING' && "bg-purple-100 text-purple-800",
                        lead.status === 'EXIT' && "bg-red-100 text-red-800"
                      )}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}