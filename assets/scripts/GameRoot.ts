import { _decorator, Component } from 'cc';
import { REEL_STRIPS } from './core/SlotConfig';
import { Rng } from './core/Rng';
import { EventBus } from './core/EventBus';
import { ReelModel } from './model/ReelModel';
import { SlotModel } from './model/SlotModel';
import { BoardView } from './view/BoardView';
import { HudView } from './view/HudView';

const { ccclass, property } = _decorator;

// Entry point. Step 4: wire EventBus + SlotModel + HUD, and fill the board.
@ccclass('GameRoot')
export class GameRoot extends Component {
    @property(BoardView) board: BoardView = null!;
    @property(HudView) hud: HudView = null!;

    private rng = new Rng();
    private bus = new EventBus();

    start(): void {
        const model = new SlotModel(this.bus);
        this.hud.init(this.bus);

        const reelModels = REEL_STRIPS.map((strip, i) => new ReelModel(i, strip, this.rng));
        const grid = reelModels.map((m) => m.getVisible());
        this.board.setGrid(grid);

        model.broadcast(); // push initial Credits / Win / Spins to the HUD
    }
}
