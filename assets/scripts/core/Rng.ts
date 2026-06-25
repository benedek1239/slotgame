// Single random source (so it can be seeded for tests later).
export class Rng {
    int(maxExclusive: number): number {
        return Math.floor(Math.random() * maxExclusive);
    }
}
