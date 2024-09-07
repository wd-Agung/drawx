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

    const canvasResizer = () => {
      if (!containerRef.current) return;
      console.log('resizing', containerRef.current.offsetWidth, containerRef.current.offsetHeight);
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
    <div>
      <Toolbar/>
      <div ref={containerRef} className="w-full h-full">
        <canvas width="1024" height="1024" ref={canvasEl}/>
      </div>
    </div>
  );
}

export default App;
