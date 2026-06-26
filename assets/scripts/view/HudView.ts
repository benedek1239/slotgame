import { _decorator, Component, Label } from 'cc';
import { EventBus, GameEvent } from '../core/EventBus';

const { ccclass, property } = _decorator;

// Read-outs for Credits / Win / Spins. Subscribes to the bus; never touches the model.
@ccclass('HudView')
export class HudView extends Component {
    @property(Label) creditsLabel: Label = null!;
    @property(Label) winLabel: Label = null!;
    @property(Label) spinsLabel: Label = null!;

    init(bus: EventBus): void {
        bus.on(GameEvent.CreditsChanged, (p) => (this.creditsLabel.string = String(p.credits)));
        bus.on(GameEvent.WinChanged, (p) => (this.winLabel.string = String(p.win)));
        bus.on(GameEvent.SpinsChanged, (p) => (this.spinsLabel.string = String(p.spins)));
    }
}
