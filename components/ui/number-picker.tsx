import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const NumberPicker = ({
  value,
  onValueChange,
  options = [],
  className,
  disabled = false,
}: {
  value: number;
  onValueChange: (value: number) => void;
  options: number[];
  className?: string;
  disabled?: boolean;
}) => {
  const [optimisticValue, setOptimisticValue] = useState<number | undefined>(
    value
  );

  useEffect(() => {
    if (value) {
      setOptimisticValue(value);
    }
  }, [value]);

  const handleInputChange = (value: string) => {
    const newSize = parseInt(value);
    if (!isNaN(newSize)) {
      setOptimisticValue(newSize);
    }
  };

  return (
    <div
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 group items-center gap-2",
        className
      )}
    >
      <Input
        type="number"
        className="w-full min-w-4 bg-transparent border-none p-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        value={optimisticValue?.toString()}
        onChange={(e) => handleInputChange(e.currentTarget.value)}
        disabled={disabled}
        onBlur={() => optimisticValue && onValueChange(optimisticValue)}
      />

      <DropdownMenu>
        <DropdownMenuTrigger disabled={disabled}>
          <ChevronDown className="h-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="min-w-12">
          {options.map((opt) => (
            <DropdownMenuItem
              className={cn(optimisticValue === opt && "bg-gray-100")}
              onClick={(e) => {
                setOptimisticValue(opt);
                onValueChange(opt);
              }}
              key={opt}
            >
              <span>{opt}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
