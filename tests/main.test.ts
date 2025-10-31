import Officine = require("../main");

test("rentrer_cas_usuel_ingredient_connu_pluriel", () => {
  const officine = new Officine();
  officine.rentrer("3 yeux de grenouille");
  expect(officine.quantite("œil de grenouille")).toBe(3);
  expect(officine.quantite("yeux de grenouille")).toBe(3);
});

test("rentrer_cas_usuel_ingredient_connu_singulier", () => {
  const officine = new Officine();
  officine.rentrer("3 œil de grenouille");
  expect(officine.quantite("œil de grenouille")).toBe(3);
  expect(officine.quantite("yeux de grenouille")).toBe(3);
});

test("rentrer_cas_extreme_quantite_grande", () => {
  const officine = new Officine();
  officine.rentrer("999999999 larmes de brume funèbre");
  expect(officine.quantite("larmes de brume funèbre")).toBe(999999999);
  expect(officine.quantite("larme de brume funèbre")).toBe(999999999);
});

test("rentrer_cas_extreme_quantite_zero", () => {
  const officine = new Officine();
  officine.rentrer("0 crocs de troll");
  expect(officine.quantite("croc de troll")).toBe(0);
});

test("rentrer_cas_erreur_chaine_invalide", () => {
  const officine = new Officine();
  officine.rentrer("trois yeux de grenouille");
  expect(officine.quantite("œil de grenouille")).toBe(0);
});

test("rentrer_cas_erreur_quantite_negative", () => {
  const officine = new Officine();
  officine.rentrer("-2 pincées de poudre de lune");
  expect(officine.quantite("pincée de poudre de lune")).toBe(0);
});

test("rentrer_cas_erreur_ingredient_inconnu", () => {
  const officine = new Officine();
  officine.rentrer("3 poils de licorne");
  expect(officine.quantite("poil de licorne")).toBe(0);
});

test("quantite_cas_usuel_singulier_en_stock", () => {
  const officine = new Officine();
  officine.rentrer("4 crocs de troll");
  expect(officine.quantite("croc de troll")).toBe(4);
});

test("quantite_cas_usuel_pluriel_en_stock", () => {
  const officine = new Officine();
  officine.rentrer("2 fragments d'écaille de dragonnet");
  expect(officine.quantite("fragments d'écaille de dragonnet")).toBe(2);
});

test("quantite_cas_usuel_non_en_stock", () => {
  const officine = new Officine();
  expect(officine.quantite("radicelle de racine hurlante")).toBe(0);
});

test("quantite_cas_extreme_apres_operations_multiples", () => {
  const officine = new Officine();
  officine.rentrer("2 crocs de troll");
  officine.rentrer("3 crocs de troll");
  officine.rentrer("5 crocs de troll");
  expect(officine.quantite("croc de troll")).toBe(10);
});

test("quantite_cas_erreur_ingredient_inconnu", () => {
  const officine = new Officine();
  expect(officine.quantite("bave de lutin")).toBe(0);
});

test("preparer_cas_usuel_stocks_suffisants", () => {
  const officine = new Officine();
  officine.rentrer("5 larmes de brume funèbre");
  officine.rentrer("3 gouttes de sang de Citrouille");
  const nb = officine.preparer("2 fioles de glaires purulentes");
  expect(nb).toBe(2);
  expect(officine.quantite("fiole de glaires purulentes")).toBe(2);
  expect(officine.quantite("larme de brume funèbre")).toBe(1);
  expect(officine.quantite("goutte de sang de Citrouille")).toBe(1);
});

test("preparer_cas_usuel_stocks_insuffisants", () => {
  const officine = new Officine();
  officine.rentrer("1 larme de brume funèbre");
  officine.rentrer("3 gouttes de sang de Citrouille");
  const nb = officine.preparer("3 fioles de glaires purulentes");
  expect(nb).toBe(0);
  expect(officine.quantite("fiole de glaires purulentes")).toBe(0);
});

test("preparer_cas_usuel_potion_utilisant_potion", () => {
  const officine = new Officine();
  officine.rentrer("6 radicelles de racine hurlante");
  officine.rentrer("2 larmes de brume funèbre");
  officine.rentrer("1 goutte de sang de Citrouille");

  officine.preparer("1 fiole de glaires purulentes");
  officine.preparer("1 baton de pâte sépulcrale");

  expect(officine.quantite("baton de pâte sépulcrale")).toBe(1);
  expect(officine.quantite("radicelle de racine hurlante")).toBe(3);
  expect(officine.quantite("fiole de glaires purulentes")).toBe(0);
});

test("preparer_cas_extreme_quantite_grande", () => {
  const officine = new Officine();
  officine.rentrer("1000 larmes de brume funèbre");
  officine.rentrer("500 gouttes de sang de Citrouille");
  const nb = officine.preparer("300 fioles de glaires purulentes");
  expect(nb).toBe(300);
  expect(officine.quantite("fiole de glaires purulentes")).toBe(300);
});

test("preparer_cas_extreme_quantite_zero", () => {
  const officine = new Officine();
  const nb = officine.preparer("0 fioles de glaires purulentes");
  expect(nb).toBe(0);
});

test("preparer_cas_erreur_potion_inconnue", () => {
  const officine = new Officine();
  officine.rentrer("10 radicelles de racine hurlante");
  const nb = officine.preparer("1 potion de lévitation");
  expect(nb).toBe(0);
});

test("preparer_cas_erreur_chaine_invalide", () => {
  const officine = new Officine();
  officine.rentrer("10 larmes de brume funèbre");
  const nb = officine.preparer("une fiole de glaires purulentes");
  expect(nb).toBe(0);
});
