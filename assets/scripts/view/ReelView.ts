import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { LAYOUT, ROWS } from '../core/SlotConfig';
import { AssetService } from '../core/AssetService';
import { SymbolView } from './SymbolView';

const { ccclass } = _decorator;

// View of one reel: instantiates the visible symbol tiles into its Content node.
// (Spin animation comes in a later step.)
@ccclass('ReelView')
export class ReelView extends Component {
    private content: Node = null!;
    private tiles: SymbolView[] = [];

    // Called by BoardView with the shared prefab/assets.
    setup(symbolPrefab: Prefab, assets: AssetService): void {
        this.content = this.node.getChildByName('Content')!;
        for (let row = 0; row < ROWS; row++) {
            const node = instantiate(symbolPrefab);
            this.content.addChild(node);
            node.setPosition(0, (1 - row) * LAYOUT.cellH, 0); // top=+cellH, mid=0, bottom=-cellH
            const view = node.getComponent(SymbolView)!;
            view.bind(assets);
            this.tiles.push(view);
        }
    }

    setVisible(symbols: number[]): void {
        for (let row = 0; row < ROWS; row++) this.tiles[row].setSymbol(symbols[row]);
    }
}
