// Shared types. No Cocos imports so the model/rules layer stays pure TS.
// Grid convention everywhere: number[col][row], col 0..4 left->right, row 0..2 top->bottom.

export enum SymType {
    WILD = 'wild',
    HIGH = 'high',
    LOW = 'low',
}

export interface SymbolDef {
    id: number;
    code: string;
    name: string;
    type: SymType;
    color: { r: number; g: number; b: number };
    // AssetService key for the artwork; absent => rendered as a placeholder tile.
    texture?: string;
}

export type Grid = number[][];

export interface WinLine {
    line: number;        // 1-based payline number
    lineIndex: number;   // index into PAYLINES
    symbolId: number;    // winning symbol after wild resolution
    count: number;       // matching reels from the left (3..5)
    amount: number;
    cells: Array<[number, number]>;
}
