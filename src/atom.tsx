import {atom} from "jotai";
import {Canvas} from "fabric";
import {createStore} from "jotai/index";

export const store = createStore();

export const canvasAtom = atom<Canvas>(new Canvas());