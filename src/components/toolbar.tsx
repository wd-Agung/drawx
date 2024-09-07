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


export function Toolbar() {
  const canvas = useAtomValue(canvasAtom);
  const [color, setColor] = useState("#000");

  const [isPointerMode, setIsPointerMode] = useState(true);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const [shapePopoverOpen, setShapePopoverOpen] = useState(false);
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);

  const handlePointerMode = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsPointerMode(true);
    setIsDrawingMode(false);
    canvas.isDrawingMode = false;
    // canvas.discardActiveObject();
    canvas.renderAll();
  };

  const handleColorChange = (color: string) => {
    setColor(color);
    setColorPopoverOpen(false);
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }
    UpdateActiveObjectFill(canvas, color);
  };

  const handleDrawingMode = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsPointerMode(false);
    setIsDrawingMode(true);
    canvas.isDrawingMode = !isDrawingMode;

    const brush = new fabric.PencilBrush(canvas);
    brush.width = 4;
    canvas.freeDrawingBrush = brush;
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }
  };

  const handleDeleteElements = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    canvas.remove(...canvas.getActiveObjects());
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

  const handleCreateText = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    CreateText(canvas, "New Text", color);
  };

  const handleClickAway = () => {
    setIsDrawingMode(false);
    canvas.discardActiveObject();
    canvas.isDrawingMode = false;
    canvas.renderAll();
  };

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
            <TooltipContent>Pointer</TooltipContent>
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
            <TooltipContent>Pencil</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleDeleteElements} variant="ghost" size="icon">
                <EraserIcon className="w-5 h-5"/>
                <span className="sr-only">Eraser</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Eraser</TooltipContent>
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
              <PopoverContent className="flex p-1 justify-between w-36">
                <Button onClick={() => handleCreateShape('square')} variant="ghost" size="icon">
                  <SquareIcon className="w-5 h-5"/>
                  <span className="sr-only">Rectangle</span>
                </Button>
                <Button onClick={() => handleCreateShape('circle')} variant="ghost" size="icon">
                  <CircleIcon className="w-5 h-5"/>
                  <span className="sr-only">Circle</span>
                </Button>
                <Button onClick={() => handleCreateShape('triangle')} variant="ghost" size="icon">
                  <TriangleIcon className="w-5 h-5"/>
                  <span className="sr-only">Triangle</span>
                </Button>
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
            <TooltipContent>Text</TooltipContent>
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
              <PopoverContent className="flex justify-between w-44">
                <div
                  onClick={() => handleColorChange("#000000")}
                  className="w-5 h-5 cursor-pointer rounded-full ring-1 ring-slate-200 bg-black"
                ></div>
                <div
                  onClick={() => handleColorChange("#ffffff")}
                  className="w-5 h-5 cursor-pointer rounded-full ring-1 ring-slate-200 bg-white"
                ></div>
                <div
                  onClick={() => handleColorChange("#f59e0b")}
                  className="w-5 h-5 cursor-pointer rounded-full ring-1 ring-slate-200 bg-amber-500"
                ></div>
                <div
                  onClick={() => handleColorChange("#ef4444")}
                  className="w-5 h-5 cursor-pointer rounded-full ring-1 ring-slate-200 bg-red-500"
                ></div>
                <div
                  onClick={() => handleColorChange("#3b82f6")}
                  className="w-5 h-5 cursor-pointer rounded-full ring-1 ring-slate-200 bg-blue-500"
                ></div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Color Picker</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
