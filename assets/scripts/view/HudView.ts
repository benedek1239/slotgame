import { _decorator, Component, Label, Button } from 'cc';
import { EventBus, GameEvent } from '../core/EventBus';

const { ccclass, property } = _decorator;

// Read-outs for Credits / Win / Spins + the Spin button. Subscribes to the bus;
// never touches the model.
@ccclass('HudView')
export class HudView extends Component {
    @property(Label) creditsLabel: Label = null!;
    @property(Label) winLabel: Label = null!;
    @property(Label) spinsLabel: Label = null!;
    @property(Button) spinButton: Button = null!;

    init(bus: EventBus): void {
        bus.on(GameEvent.CreditsChanged, (p) => (this.creditsLabel.string = String(p.credits)));
        bus.on(GameEvent.WinChanged, (p) => (this.winLabel.string = String(p.win)));
        bus.on(GameEvent.SpinsChanged, (p) => (this.spinsLabel.string = String(p.spins)));
        bus.on(GameEvent.SpinStateChanged, (p) => (this.spinButton.interactable = !p.spinning));

        this.spinButton.node.on(Button.EventType.CLICK, () => bus.emit(GameEvent.SpinRequested), this);
    }
}
