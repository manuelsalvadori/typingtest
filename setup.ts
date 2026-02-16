// setup.ts
import { Window } from "happy-dom";
import { expect } from "bun:test";
import * as matchers from "@testing-library/jest-dom/matchers";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import { mock } from "bun:test";

// Mock per gli asset statici (SVG, PNG, JPG, CSS ecc.)
// Questo impedisce a Bun di crashare quando li incontra nei tuoi componenti
mock.module("*.+(svg|png|jpg|jpeg|gif|webp|css|scss)", () => {
  return {
    default: "static-asset-stub",
  };
});

// 1. Crea un'istanza di Window di Happy DOM
const window = new Window();

// 2. Registra globalmente le variabili del browser che React si aspetta
global.window = window as any;
global.document = window.document as any;
global.navigator = window.navigator as any;
global.Node = window.Node as any;
global.HTMLElement = window.HTMLElement as any;
global.HTMLInputElement = window.HTMLInputElement as any;
global.KeyboardEvent = window.KeyboardEvent as any;
// Aggiungi altri se necessario (es. global.Request, global.Response)
// Questo blocco dice a TypeScript che 'expect' ora ha anche i metodi di jest-dom

declare module "bun:test" {
    interface Matchers<T> extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
}

// 3. Configura i matchers di testing-library (es. toBeInTheDocument)
expect.extend(matchers);
