import Officine from "../main";

describe("Officine", () => {
  describe("constructor", () => {
    test("devrait initialiser les ingrédients correctement", () => {
      const officine = new Officine();

      expect(officine.ingredients).toHaveLength(7);
      expect(officine.ingredients).toContain("œil/yeux de grenouille");
    });

    test("devrait initialiser les recettes correctement", () => {
      const officine = new Officine();

      expect(Object.keys(officine.recettes)).toHaveLength(5);
      expect(officine.recettes["fiole de glaires purulentes"]).toBeDefined();
    });

    test("devrait initialiser les stocks vides", () => {
      const officine = new Officine();

      expect(officine.stocks.size).toBe(0);
    });
  });

  describe("singularize", () => {
    test("devrait convertir un pluriel en singulier - cas nominal", () => {
      const officine = new Officine();

      const result = officine.singularize("yeux de grenouille");

      expect(result).toBe("œil de grenouille");
    });

    test("devrait retourner l'item tel quel si pas dans la map", () => {
      const officine = new Officine();

      const result = officine.singularize("item inconnu");

      expect(result).toBe("item inconnu");
    });

    test("devrait gérer tous les pluriels définis", () => {
      const officine = new Officine();

      expect(officine.singularize("larmes de brume funèbre")).toBe(
        "larme de brume funèbre",
      );
      expect(officine.singularize("crocs de troll")).toBe("croc de troll");
      expect(officine.singularize("fioles de glaires purulentes")).toBe(
        "fiole de glaires purulentes",
      );
    });
  });

  describe("rentrer", () => {
    test("devrait ajouter des ingrédients au stock - cas nominal", () => {
      const officine = new Officine();

      officine.rentrer("5 yeux de grenouille");

      expect(officine.stocks.get("œil de grenouille")).toBe(5);
    });

    test("devrait cumuler les quantités pour le même ingrédient", () => {
      const officine = new Officine();

      officine.rentrer("5 yeux de grenouille");
      officine.rentrer("3 yeux de grenouille");

      expect(officine.stocks.get("œil de grenouille")).toBe(8);
    });

    test("devrait gérer plusieurs ingrédients différents", () => {
      const officine = new Officine();

      officine.rentrer("5 yeux de grenouille");
      officine.rentrer("10 larmes de brume funèbre");

      expect(officine.stocks.get("œil de grenouille")).toBe(5);
      expect(officine.stocks.get("larme de brume funèbre")).toBe(10);
    });

    test("devrait gérer une quantité de 0", () => {
      const officine = new Officine();

      officine.rentrer("0 yeux de grenouille");

      expect(officine.stocks.get("œil de grenouille")).toBe(0);
    });

    test("devrait gérer de très grandes quantités", () => {
      const officine = new Officine();

      officine.rentrer("999999 crocs de troll");

      expect(officine.stocks.get("croc de troll")).toBe(999999);
    });

    test("ne devrait rien faire avec un format invalide (sans nombre)", () => {
      const officine = new Officine();

      officine.rentrer("yeux de grenouille");

      expect(officine.stocks.size).toBe(0);
    });

    test("ne devrait rien faire avec un format invalide (sans nom d'item)", () => {
      const officine = new Officine();

      officine.rentrer("5");

      expect(officine.stocks.size).toBe(0);
    });

    test("ne devrait rien faire avec une chaîne vide", () => {
      const officine = new Officine();

      officine.rentrer("");

      expect(officine.stocks.size).toBe(0);
    });
  });

  describe("quantite", () => {
    test("devrait retourner la quantité d'un ingrédient en stock - cas nominal", () => {
      const officine = new Officine();
      officine.rentrer("5 yeux de grenouille");

      const qty = officine.quantite("œil de grenouille");

      expect(qty).toBe(5);
    });

    test("devrait retourner 0 pour un ingrédient non stocké", () => {
      const officine = new Officine();

      const qty = officine.quantite("œil de grenouille");

      expect(qty).toBe(0);
    });

    test("devrait gérer les formes plurielles", () => {
      const officine = new Officine();
      officine.rentrer("10 larmes de brume funèbre");

      const qty = officine.quantite("larmes de brume funèbre");

      expect(qty).toBe(10);
    });

    test("devrait retourner 0 pour un item inconnu", () => {
      const officine = new Officine();

      const qty = officine.quantite("ingrédient inexistant");

      expect(qty).toBe(0);
    });
  });

  describe("preparer", () => {
    test("devrait préparer une fiole de glaires purulentes - cas nominal", () => {
      const officine = new Officine();
      officine.rentrer("10 larmes de brume funèbre");
      officine.rentrer("5 gouttes de sang de Citrouille");

      const prepared = officine.preparer("3 fioles de glaires purulentes");

      expect(prepared).toBe(3);
      expect(officine.stocks.get("larme de brume funèbre")).toBe(4);
      expect(officine.stocks.get("goutte de sang de Citrouille")).toBe(2);
      expect(officine.stocks.get("fiole de glaires purulentes")).toBe(3);
    });

    test("devrait préparer une bille d'âme évanescente", () => {
      const officine = new Officine();
      officine.rentrer("10 pincées de poudre de lune");
      officine.rentrer("5 yeux de grenouille");

      const prepared = officine.preparer("2 billes d'âme évanescente");

      expect(prepared).toBe(2);
      expect(officine.stocks.get("pincée de poudre de lune")).toBe(4);
      expect(officine.stocks.get("œil de grenouille")).toBe(3);
      expect(officine.stocks.get("bille d'âme évanescente")).toBe(2);
    });

    test("devrait limiter la préparation selon les stocks disponibles", () => {
      const officine = new Officine();
      officine.rentrer("5 larmes de brume funèbre");
      officine.rentrer("10 gouttes de sang de Citrouille");

      const prepared = officine.preparer("5 fioles de glaires purulentes");

      expect(prepared).toBe(2); // Limité par les larmes (5/2 = 2)
      expect(officine.stocks.get("larme de brume funèbre")).toBe(1);
      expect(officine.stocks.get("goutte de sang de Citrouille")).toBe(8);
    });

    test("devrait retourner 0 si stocks insuffisants", () => {
      const officine = new Officine();
      officine.rentrer("1 larme de brume funèbre");

      const prepared = officine.preparer("1 fiole de glaires purulentes");

      expect(prepared).toBe(0);
      expect(officine.stocks.get("larme de brume funèbre")).toBe(1);
    });

    test("devrait retourner 0 pour une recette inexistante", () => {
      const officine = new Officine();
      officine.rentrer("10 yeux de grenouille");

      const prepared = officine.preparer("5 potion inconnue");

      expect(prepared).toBe(0);
    });

    test("devrait gérer une recette complexe - soupçon de sels suffocants", () => {
      const officine = new Officine();
      officine.rentrer("10 crocs de troll");
      officine.rentrer("5 fragments d'écaille de dragonnet");
      officine.rentrer("5 radicelles de racine hurlante");

      const prepared = officine.preparer("3 soupçons de sels suffocants");

      expect(prepared).toBe(3);
      expect(officine.stocks.get("croc de troll")).toBe(4);
      expect(officine.stocks.get("fragment d'écaille de dragonnet")).toBe(2);
      expect(officine.stocks.get("radicelle de racine hurlante")).toBe(2);
    });

    test("devrait gérer une recette composite - baton de pâte sépulcrale", () => {
      const officine = new Officine();
      officine.rentrer("10 radicelles de racine hurlante");
      officine.rentrer("10 larmes de brume funèbre");
      officine.rentrer("5 gouttes de sang de Citrouille");
      officine.preparer("3 fioles de glaires purulentes");

      const prepared = officine.preparer("2 batons de pâte sépulcrale");

      expect(prepared).toBe(2);
      expect(officine.stocks.get("radicelle de racine hurlante")).toBe(4);
      expect(officine.stocks.get("fiole de glaires purulentes")).toBe(1);
      expect(officine.stocks.get("baton de pâte sépulcrale")).toBe(2);
    });

    test("devrait retourner 0 avec un format invalide", () => {
      const officine = new Officine();
      officine.rentrer("10 yeux de grenouille");

      const prepared = officine.preparer("fioles de glaires purulentes");

      expect(prepared).toBe(0);
    });

    test("devrait gérer une demande de 0 préparation", () => {
      const officine = new Officine();
      officine.rentrer("10 larmes de brume funèbre");
      officine.rentrer("5 gouttes de sang de Citrouille");

      const prepared = officine.preparer("0 fioles de glaires purulentes");

      expect(prepared).toBe(0);
      expect(officine.stocks.get("larme de brume funèbre")).toBe(10);
    });

    test("devrait cumuler les préparations successives", () => {
      const officine = new Officine();
      officine.rentrer("20 larmes de brume funèbre");
      officine.rentrer("10 gouttes de sang de Citrouille");

      const prepared1 = officine.preparer("2 fioles de glaires purulentes");
      const prepared2 = officine.preparer("3 fioles de glaires purulentes");

      expect(prepared1).toBe(2);
      expect(prepared2).toBe(3);
      expect(officine.stocks.get("fiole de glaires purulentes")).toBe(5);
    });
  });
});
