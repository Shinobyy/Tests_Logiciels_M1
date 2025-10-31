class Officine {
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

  singularize(item) {
    return this.singularMap[item] || item;
  }

  rentrer(str) {
    const match = str.match(/^(\d+)\s+(.+)$/);
    if (!match) return;
    const qty = Number.parseInt(match[1], 10);
    const item = match[2];
    const sing = this.singularize(item);
    this.stocks.set(sing, (this.stocks.get(sing) || 0) + qty);
  }

  quantite(item) {
    const sing = this.singularize(item);
    return this.stocks.get(sing) || 0;
  }

  preparer(str) {
    const match = str.match(/^(\d+)\s+(.+)$/);
    if (!match) return 0;
    const requested = Number.parseInt(match[1], 10);
    const item = match[2];
    const sing = this.singularize(item);
    const recipe = this.recettes[sing];
    if (!recipe) return 0;
    let maxPossible = Infinity;
    const requirements = [];
    for (const reqStr of recipe) {
      const m = reqStr.match(/^(\d+)\s+(.+)$/);
      if (!m) continue;
      const reqQty = Number.parseInt(m[1], 10);
      const reqItem = m[2];
      const reqSing = this.singularize(reqItem);
      const available = this.stocks.get(reqSing) || 0;
      const canMake = Math.floor(available / reqQty);
      if (canMake < maxPossible) maxPossible = canMake;
      requirements.push({ reqSing, reqQty });
    }
    const actual = Math.min(requested, maxPossible);
    if (actual > 0) {
      for (const { reqSing, reqQty } of requirements) {
        this.stocks.set(reqSing, this.stocks.get(reqSing) - actual * reqQty);
      }
      this.stocks.set(sing, (this.stocks.get(sing) || 0) + actual);
    }
    return actual;
  }
}

module.exports = Officine;
