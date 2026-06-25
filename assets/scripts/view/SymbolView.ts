import { _decorator, Component, Sprite, Label, Color } from 'cc';
import { getSymbolDef } from '../core/SlotConfig';
import { AssetService } from '../core/AssetService';

const { ccclass } = _decorator;

// One symbol tile (on the Symbol prefab): real art if available, else a
// colored placeholder tile with the symbol code.
@ccclass('SymbolView')
export class SymbolView extends Component {
    private assets: AssetService = null!;
    private art: Sprite = null!;
    private label: Label = null!;

    bind(assets: AssetService): void {
        this.assets = assets;
    }

    // Resolve refs lazily so it works right after instantiate().
    private ensureRefs(): void {
        if (!this.art) {
            this.art = this.getComponent(Sprite)!;
            this.art.sizeMode = Sprite.SizeMode.CUSTOM;
            this.art.trim = false;
        }
        if (!this.label) {
            this.label = this.getComponentInChildren(Label)!;
        }
    }

    setSymbol(id: number): void {
        this.ensureRefs();
        const def = getSymbolDef(id);
        const frame = this.assets ? this.assets.getFrame(def.texture) : null;

        if (frame) {
            this.art.spriteFrame = frame;
            this.art.color = Color.WHITE;
            this.label.node.active = false;
        } else {
            this.art.spriteFrame = this.assets ? this.assets.whiteFrame : null;
            const c = def.color;
            this.art.color = new Color(c.r, c.g, c.b, 255);
            this.label.node.active = true;
            this.label.string = def.code;
            const luma = c.r * 0.299 + c.g * 0.587 + c.b * 0.114;
            this.label.color = luma > 150 ? new Color(40, 40, 40, 255) : new Color(255, 255, 255, 255);
        }
    }
}
