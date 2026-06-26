import { _decorator, Component, Node, Prefab, instantiate, tween, Vec3 } from 'cc';
import { LAYOUT, ROWS } from '../core/SlotConfig';
import { AssetService } from '../core/AssetService';
import { SymbolView } from './SymbolView';

const { ccclass } = _decorator;

// View of one reel. A tall strip of tiles lives in Content; spinning tweens
// Content downward so symbols scroll top->bottom and ease to a stop on the
// rolled result. Strip tile k sits at y=(k-1)*cellH (higher k = higher up):
//   - content.y = 0       -> window shows tiles ROWS-1..0 (idle / bottom of strip)
//   - content.y = -travel -> window shows the last ROWS tiles (the result)
@ccclass('ReelView')
export class ReelView extends Component {
    private content: Node = null!;
    private tiles: SymbolView[] = [];
    private stripLen = 0;
    private travel = 0;
    private duration = 0.9;
    private prevVisible: number[] = [];

    setup(index: number, symbolPrefab: Prefab, assets: AssetService): void {
        this.stripLen = 18 + index * 3;            // longer strips later -> left-to-right stop cascade
        this.travel = (this.stripLen - ROWS) * LAYOUT.cellH;
        this.duration = 0.9 + index * 0.18;

        this.content = this.node.getChildByName('Content')!;
        for (let k = 0; k < this.stripLen; k++) {
            const node = instantiate(symbolPrefab);
            this.content.addChild(node);
            node.setPosition(0, (k - 1) * LAYOUT.cellH, 0);
            const view = node.getComponent(SymbolView)!;
            view.bind(assets);
            this.tiles.push(view);
        }
        this.content.setPosition(0, 0, 0);
    }

    private idleIndex(row: number): number { return (ROWS - 1) - row; }   // initial window
    private resultIndex(row: number): number { return this.stripLen - 1 - row; } // final window

    setVisible(symbols: number[]): void {
        this.prevVisible = symbols.slice();
        for (let row = 0; row < ROWS; row++) this.tiles[this.idleIndex(row)].setSymbol(symbols[row]);
    }

    // Spin to `targets` ([top,mid,bottom]); randomSymbol fills the blur.
    spin(targets: number[], randomSymbol: () => number): Promise<void> {
        // Seed strip: bottom = current (no jump on reset), middle = random, top = result.
        for (let row = 0; row < ROWS; row++) {
            this.tiles[this.idleIndex(row)].setSymbol(this.prevVisible[row] ?? randomSymbol());
        }
        for (let k = ROWS; k < this.stripLen - ROWS; k++) this.tiles[k].setSymbol(randomSymbol());
        for (let row = 0; row < ROWS; row++) this.tiles[this.resultIndex(row)].setSymbol(targets[row]);

        this.content.setPosition(0, 0, 0);
        this.prevVisible = targets.slice();

        return new Promise<void>((resolve) => {
            tween(this.content)
                .to(this.duration, { position: new Vec3(0, -this.travel, 0) }, { easing: 'cubicOut' })
                .call(() => resolve())
                .start();
        });
    }
}
