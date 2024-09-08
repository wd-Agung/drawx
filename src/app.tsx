import {useEffect, useRef} from 'react';
import {Toolbar} from './components/Toolbar';
import * as fabric from 'fabric';
import {useSetAtom} from "jotai";
import {canvasAtom} from "./atom";
import "./hotkey.ts";


function App() {
  const setCanvas = useSetAtom(canvasAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const options = {};
    const canvas = new fabric.Canvas(canvasEl.current, options);
    setCanvas(canvas);

    canvas.on('mouse:wheel', function (opt) {
      if (opt.e.ctrlKey) {
        const delta = opt.e.deltaY;
        let zoom = this.getZoom();
        zoom *= 0.99 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        const center = this.getCenter();
        const point = opt.pointer ?? new fabric.Point(center.left, center.top);
        this.zoomToPoint(point, zoom);
      } else {
        this.relativePan(new fabric.Point(opt.e.deltaX, opt.e.deltaY));
      }

      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    const canvasResizer = () => {
      if (!containerRef.current) return;
      canvas.setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
    };

    const resizeObserver = new ResizeObserver(canvasResizer);
    resizeObserver.observe(containerRef.current);
    return () => {
      canvas.dispose();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="dot-tile">
      <Toolbar/>
      <div ref={containerRef} className="w-full h-full">
        <canvas width="1024" height="1024" ref={canvasEl}/>
      </div>
    </div>
  );
}

export default App;
