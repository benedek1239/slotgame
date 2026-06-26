import { ECONOMY } from '../core/SlotConfig';
import { EventBus, GameEvent } from '../core/EventBus';

// Game-level state: credits, bet, win, spins, grid. Emits events on change.
export class SlotModel {
    private _credits: number;
    private _lastWin = 0;
    private _totalWin = 0;
    private _spins = 0;
    private _spinning = false;
    private _grid: number[][] = [];

    constructor(private readonly bus: EventBus) {
        this._credits = ECONOMY.startingCredits;
    }

    get credits(): number { return this._credits; }
    get lastWin(): number { return this._lastWin; }
    get spins(): number { return this._spins; }
    get spinning(): boolean { return this._spinning; }
    get totalBet(): number { return ECONOMY.totalBet; }
    get grid(): number[][] { return this._grid; }

    canSpin(): boolean {
        return !this._spinning && this._credits >= this.totalBet;
    }

    // Charge the bet and enter spinning state.
    beginSpin(): void {
        this._credits -= this.totalBet;
        this._lastWin = 0;
        this._spins += 1;
        this.setSpinning(true);
        this.bus.emit(GameEvent.CreditsChanged, { credits: this._credits });
        this.bus.emit(GameEvent.WinChanged, { win: this._lastWin, totalWin: this._totalWin });
        this.bus.emit(GameEvent.SpinsChanged, { spins: this._spins });
    }

    setGrid(grid: number[][]): void {
        this._grid = grid;
    }

    // Award the win and leave spinning state.
    settleSpin(win: number): void {
        this._lastWin = win;
        this._totalWin += win;
        this._credits += win;
        this.setSpinning(false);
        this.bus.emit(GameEvent.CreditsChanged, { credits: this._credits });
        this.bus.emit(GameEvent.WinChanged, { win: this._lastWin, totalWin: this._totalWin });
    }

    // Push current values so a freshly-subscribed HUD shows the initial state.
    broadcast(): void {
        this.bus.emit(GameEvent.CreditsChanged, { credits: this._credits });
        this.bus.emit(GameEvent.WinChanged, { win: this._lastWin, totalWin: this._totalWin });
        this.bus.emit(GameEvent.SpinsChanged, { spins: this._spins });
        this.bus.emit(GameEvent.SpinStateChanged, { spinning: this._spinning });
    }

    private setSpinning(value: boolean): void {
        this._spinning = value;
        this.bus.emit(GameEvent.SpinStateChanged, { spinning: value });
    }
}
