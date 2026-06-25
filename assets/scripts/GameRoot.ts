import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { AssetService } from './core/AssetService';
import { SymbolView } from './view/SymbolView';

const { ccclass, property } = _decorator;

// Entry point. Step 2: just spawn one symbol into a reel to verify the setup.
@ccclass('GameRoot')
export class GameRoot extends Component {
    @property(AssetService) assets: AssetService = null!;
    @property(Prefab) symbolPrefab: Prefab = null!;
    @property(Node) testParent: Node = null!;
    @property testSymbolId = 0; // 0=Wild, 1-4=H1-H4, 5-9=L1-L5

    start(): void {
        const node = instantiate(this.symbolPrefab);
        this.testParent.addChild(node);
        node.setPosition(0, 0, 0);

        const view = node.getComponent(SymbolView)!;
        view.bind(this.assets);
        view.setSymbol(this.testSymbolId);
    }
}
