import hotkeys from "hotkeys-js";
import * as fabric from "fabric";
import {canvasAtom, store} from "@/atom.tsx";

hotkeys('cmd+a,ctrl+a', function (event) {
  event.preventDefault();
  const canvas = store.get(canvasAtom);
  canvas.discardActiveObject();
  canvas.setActiveObject(new fabric.ActiveSelection(canvas.getObjects()));
  canvas.requestRenderAll();
});

hotkeys('delete,backspace', function () {
  // Prevent the default refresh event under WINDOWS system
  console.log('delete');
  const canvas = store.get(canvasAtom);
  const activeObjects = canvas.getActiveObjects();

  if (activeObjects.length) {
    canvas.remove(...activeObjects);
    canvas.requestRenderAll();
    canvas.discardActiveObject();
  }
});