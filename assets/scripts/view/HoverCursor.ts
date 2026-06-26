import { _decorator, Component, Node, sys } from 'cc';

const { ccclass } = _decorator;

// Web only: show a hand cursor while the pointer is over this node.
@ccclass('HoverCursor')
export class HoverCursor extends Component {
    onEnable(): void {
        this.node.on(Node.EventType.MOUSE_ENTER, this.enter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.leave, this);
    }

    onDisable(): void {
        this.node.off(Node.EventType.MOUSE_ENTER, this.enter, this);
        this.node.off(Node.EventType.MOUSE_LEAVE, this.leave, this);
        this.leave();
    }

    private enter(): void { this.setCursor('pointer'); }
    private leave(): void { this.setCursor('default'); }

    private setCursor(cursor: string): void {
        if (!sys.isBrowser) return;
        const doc = (globalThis as any).document;
        if (doc?.body) doc.body.style.cursor = cursor;
    }
}
