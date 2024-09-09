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
    const options = {};
    const canvas = new fabric.Canvas(canvasRef.current!, options);
    setCanvas(canvas);

    canvas.on('mouse:wheel', (opt) => {
      if (opt.e.ctrlKey) {
        const delta = opt.e.deltaY;
        let zoom = canvas.getZoom();

        zoom *= 0.99 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        const center = canvas.getCenter();
        const point = opt.pointer ?? new fabric.Point(center.left, center.top);
        canvas.zoomToPoint(point, zoom);
      } else if (opt.e.altKey) {
        canvas.relativePan(new fabric.Point(opt.e.deltaY, 0));
      } else {
        canvas.relativePan(new fabric.Point(opt.e.deltaX, opt.e.deltaY));
      }

      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    const loadCanvas = () => {
      const json = localStorage.getItem('canvas');
      if (json) {
        canvas.loadFromJSON(json, () => {
          canvas.renderAll();
        });
      }
    };

    loadCanvas();

    const saveCanvas = () => {
      localStorage.setItem('canvas', JSON.stringify(canvas.toJSON()));
    };

    canvas.on('object:modified', saveCanvas);
    canvas.on('object:added', saveCanvas);
    canvas.on('object:removed', saveCanvas);

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
      <div ref={containerRef} className="w-full" style={{height: '94dvh'}}>
        <canvas id="canvas" width="1024" height="1024" ref={canvasRef}/>
      </div>
    </div>
  );
};

export default App;
