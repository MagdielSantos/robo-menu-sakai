import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangeFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (dateRange: { startDate: string | null; endDate: string | null }) => void;
  title: string;
  initialStartDate?: string | null;
  initialEndDate?: string | null;
}

const DateRangeFilterDialog: React.FC<DateRangeFilterDialogProps> = ({
  isOpen,
  onClose,
  onApply,
  title,
  initialStartDate,
  initialEndDate
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialStartDate ? new Date(initialStartDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialEndDate ? new Date(initialEndDate) : undefined
  );

  // Reset values when dialog opens with new values
  useEffect(() => {
    if (isOpen) {
      setStartDate(initialStartDate ? new Date(initialStartDate) : undefined);
      setEndDate(initialEndDate ? new Date(initialEndDate) : undefined);
    }
  }, [isOpen, initialStartDate, initialEndDate]);

  const handleApply = () => {
    onApply({
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : null
    });
  };

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onApply({ startDate: null, endDate: null });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filtrar por período - {title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="start-date" className="text-sm font-medium text-gray-700">
              Data Inicial
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="start-date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecionar data inicial</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="end-date" className="text-sm font-medium text-gray-700">
              Data Final
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="end-date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy") : <span>Selecionar data final</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={date => startDate ? date < startDate : false}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleClear} type="button">
            Limpar
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button onClick={handleApply} type="button">
              Aplicar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DateRangeFilterDialog;