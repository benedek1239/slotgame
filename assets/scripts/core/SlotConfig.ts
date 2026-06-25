import { SymbolDef, SymType } from './Types';

// Data-driven game rules. Change symbols/payouts/lines/strips here only.

export const REELS = 5;
export const ROWS = 3;
export const WILD_ID = 0;

// `texture` is the AssetService key. L1-L5 have none -> placeholder tiles.
export const SYMBOLS: SymbolDef[] = [
    { id: 0, code: 'W',  name: 'Wild',     type: SymType.WILD, color: { r: 240, g: 180, b: 40 }, texture: 'wild' },
    { id: 1, code: 'H1', name: 'Pineapple',type: SymType.HIGH, color: { r: 245, g: 210, b: 60 }, texture: 'h1' },
    { id: 2, code: 'H2', name: 'Mango',    type: SymType.HIGH, color: { r: 240, g: 140, b: 70 }, texture: 'h2' },
    { id: 3, code: 'H3', name: 'Coconut',  type: SymType.HIGH, color: { r: 150, g: 110, b: 80 }, texture: 'h3' },
    { id: 4, code: 'H4', name: 'Banana',   type: SymType.HIGH, color: { r: 235, g: 220, b: 90 }, texture: 'h4' },
    { id: 5, code: 'L1', name: 'L1',       type: SymType.LOW,  color: { r: 90,  g: 180, b: 100 } },
    { id: 6, code: 'L2', name: 'L2',       type: SymType.LOW,  color: { r: 90,  g: 150, b: 200 } },
    { id: 7, code: 'L3', name: 'L3',       type: SymType.LOW,  color: { r: 150, g: 120, b: 200 } },
    { id: 8, code: 'L4', name: 'L4',       type: SymType.LOW,  color: { r: 200, g: 90,  b: 120 } },
    { id: 9, code: 'L5', name: 'L5',       type: SymType.LOW,  color: { r: 120, g: 120, b: 130 } },
];

// id -> [pay x3, x4, x5]. Counts < 3 pay nothing.
export const PAYTABLE: Record<number, [number, number, number]> = {
    0: [100, 1000, 2000],
    1: [50,  500,  1000],
    2: [20,  150,  750],
    3: [15,  100,  500],
    4: [15,  100,  500],
    5: [10,  75,   250],
    6: [5,   50,   150],
    7: [5,   25,   150],
    8: [5,   25,   150],
    9: [5,   15,   100],
};

// Row index per reel (0=top,1=mid,2=bottom), left->right.
export const PAYLINES: number[][] = [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2],
    [0, 1, 2, 1, 0],
    [2, 1, 0, 1, 2],
    [0, 0, 1, 2, 2],
    [2, 2, 1, 0, 0],
    [1, 0, 0, 0, 1],
    [1, 2, 2, 2, 1],
    [2, 1, 2, 1, 2],
];

// Per-reel symbol strips (drive the symbol frequency / math).
export const REEL_STRIPS: number[][] = [
    [5, 1, 6, 9, 2, 7, 5, 0, 8, 3, 6, 9, 4, 5, 7, 1, 8, 6, 9, 2, 5, 7, 8, 4],
    [9, 6, 2, 5, 8, 1, 7, 9, 3, 0, 5, 6, 8, 4, 9, 7, 2, 5, 1, 8, 6, 9, 3, 7],
    [7, 5, 9, 1, 6, 8, 2, 5, 9, 7, 0, 4, 6, 8, 3, 5, 9, 1, 7, 6, 8, 2, 5, 9],
    [8, 9, 5, 7, 2, 6, 9, 1, 5, 8, 3, 7, 0, 6, 9, 4, 5, 8, 2, 7, 6, 9, 1, 5],
    [6, 9, 7, 5, 8, 2, 9, 6, 1, 7, 5, 9, 8, 3, 0, 6, 4, 9, 7, 5, 8, 2, 9, 6],
];

export const ECONOMY = {
    startingCredits: 1000,
    lineBet: 1,
    lines: PAYLINES.length,
    get totalBet(): number {
        return this.lineBet * this.lines;
    },
};

export const LAYOUT = {
    cellW: 120,
    cellH: 120,
};

export function getSymbolDef(id: number): SymbolDef {
    return SYMBOLS[id];
}
