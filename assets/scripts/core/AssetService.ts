import { _decorator, Component, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

// Sprite frames are assigned in the editor; SymbolView pulls them by config key.
@ccclass('AssetService')
export class AssetService extends Component {
    @property(SpriteFrame) wild: SpriteFrame = null!;
    @property(SpriteFrame) h1: SpriteFrame = null!;
    @property(SpriteFrame) h2: SpriteFrame = null!;
    @property(SpriteFrame) h3: SpriteFrame = null!;
    @property(SpriteFrame) h4: SpriteFrame = null!;

    // Plain white square used to tint placeholder tiles (L1-L5).
    @property(SpriteFrame) whiteFrame: SpriteFrame = null!;

    getFrame(key?: string): SpriteFrame | null {
        switch (key) {
            case 'wild': return this.wild;
            case 'h1': return this.h1;
            case 'h2': return this.h2;
            case 'h3': return this.h3;
            case 'h4': return this.h4;
            default: return null;
        }
    }
}
