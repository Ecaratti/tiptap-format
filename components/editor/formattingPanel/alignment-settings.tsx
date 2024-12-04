import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const alignmentOptions = ["left", "center", "right", "justify"];

export function AlignmentSettings({
  alignment,
  setAlignment,
}: {
  alignment: string;
  setAlignment: (aligment: string) => void;
}) {
  return (
    <div className="w-full">
      <h6 className="font-semibold">Alignment</h6>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full grid grid-cols-3 items-center gap-2">
          <Label htmlFor="before-spacing" className="text-right">
            Alignment:
          </Label>
          <Select value={alignment} onValueChange={setAlignment}>
            <SelectTrigger className="col-span-2">
              <SelectValue placeholder="Alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {alignmentOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
