import type { Recettes } from "./types/types";

class Officine {
  public ingredients: string[] = [];
  public recettes: Recettes = {};
  public singularMap: Record<string, string> = {};
  public stocks: Map<string, number> = new Map();

  constructor() {
    this.ingredients = [
      "œil/yeux de grenouille",
      "larme de brume funèbre",
      "radicelle de racine hurlante",
      "pincée de poudre de lune",
      "croc de troll",
      "fragment d'écaille de dragonnet",
      "goutte de sang de Citrouille",
    ];
    this.recettes = {
      "fiole de glaires purulentes": [
        "2 larmes de brume funèbre",
        "1 goutte de sang de Citrouille",
      ],
      "bille d'âme évanescente": [
        "3 pincées de poudre de lune",
        "1 œil de grenouille",
      ],
      "soupçon de sels suffocants": [
        "2 crocs de troll",
        "1 fragment d'écaille de dragonnet",
        "1 radicelle de racine hurlante",
      ],
      "baton de pâte sépulcrale": [
        "3 radicelles de racine hurlante",
        "1 fiole de glaires purulentes",
      ],
      "bouffée d'essence de cauchemar": [
        "2 pincées de poudre de lune",
        "2 larmes de brume funèbre",
      ],
    };
    this.singularMap = {
      "yeux de grenouille": "œil de grenouille",
      "larmes de brume funèbre": "larme de brume funèbre",
      "radicelles de racine hurlante": "radicelle de racine hurlante",
      "pincées de poudre de lune": "pincée de poudre de lune",
      "crocs de troll": "croc de troll",
      "fragments d'écaille de dragonnet": "fragment d'écaille de dragonnet",
      "gouttes de sang de Citrouille": "goutte de sang de Citrouille",
      "fioles de glaires purulentes": "fiole de glaires purulentes",
      "billes d'âme évanescente": "bille d'âme évanescente",
      "soupçons de sels suffocants": "soupçon de sels suffocants",
      "batons de pâte sépulcrale": "baton de pâte sépulcrale",
      "bouffées d'essence de cauchemar": "bouffée d'essence de cauchemar",
    };
    this.stocks = new Map();
  }

  singularize(item: string): string {
    return this.singularMap[item] || item;
  }

  rentrer(str: string): void {
    const match = str.match(/^(\d+)\s+(.+)$/);
    if (!this.hasAMatch(match)) return;

    const qty = Number.parseInt(match![1]!, 10);
    const item = match![2]!;
    const sing = this.singularize(item);
    this.stocks.set(sing, (this.stocks.get(sing) || 0) + qty);
  }

  quantite(item: string): number {
    const sing = this.singularize(item);
    return this.stocks.get(sing) || 0;
  }

  preparer(str: string): number {
    const match = str.match(/^(\d+)\s+(.+)$/);
    if (!this.hasAMatch(match)) return 0;
    const requested = Number.parseInt(match![1]!, 10);
    const item = match![2]!;
    const sing = this.singularize(item);
    const recipe = this.recettes[sing];
    if (!recipe) return 0;
    let maxPossible = Infinity;
    const requirements = [];
    for (const reqStr of recipe) {
      const match = /^([0-9]{1,9})\s+([\s\S]+)$/.exec(reqStr);
      if (!this.hasAMatch(match)) continue;
      const reqQty = Number.parseInt(match![1]!, 10);
      const reqItem = match![2]!;
      const reqSing = this.singularize(reqItem);
      const available = this.stocks.get(reqSing) || 0;
      const canMake = Math.floor(available / reqQty);
      if (canMake < maxPossible) maxPossible = canMake;
      requirements.push({ reqSing, reqQty });
    }
    const actual = Math.min(requested, maxPossible);
    if (actual > 0) {
      for (const { reqSing, reqQty } of requirements) {
        if (!reqSing) continue;
        const current = this.stocks.get(reqSing) ?? 0;
        this.stocks.set(reqSing, current - actual * reqQty);
      }
      this.stocks.set(sing, (this.stocks.get(sing) || 0) + actual);
    }
    return actual;
  }

  private hasAMatch(match: RegExpMatchArray | null): boolean {
    return !!(match?.[1] && match?.[2]);
  }
}

export = Officine;
