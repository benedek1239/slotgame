import { PAYLINES, PAYTABLE, WILD_ID } from '../core/SlotConfig';
import { WinLine } from '../core/Types';

// Evaluates a grid (number[col][row]) against the paylines, left-to-right,
// with Wild substituting for any symbol.
export class WinEvaluator {
    evaluate(grid: number[][]): WinLine[] {
        const wins: WinLine[] = [];
        for (let i = 0; i < PAYLINES.length; i++) {
            const line = PAYLINES[i];
            const symbols = line.map((row, col) => grid[col][row]);
            const win = this.evaluateLine(symbols, i, line);
            if (win) wins.push(win);
        }
        return wins;
    }

    private evaluateLine(symbols: number[], lineIndex: number, rows: number[]): WinLine | null {
        // Base symbol = first non-wild (or Wild if the whole line is wild).
        let base = WILD_ID;
        for (const s of symbols) {
            if (s !== WILD_ID) { base = s; break; }
        }

        // Count matching reels from the left (a reel matches the target or a Wild).
        const countFor = (target: number): number => {
            let c = 0;
            for (const s of symbols) {
                if (s === target || s === WILD_ID) c++;
                else break;
            }
            return c;
        };

        const baseCount = countFor(base);
        let bestSymbol = base;
        let bestCount = baseCount;
        let bestPay = this.payout(base, baseCount);

        // Leading wilds can pay more as pure Wilds than as the substituted symbol.
        if (base !== WILD_ID) {
            const wildCount = countFor(WILD_ID);
            const wildPay = this.payout(WILD_ID, wildCount);
            if (wildPay > bestPay) {
                bestSymbol = WILD_ID;
                bestCount = wildCount;
                bestPay = wildPay;
            }
        }

        if (bestPay <= 0) return null;

        const cells: Array<[number, number]> = [];
        for (let col = 0; col < bestCount; col++) cells.push([col, rows[col]]);

        return { line: lineIndex + 1, lineIndex, symbolId: bestSymbol, count: bestCount, amount: bestPay, cells };
    }

    // Paytable lookup; counts < 3 pay nothing.
    private payout(symbolId: number, count: number): number {
        if (count < 3) return 0;
        const row = PAYTABLE[symbolId];
        return row ? row[Math.min(count, 5) - 3] : 0;
    }
}
