import { _decorator, Component } from 'cc';
import { REEL_STRIPS } from './core/SlotConfig';
import { Rng } from './core/Rng';
import { EventBus } from './core/EventBus';
import { ReelModel } from './model/ReelModel';
import { SlotModel } from './model/SlotModel';
import { AudioService } from './core/AudioService';
import { BoardView } from './view/BoardView';
import { HudView } from './view/HudView';
import { ReelController } from './controller/ReelController';
import { GameController } from './controller/GameController';

const { ccclass, property } = _decorator;

// Entry point. Step 5: wire models, views, and controllers for a full spin.
@ccclass('GameRoot')
export class GameRoot extends Component {
    @property(BoardView) board: BoardView = null!;
    @property(HudView) hud: HudView = null!;
    @property(AudioService) audio: AudioService = null!;

    private rng = new Rng();
    private bus = new EventBus();
    private controller!: GameController;

    start(): void {
        const model = new SlotModel(this.bus);
        this.hud.init(this.bus);

        const reelModels = REEL_STRIPS.map((strip, i) => new ReelModel(i, strip, this.rng));
        this.board.setGrid(reelModels.map((m) => m.getVisible()));

        const reelControllers = reelModels.map((m, i) => new ReelController(m, this.board.getReels()[i]));
        this.controller = new GameController(this.bus, model, reelControllers, this.board, this.audio);

        model.broadcast();
    }
}