import React, { useState } from 'react';
import { ArrowUpDown, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterDialog from '@/components/Filters/FilterDialog';
import DateRangeFilterDialog from '@/components/Filters/DateRangeFilterDialog';

interface FilterableColumnHeaderProps {
  title: string;
  field: string;
  onSort?: (field: string) => void;
  onFilter?: (field: string, filter: { matchMode: string; value: string } | null) => void;
  onDateRangeFilter?: (field: string, dateRange: { startDate: string | null; endDate: string | null }) => void;
  currentFilter?: { matchMode: string; value: string };
  currentDateRange?: { startDate: string | null; endDate: string | null };
  isSorted?: boolean;
  sortDirection?: 'asc' | 'desc';
  isDateFilter?: boolean;
}

const FilterableColumnHeader: React.FC<FilterableColumnHeaderProps> = ({ 
  title, 
  field, 
  onSort,
  onFilter,
  onDateRangeFilter,
  currentFilter,
  currentDateRange,
  isSorted,
  sortDirection,
  isDateFilter = false
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);

  const handleSort = () => {
    if (onSort) {
      onSort(field);
    }
  };

  const handleFilterApply = (filter: { matchMode: string; value: string }) => {
    if (onFilter) {
      if (filter.value.trim() === '') {
        onFilter(field, null);
      } else {
        onFilter(field, filter);
      }
    }
    setIsFilterOpen(false);
  };

  const handleDateRangeApply = (dateRange: { startDate: string | null; endDate: string | null }) => {
    if (onDateRangeFilter) {
      onDateRangeFilter(field, dateRange);
    }
    setIsDateFilterOpen(false);
  };

  const getFilterColor = () => {
    if (isDateFilter) {
      return (currentDateRange?.startDate || currentDateRange?.endDate) ? 'text-primary' : 'text-gray-400';
    }
    return currentFilter && currentFilter.value ? 'text-primary' : 'text-gray-400';
  };

  return (
    <div className="flex items-center space-x-1">
      <div className="flex-1 whitespace-nowrap">{title}</div>
      <div className="flex items-center">
        {onSort && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 hover:bg-gray-100" 
            onClick={handleSort}
          >
            <ArrowUpDown className={`h-4 w-4 ${isSorted ? 'text-primary' : 'text-gray-400'}`} />
            <span className="sr-only">Sort by {title}</span>
          </Button>
        )}
        
        {isDateFilter && onDateRangeFilter ? (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 hover:bg-gray-100" 
              onClick={() => setIsDateFilterOpen(true)}
            >
              <Calendar className={`h-4 w-4 ${getFilterColor()}`} />
              <span className="sr-only">Filter {title} by date range</span>
            </Button>
            
            <DateRangeFilterDialog
              isOpen={isDateFilterOpen}
              onClose={() => setIsDateFilterOpen(false)}
              onApply={handleDateRangeApply}
              title={title}
              initialStartDate={currentDateRange?.startDate}
              initialEndDate={currentDateRange?.endDate}
            />
          </>
        ) : onFilter && (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 hover:bg-gray-100" 
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter className={`h-4 w-4 ${getFilterColor()}`} />
              <span className="sr-only">Filter by {title}</span>
            </Button>
            
            <FilterDialog
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApply={handleFilterApply}
              title={title}
              field={field}
              initialValue={currentFilter}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FilterableColumnHeader;