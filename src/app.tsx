import {useEffect, useRef} from 'react';
import {Toolbar} from './components/toolbar.tsx';
import * as fabric from 'fabric';
import {useSetAtom} from "jotai";
import {canvasAtom} from "./atom";
import "./hotkey.ts";


const App = () => {
  const setCanvas = useSetAtom(canvasAtom);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const options = {};
    const canvas = new fabric.Canvas(canvasRef.current!, options);
    setCanvas(canvas);

    canvas.on('mouse:wheel', (opt) => {
      const thiz = this as unknown as fabric.Canvas;
      if (opt.e.ctrlKey) {
        const delta = opt.e.deltaY;
        let zoom = thiz.getZoom();
        if (!zoom) return;

        zoom *= 0.99 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        const center = thiz.getCenter();
        const point = opt.pointer ?? new fabric.Point(center.left, center.top);
        thiz.zoomToPoint(point, zoom);
      } else {
        thiz.relativePan(new fabric.Point(opt.e.deltaX, opt.e.deltaY));
      }

      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    const canvasResizer = () => {
      if (!containerRef.current) return;
      canvas.setDimensions({
        width: containerRef.current?.offsetWidth,
        height: containerRef.current?.offsetHeight
      });
    };

    const resizeObserver = new ResizeObserver(canvasResizer);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current!);
    }
    return () => {
      canvas.dispose();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="dot-tile">
      <Toolbar/>
      <div ref={containerRef} className="w-full h-full">
        <canvas id="canvas" width="1024" height="1024" ref={canvasRef}/>
      </div>
    </div>
  );
};

export default App;
