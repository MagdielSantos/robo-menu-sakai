import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOCUMENT_TYPES, STATUS_TYPES } from '@/services/RPAService';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filter: { matchMode: string; value: string }) => void;
  title: string;
  field: string;
  initialValue?: { matchMode: string; value: string };
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  isOpen,
  onClose,
  onApply,
  title,
  field,
  initialValue
}) => {
  const [matchMode, setMatchMode] = useState<string>(initialValue?.matchMode || 'equals');
  const [value, setValue] = useState<string>(initialValue?.value || '');

  // Reset values when dialog opens with new field
  useEffect(() => {
    if (isOpen) {
      setMatchMode(initialValue?.matchMode || 'equals');
      setValue(initialValue?.value || '');
    }
  }, [isOpen, initialValue, field]);

  const handleApply = () => {
    if (value.trim() === '') {
      onClose();
      return;
    }
    
    onApply({
      matchMode,
      value
    });
  };

  const handleClear = () => {
    setValue('');
    setMatchMode('equals');
    onApply({ matchMode: '', value: '' });
  };

  const isSelectField = field === 'documentType' || field === 'status';
  const options = field === 'documentType' ? DOCUMENT_TYPES : STATUS_TYPES;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filtrar {title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!isSelectField && (
            <div className="flex flex-col space-y-2">
              <label htmlFor="filter-mode" className="text-sm font-medium text-gray-700">
                Modo de filtro
              </label>
              <Select value={matchMode} onValueChange={setMatchMode}>
                <SelectTrigger id="filter-mode">
                  <SelectValue placeholder="Selecione o modo de filtro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Igual</SelectItem>
                  <SelectItem value="contains">Contém</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="filter-value" className="text-sm font-medium text-gray-700">
              {isSelectField ? 'Selecione uma opção' : 'Valor'}
            </label>
            
            {isSelectField ? (
              <Select value={value} onValueChange={setValue}>
                <SelectTrigger id="filter-value">
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  {options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="filter-value"
                placeholder="Digite o valor para filtrar"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            )}
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

export default FilterDialog;
