import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {MouseEvent, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {useAtomValue} from "jotai";
import * as fabric from "fabric";
import {canvasAtom} from "@/atom";
import {
  Circle as CircleIcon,
  Eraser as EraserIcon,
  MousePointer2 as PointerIcon,
  Pencil as PencilIcon,
  Shapes as ShapesIcon,
  Square as SquareIcon,
  Text as TextIcon,
  Triangle as TriangleIcon,
} from "lucide-react";
import {
  CreateShapeCircle,
  CreateShapeRectangle,
  CreateShapeTriangle,
  CreateText,
  UpdateActiveObjectFill
} from "@/canvas/elements.ts";
import {useHotkeys} from "react-hotkeys-hook";

const Colors = {
  Black: "#000000",
  White: "#ffffff",
  Yellow: "#f59e0b",
  Red: "#ef4444",
  Blue: "#3b82f6",
  Green: "#22c55e",
};

export function Toolbar() {
  const canvas = useAtomValue(canvasAtom);
  const [color, setColor] = useState("#000");

  const [isPointerMode, setIsPointerMode] = useState(true);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const [shapePopoverOpen, setShapePopoverOpen] = useState(false);
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);

  const stopDrawingIfActive = () => {
    setIsDrawingMode(false);
    canvas.isDrawingMode = false;
  };

  const handlePointerMode = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setIsPointerMode(true);
    stopDrawingIfActive();
    canvas.renderAll();
  };

  const handleColorChange = (color: string) => {
    if (!canvas) return;
    setColor(color);
    setColorPopoverOpen(false);
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }
    UpdateActiveObjectFill(canvas, color);
  };

  const handleDrawingMode = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setIsPointerMode(false);
    setIsDrawingMode(true);
    canvas.isDrawingMode = true;

    const brush = new fabric.PencilBrush(canvas);
    brush.width = 4;
    canvas.freeDrawingBrush = brush;
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }
  };

  const handleDeleteElements = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    canvas.remove(...canvas.getActiveObjects());
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const handleCreateShape = (shape: 'square' | 'circle' | 'triangle') => {
    setShapePopoverOpen(false);
    switch (shape) {
      case 'square':
        CreateShapeRectangle(canvas, color);
        break;
      case 'circle':
        CreateShapeCircle(canvas, color);
        break;
      case 'triangle':
        CreateShapeTriangle(canvas, color);
        break;
    }
  };

  const handleCreateText = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    stopDrawingIfActive();
    CreateText(canvas, "New Text", color);
  };

  const handleClickAway = () => {
    canvas.discardActiveObject();
    stopDrawingIfActive();
    canvas.renderAll();
  };

  useHotkeys('v', () => handlePointerMode());
  useHotkeys('p', () => handleDrawingMode());
  useHotkeys('t', () => handleCreateText());
  useHotkeys('1', () => handleColorChange("#000000"));
  useHotkeys('2', () => handleColorChange("#ffffff"));
  useHotkeys('3', () => handleColorChange("#f59e0b"));
  useHotkeys('4', () => handleColorChange("#ef4444"));
  useHotkeys('5', () => handleColorChange("#3b82f6"));
  useHotkeys('6', () => handleColorChange("#22c55e"));
  useHotkeys('shift+s', () => handleCreateShape('square'));
  useHotkeys('shift+c', () => handleCreateShape('circle'));
  useHotkeys('shift+t', () => handleCreateShape('triangle'));

  return (
    <div onClick={handleClickAway} className="flex items-center justify-center bg-background py-4 px-6 border-b">
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={isPointerMode ? "bg-slate-200" : ""}
                onClick={handlePointerMode}
                variant="ghost"
                size="icon"
              >
                <PointerIcon className="w-5 h-5"/>
                <span className="sr-only">Pointer</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pointer<kbd>V</kbd></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={isDrawingMode ? "bg-slate-200" : ""}
                onClick={handleDrawingMode}
                variant="ghost"
                size="icon"
              >
                <PencilIcon className="w-5 h-5"/>
                <span className="sr-only">Pencil</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pencil<kbd>P</kbd></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleDeleteElements} variant="ghost" size="icon">
                <EraserIcon className="w-5 h-5"/>
                <span className="sr-only">Eraser</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Eraser<kbd>⌫</kbd>/<kbd>Del</kbd></TooltipContent>
          </Tooltip>
          <Tooltip>
            <Popover open={shapePopoverOpen} onOpenChange={setShapePopoverOpen}>
              <PopoverTrigger>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ShapesIcon className="w-5 h-5"/>
                    <span className="sr-only">Shapes</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Shapes</TooltipContent>
              </PopoverTrigger>
              <PopoverContent className="flex p-1 justify-between w-32">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={() => handleCreateShape('square')} variant="ghost" size="icon">
                      <SquareIcon className="w-5 h-5"/>
                      <span className="sr-only">Rectangle</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Square<kbd>shift</kbd><kbd>s</kbd></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={() => handleCreateShape('circle')} variant="ghost" size="icon">
                      <CircleIcon className="w-5 h-5"/>
                      <span className="sr-only">Circle</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Circle<kbd>shift</kbd><kbd>c</kbd></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={() => handleCreateShape('triangle')} variant="ghost" size="icon">
                      <TriangleIcon className="w-5 h-5"/>
                      <span className="sr-only">Triangle</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Triangle<kbd>shift</kbd><kbd>t</kbd></TooltipContent>
                </Tooltip>
              </PopoverContent>
            </Popover>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleCreateText} variant="ghost" size="icon">
                <TextIcon className="w-5 h-5"/>
                <span className="sr-only">Text</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Text<kbd>T</kbd></TooltipContent>
          </Tooltip>
          <Tooltip>
            <Popover open={colorPopoverOpen} onOpenChange={setColorPopoverOpen}>
              <PopoverTrigger>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <div
                      style={{background: color}}
                      className="w-5 h-5 cursor-pointer rounded-full ring-1 ring-slate-200"
                    />
                    <span className="sr-only">Color Picker</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="flex justify-between w-48">
                {
                  Object.entries(Colors).map((([name, hex], i) => (
                    <Tooltip key={hex}>
                      <TooltipTrigger asChild>
                        <div
                          onClick={() => handleColorChange(hex)}
                          className="w-5 h-5 cursor-pointer rounded-full ring-1 ring-slate-200"
                          style={{background: hex}}
                        />
                      </TooltipTrigger>
                      <TooltipContent>{name}<kbd>{i + 1}</kbd></TooltipContent>
                    </Tooltip>
                  )))
                }
              </PopoverContent>
            </Popover>
            <TooltipContent>Color Picker</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
