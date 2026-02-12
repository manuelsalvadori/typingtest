import { atomWithStorage } from "jotai/utils";

export const bestScoreAtom = atomWithStorage<number>("bestScore", 0);
