import {
    _decorator, Component, Node, SpriteAtlas, SpriteFrame,
    Animation, AnimationClip, Vec3, tween, Tween,
} from 'cc';
import { EventBus, GameEvent } from '../core/EventBus';

const { ccclass, property } = _decorator;

const FPS = 15;

// Wild presentation: when a win includes a wild, plays a big center animation
// while the board shakes and shows "WILD" in both top corners. Reverts on the
// next spin.
@ccclass('WildFxView')
export class WildFxView extends Component {
    @property(SpriteAtlas) wildAtlas: SpriteAtlas = null!; // imported .plist atlas
    @property(Animation) anim: Animation = null!;          // on the big center sprite node
    @property(Node) leftLabel: Node = null!;               // "WILD" top-left
    @property(Node) rightLabel: Node = null!;              // "WILD" top-right
    @property(Node) boardNode: Node = null!;               // shaken during the animation

    private boardHome = new Vec3();

    onLoad(): void {
        if (this.wildAtlas && this.anim) {
            const frames = (this.wildAtlas.getSpriteFrames().filter(Boolean) as SpriteFrame[])
                .sort((a, b) => (a.name < b.name ? -1 : 1));
            const clip = AnimationClip.createWithSpriteFrames(frames, FPS);
            clip.name = 'wild';
            clip.wrapMode = AnimationClip.WrapMode.Normal; // play once
            this.anim.defaultClip = clip;
            this.anim.clips = [clip];
            this.anim.on(Animation.EventType.FINISHED, () => (this.anim.node.active = false), this);
        }
        if (this.boardNode) this.boardHome = this.boardNode.position.clone();
        this.hide();
    }

    init(bus: EventBus): void {
        bus.on(GameEvent.WildAppeared, () => this.play());
        bus.on(GameEvent.SpinStateChanged, (p) => { if (p.spinning) this.reset(); });
    }

    private play(): void {
        if (this.leftLabel) this.leftLabel.active = true;
        if (this.rightLabel) this.rightLabel.active = true;

        this.startShake();
        if (this.anim) {
            this.anim.node.active = true;
            this.anim.play('wild');
        }
    }

    private reset(): void {
        this.hide();
        this.stopShake();
    }

    private hide(): void {
        if (this.leftLabel) this.leftLabel.active = false;
        if (this.rightLabel) this.rightLabel.active = false;
        if (this.anim) this.anim.node.active = false;
    }

    private startShake(): void {
        if (!this.boardNode) return;
        this.stopShake();
        tween(this.boardNode)
            .repeatForever(
                tween(this.boardNode)
                    .by(0.05, { position: new Vec3(7, 0, 0) })
                    .by(0.05, { position: new Vec3(-7, 0, 0) }),
            )
            .start();
        const duration = this.wildAtlas ? this.wildAtlas.getSpriteFrames().length / FPS : 1.5;
        this.scheduleOnce(() => this.stopShake(), duration);
    }

    private stopShake(): void {
        if (!this.boardNode) return;
        Tween.stopAllByTarget(this.boardNode);
        this.boardNode.setPosition(this.boardHome);
    }
}
