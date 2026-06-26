import { ReelModel } from '../model/ReelModel';
import { ReelView } from '../view/ReelView';

// Pairs one ReelModel with one ReelView: roll a result, animate to it.
export class ReelController {
    constructor(
        private readonly model: ReelModel,
        private readonly view: ReelView,
    ) {}

    async spin(): Promise<number[]> {
        const targets = this.model.roll(); // [top, mid, bottom]
        await this.view.spin(targets, () => this.model.randomSymbol());
        return targets;
    }
}
