import { test, expect } from "bun:test";

test("Ambiente DOM funzionante", () => {
    document.body.innerHTML = '<button id="btn">Click</button>';
    const btn = document.getElementById("btn");
    expect(btn?.tagName).toBe("BUTTON");
});
