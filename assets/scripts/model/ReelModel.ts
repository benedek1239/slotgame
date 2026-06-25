import { ROWS } from '../core/SlotConfig';
import { Rng } from '../core/Rng';

// Model of one reel: owns a strip, rolls a random stop, reports visible symbols.
export class ReelModel {
    private visible: number[] = [];

    constructor(
        public readonly index: number,
        private readonly strip: number[],
        private readonly rng: Rng,
    ) {
        this.roll();
    }

    // Pick a random stop; visible = ROWS consecutive symbols, top->bottom.
    roll(): number[] {
        const stop = this.rng.int(this.strip.length);
        this.visible = [];
        for (let row = 0; row < ROWS; row++) {
            this.visible.push(this.strip[(stop + row) % this.strip.length]);
        }
        return this.getVisible();
    }

    getVisible(): number[] {
        return this.visible.slice();
    }

    randomSymbol(): number {
        return this.strip[this.rng.int(this.strip.length)];
    }
}
