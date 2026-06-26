// Typed pub/sub. Model emits events; views subscribe. Keeps layers decoupled:
// input -> Controller -> Model -> (event) -> View.

export enum GameEvent {
    CreditsChanged = 'credits-changed',     // { credits }
    WinChanged = 'win-changed',             // { win, totalWin }
    SpinsChanged = 'spins-changed',         // { spins }
    SpinStateChanged = 'spin-state-changed',// { spinning }
    SpinRequested = 'spin-requested',       // (none) — from the HUD
    SpinResolved = 'spin-resolved',         // { wins, grid }
}

type Handler = (payload?: any) => void;

export class EventBus {
    private readonly handlers = new Map<GameEvent, Set<Handler>>();

    on(event: GameEvent, handler: Handler): void {
        let set = this.handlers.get(event);
        if (!set) this.handlers.set(event, (set = new Set()));
        set.add(handler);
    }

    off(event: GameEvent, handler: Handler): void {
        this.handlers.get(event)?.delete(handler);
    }

    emit(event: GameEvent, payload?: any): void {
        const set = this.handlers.get(event);
        if (!set) return;
        for (const h of Array.from(set)) h(payload);
    }
}
