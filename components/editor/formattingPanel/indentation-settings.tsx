import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IndentationOptions,
  IndentationSpecials,
} from "../extensions/Formatting/types";
import { Editor } from "@tiptap/react";

const generateOptions = (editor: Editor) => {
  const step = editor.storage?.indent?.step ?? 6;
  const maxStepLevel = editor.storage?.indent?.maxLevel ?? 11;
  const options = [];
  for (let i = 0; i <= maxStepLevel; i++) {
    options.push((i * step).toString());
  }
  return options;
};

const indentationSpecialOptions: IndentationSpecials[] = [
  "none",
  "first-line",
  "hanging",
];

export function IndentationSettings({
  options,
  setOptions,
  editor,
}: {
  options: IndentationOptions;
  setOptions: (options: IndentationOptions) => void;
  editor: Editor;
}) {
  const indentationOptions = generateOptions(editor);

  const { left, right, special, by } = options;

  const handleChange = (
    option: keyof IndentationOptions,
    value: string | number
  ) => {
    setOptions({ ...options, [option]: value });
  };

  return (
    <div className="w-full">
      <h6 className="font-semibold">Indentation</h6>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="left-indent" className="text-right">
              Left:
            </Label>
            <Select
              value={left.toString()}
              onValueChange={(value) => handleChange("left", Number(value))}
            >
              <SelectTrigger id="left-indent" className="col-span-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {indentationOptions.map((value) => (
                  <SelectItem key={`left-${value}`} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="right-indent" className="text-right">
              Right:
            </Label>
            <Select
              value={right.toString()}
              onValueChange={(value) => handleChange("right", Number(value))}
            >
              <SelectTrigger id="right-indent" className="col-span-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {indentationOptions.map((value) => (
                  <SelectItem key={`right-${value}`} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="special-indent" className="text-right">
              Special:
            </Label>
            <Select
              value={special}
              onValueChange={(value) => handleChange("special", value)}
            >
              <SelectTrigger id="special-indent" className="col-span-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {indentationSpecialOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="by-indent" className="text-right">
              By:
            </Label>
            <Select
              disabled={options.special == "none"}
              value={by.toString()}
              onValueChange={(value) => handleChange("by", Number(value))}
            >
              <SelectTrigger id="by-indent" className="col-span-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {indentationOptions.map((value) => (
                  <SelectItem key={`by-${value}`} value={value}>
                    {value}
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
