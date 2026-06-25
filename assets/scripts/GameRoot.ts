import { _decorator, Component } from 'cc';
import { REEL_STRIPS } from './core/SlotConfig';
import { Rng } from './core/Rng';
import { ReelModel } from './model/ReelModel';
import { BoardView } from './view/BoardView';

const { ccclass, property } = _decorator;

// Entry point. Step 3: build reel models and fill the board with a random grid.
@ccclass('GameRoot')
export class GameRoot extends Component {
    @property(BoardView) board: BoardView = null!;

    private rng = new Rng();

    start(): void {
        const reelModels = REEL_STRIPS.map((strip, i) => new ReelModel(i, strip, this.rng));
        const grid = reelModels.map((m) => m.getVisible());
        this.board.setGrid(grid);
    }
}
