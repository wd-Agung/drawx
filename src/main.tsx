import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './app.tsx';
import './index.css';
import {Provider} from "jotai";
import {store} from "@/atom.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </StrictMode>,
);
