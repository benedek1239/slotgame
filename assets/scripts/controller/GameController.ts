import { EventBus, GameEvent } from '../core/EventBus';
import { SlotModel } from '../model/SlotModel';
import { ReelController } from './ReelController';

// Orchestrates a spin: charge bet -> spin all reels -> assemble grid -> settle.
// (Win evaluation is added in the next step; for now every spin pays 0.)
export class GameController {
    constructor(
        private readonly bus: EventBus,
        private readonly model: SlotModel,
        private readonly reels: ReelController[],
    ) {
        this.bus.on(GameEvent.SpinRequested, () => void this.spin());
    }

    private async spin(): Promise<void> {
        if (!this.model.canSpin()) return;

        this.model.beginSpin();
        const columns = await Promise.all(this.reels.map((r) => r.spin())); // number[col][row]
        this.model.setGrid(columns);
        this.model.settleSpin(0);
    }
}
