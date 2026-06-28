import { _decorator, Component, AudioSource, AudioClip } from 'cc';

const { ccclass, property } = _decorator;

export type SfxName = 'reelStop' | 'win' | 'wild';

// Plays one-shot sound effects. Clips are assigned in the editor.
@ccclass('AudioService')
export class AudioService extends Component {
    @property(AudioClip) reelStop: AudioClip = null!; // "slot in" — per reel stop
    @property(AudioClip) win: AudioClip = null!;
    @property(AudioClip) wild: AudioClip = null!;

    private source: AudioSource = null!;

    onLoad(): void {
        this.source = this.getComponent(AudioSource) ?? this.addComponent(AudioSource);
    }

    play(name: SfxName): void {
        const clip = name === 'win' ? this.win : name === 'wild' ? this.wild : this.reelStop;
        if (clip) this.source.playOneShot(clip, 1);
    }
}
