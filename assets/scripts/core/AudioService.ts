import { _decorator, Component, AudioSource, AudioClip } from 'cc';

const { ccclass, property } = _decorator;

export type SfxName = 'reelStop' | 'win';

// Plays sound effects. Clips are assigned in the editor.
@ccclass('AudioService')
export class AudioService extends Component {
    @property(AudioClip) reelStop: AudioClip = null!; // "slot in" — per reel stop
    @property(AudioClip) win: AudioClip = null!;
    @property(AudioClip) wild: AudioClip = null!;

    private source: AudioSource = null!;

    onLoad(): void {
        this.source = this.getComponent(AudioSource) ?? this.addComponent(AudioSource);
    }

    // Fire-and-forget short sfx (can overlap).
    play(name: SfxName): void {
        const clip = name === 'win' ? this.win : this.reelStop;
        if (clip) this.source.playOneShot(clip, 1);
    }

    // Wild plays on the main channel so it can be stopped when the next spin starts.
    playWild(): void {
        if (!this.wild) return;
        this.source.stop();
        this.source.clip = this.wild;
        this.source.play();
    }

    stopWild(): void {
        this.source.stop();
    }
}
