import { EventBus, GameEvent } from '../core/EventBus';
import { SlotModel } from '../model/SlotModel';
import { WinEvaluator } from '../model/WinEvaluator';
import { ReelController } from './ReelController';
import { BoardView } from '../view/BoardView';

// Orchestrates a spin: charge bet -> spin reels -> assemble grid -> evaluate ->
// settle credits/win -> highlight winning lines.
export class GameController {
    private readonly evaluator = new WinEvaluator();

    constructor(
        private readonly bus: EventBus,
        private readonly model: SlotModel,
        private readonly reels: ReelController[],
        private readonly board: BoardView,
    ) {
        this.bus.on(GameEvent.SpinRequested, () => void this.spin());
    }

    private async spin(): Promise<void> {
        if (!this.model.canSpin()) return;

        this.model.beginSpin();
        this.board.clearHighlights();

        const columns = await Promise.all(this.reels.map((r) => r.spin())); // number[col][row]
        this.model.setGrid(columns);

        const wins = this.evaluator.evaluate(columns);
        const total = wins.reduce((sum, w) => sum + w.amount, 0);
        this.model.settleSpin(total);

        if (wins.length > 0) this.board.highlightWins(wins);
        this.bus.emit(GameEvent.SpinResolved, { wins, grid: columns });
    }
}
