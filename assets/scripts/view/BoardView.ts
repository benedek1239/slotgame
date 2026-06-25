import { _decorator, Component, Node, Prefab } from 'cc';
import { AssetService } from '../core/AssetService';
import { ReelView } from './ReelView';

const { ccclass, property } = _decorator;

// Owns the 5 reels. Wires a ReelView onto each reel node and fans out the grid.
@ccclass('BoardView')
export class BoardView extends Component {
    @property(Prefab) symbolPrefab: Prefab = null!;
    @property(AssetService) assets: AssetService = null!;
    @property({ type: [Node] }) reelNodes: Node[] = []; // Reel_0..Reel_4

    private reels: ReelView[] = [];

    onLoad(): void {
        for (const node of this.reelNodes) {
            const reel = node.getComponent(ReelView) ?? node.addComponent(ReelView);
            reel.setup(this.symbolPrefab, this.assets);
            this.reels.push(reel);
        }
    }

    // grid is number[col][row].
    setGrid(grid: number[][]): void {
        for (let col = 0; col < this.reels.length; col++) this.reels[col].setVisible(grid[col]);
    }

    getReels(): ReelView[] {
        return this.reels;
    }
}
