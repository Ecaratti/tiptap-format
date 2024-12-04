import { LINE_HEIGHTS } from "../extensions/LineHeight/constants";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SpacingProps,
  SpacingPropsWithLineHeight,
} from "../extensions/Spacing/types";
import { NumberPicker } from "@/components/ui/number-picker";

const generateOptions = () => {
  const options = [];
  for (let i = 0; i <= 60; i += 6) {
    options.push(i);
  }
  return options;
};

export function SpacingSettings({
  options,
  setSpacing,
  setLineHeight,
}: {
  options: SpacingPropsWithLineHeight;
  setSpacing: (options: SpacingProps) => void;
  setLineHeight: (lineHeight: number) => void;
}) {
  const spacingOptions = generateOptions();

  const { before, after, lineHeight } = options;

  const handleSpacingChange = (
    option: keyof SpacingProps,
    value: string | number
  ) => {
    setSpacing({ ...options, [option]: value });
  };

  return (
    <div className="w-full">
      <h6 className="font-semibold">Spacing</h6>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="before-spacing" className="text-right">
              Before:
            </Label>

            <NumberPicker
              value={before}
              onValueChange={(value) => handleSpacingChange("before", value)}
              options={spacingOptions}
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="after-spacing" className="text-right">
              After:
            </Label>

            <NumberPicker
              value={after}
              onValueChange={(value) => handleSpacingChange("after", value)}
              options={spacingOptions}
              className="col-span-2"
            />
          </div>
        </div>
        <div className="space-y-4 content-end">
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="by-indent" className="text-right">
              Line height:
            </Label>

            <Select
              value={lineHeight.toString()}
              onValueChange={(value) => {
                setLineHeight(Number(value));
              }}
            >
              <SelectTrigger id="line-height" className="col-span-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LINE_HEIGHTS.map(({ value, label }) => (
                  <SelectItem
                    key={`line-height-${value}`}
                    value={value.toString()}
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
