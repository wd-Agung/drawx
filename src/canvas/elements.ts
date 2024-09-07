import * as fabric from 'fabric';

export function CreateShapeRectangle(canvas: fabric.Canvas, color: string = '#000') {
  const center = canvas.getVpCenter();
  const rect = new fabric.Rect({
    left: center.x - 100,
    top: center.y - 200,
    fill: 'transparent',
    stroke: color,
    strokeWidth: 4,
    width: 100,
    height: 100
  });
  canvas.add(rect);
  canvas.renderAll();
}

export function CreateShapeRoundRect(canvas: fabric.Canvas, color: string = '#000') {
  const center = canvas.getVpCenter();
  const roundRect = new fabric.Rect({
    left: center.x - 100,
    top: center.y - 200,
    width: 20,
    height: 20,
    rx: 5,
    ry: 5,
    fill: 'transparent',
    stroke: color,
    strokeWidth: 4,
  });
  canvas.add(roundRect);
  canvas.renderAll();
}

export function CreateShapeCircle(canvas: fabric.Canvas, color: string = '#000') {
  const center = canvas.getVpCenter();
  const circle = new fabric.Circle({
    radius: 50,
    left: center.x - 100,
    top: center.y - 200,
    fill: 'transparent',
    stroke: color,
    strokeWidth: 4
  });
  canvas.add(circle);
  canvas.renderAll();
}

export function CreateShapeTriangle(canvas: fabric.Canvas, color: string = '#000') {
  const center = canvas.getVpCenter();
  const triangle = new fabric.Triangle({
    width: 100,
    height: 100,
    left: center.x - 100,
    top: center.y - 200,
    fill: 'transparent',
    stroke: color,
    strokeWidth: 4
  });
  canvas.add(triangle);
  canvas.renderAll();
}

export function CreateText(canvas: fabric.Canvas, text: string, color: string = '#000') {
  const center = canvas.getVpCenter();
  const textObj = new fabric.Textbox(text, {
    left: center.x - 100,
    top: center.y - 200,
    fill: color,
    width: 100,
    fontSize: 20
  });
  canvas.add(textObj);
  canvas.renderAll();
}

export function UpdateActiveObjectFill(canvas: fabric.Canvas, color: string) {
  const activeObjects = canvas.getActiveObjects();
  if (activeObjects.length) {
    activeObjects.forEach(obj => {
      if (obj instanceof fabric.Circle
        || obj instanceof fabric.Rect
        || obj instanceof fabric.Triangle) {
        obj.set({stroke: color});
      } else {
        obj.set({fill: color});
      }
    });
    canvas.renderAll();
  }
}
