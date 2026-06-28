import { _decorator, Component, Node, Prefab, UITransform, Graphics, Color, Vec3, tween, Tween } from 'cc';
import { LAYOUT } from '../core/SlotConfig';
import { WinLine } from '../core/Types';
import { AssetService } from '../core/AssetService';
import { ReelView } from './ReelView';

const { ccclass, property } = _decorator;

// Colors cycled across simultaneous winning lines.
const LINE_COLORS = [
    new Color(255, 80, 80, 220), new Color(80, 200, 255, 220),
    new Color(120, 255, 120, 220), new Color(255, 220, 60, 220),
    new Color(255, 120, 240, 220),
];

// Owns the 5 reels and the win-highlight overlay.
@ccclass('BoardView')
export class BoardView extends Component {
    @property(Prefab) symbolPrefab: Prefab = null!;
    @property(AssetService) assets: AssetService = null!;
    @property({ type: [Node] }) reelNodes: Node[] = []; // Reel_0..Reel_4

    private reels: ReelView[] = [];
    private overlay: Graphics = null!;
    private pulsing: Node[] = [];

    onLoad(): void {
        this.reelNodes.forEach((node, index) => {
            const reel = node.getComponent(ReelView) ?? node.addComponent(ReelView);
            reel.setup(index, this.symbolPrefab, this.assets);
            this.reels.push(reel);
        });

        const overlayNode = new Node('WinOverlay');
        overlayNode.layer = this.node.layer;
        this.node.addChild(overlayNode);
        overlayNode.addComponent(UITransform);
        this.overlay = overlayNode.addComponent(Graphics);
    }

    // grid is number[col][row].
    setGrid(grid: number[][]): void {
        for (let col = 0; col < this.reels.length; col++) this.reels[col].setVisible(grid[col]);
    }

    getReels(): ReelView[] {
        return this.reels;
    }

    // Draw winning paylines and pulse their cells.
    highlightWins(wins: WinLine[]): void {
        this.clearHighlights();
        wins.forEach((win, i) => {
            this.overlay.lineWidth = 6;
            this.overlay.strokeColor = LINE_COLORS[i % LINE_COLORS.length];
            win.cells.forEach(([col, row], idx) => {
                const p = this.cellCenter(col, row);
                if (idx === 0) this.overlay.moveTo(p.x, p.y);
                else this.overlay.lineTo(p.x, p.y);
                this.pulse(this.reels[col].getResultTile(row).node);
            });
            this.overlay.stroke();
        });
    }

    clearHighlights(): void {
        this.overlay.clear();
        for (const node of this.pulsing) {
            Tween.stopAllByTarget(node);
            node.setScale(1, 1, 1);
        }
        this.pulsing.length = 0;
    }

    private cellCenter(col: number, row: number): Vec3 {
        const rp = this.reelNodes[col].position;
        return new Vec3(rp.x, rp.y + (1 - row) * LAYOUT.cellH, 0);
    }

    private pulse(node: Node): void {
        this.pulsing.push(node);
        tween(node)
            .repeatForever(
                tween(node)
                    .to(0.35, { scale: new Vec3(1.12, 1.12, 1) })
                    .to(0.35, { scale: new Vec3(1, 1, 1) }),
            )
            .start();
    }
}
