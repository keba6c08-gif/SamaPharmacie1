"use client";

import { useEffect, useState } from "react";
type Medicament = {
  id: number;
  nom: string;
  quantite: number;
  prix: number;
  expiration: string;
};

export default function Home() {
  const [connecte, setConnecte] = useState(false);
  const [utilisateur, setUtilisateur] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
const [medicaments, setMedicaments] = useState<Medicament[]>([]);
 useEffect(() => {
  fetch("/api/medicament")
    .then((response) => response.json())
    .then((data) => setMedicaments(data))
    .catch((error) => console.error("Erreur de chargement :", error));
}, []);

  const [recherche, setRecherche] = useState("");
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [modification, setModification] = useState<number | null>(null);

  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const [prix, setPrix] = useState("");
  const [expiration, setExpiration] = useState("");

  function seConnecter(e: React.FormEvent) {
    e.preventDefault();

    if (utilisateur === "admin" && motDePasse === "admin123") {
      setConnecte(true);
      setErreur("");
    } else {
      setErreur("Identifiants incorrects.");
    }
  }

  function ouvrirAjout() {
    setModification(null);
    setNom("");
    setQuantite("");
    setPrix("");
    setExpiration("");
    setFormulaireOuvert(true);
  }

  function ouvrirModification(medicament: Medicament) {
    setModification(medicament.id);
    setNom(medicament.nom);
    setQuantite(String(medicament.quantite));
    setPrix(String(medicament.prix));
    setExpiration(medicament.expiration);
    setFormulaireOuvert(true);
  }

  function enregistrer(e: React.FormEvent) {
    e.preventDefault();

    if (!nom || !quantite || !prix || !expiration) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    if (modification !== null) {
      setMedicaments(
        medicaments.map((medicament) =>
          medicament.id === modification
            ? {
                ...medicament,
                nom,
                quantite: Number(quantite),
                prix: Number(prix),
                expiration,
              }
            : medicament
        )
      );
    } else {
      const nouveau: Medicament = {
        id: Date.now(),
        nom,
        quantite: Number(quantite),
        prix: Number(prix),
        expiration,
      };

      setMedicaments([...medicaments, nouveau]);
    }

    setFormulaireOuvert(false);
    setModification(null);
  }

  function supprimer(id: number) {
    if (confirm("Voulez-vous supprimer ce médicament ?")) {
      setMedicaments(
        medicaments.filter((medicament) => medicament.id !== id)
      );
    }
  }

  const medicamentsFiltres = medicaments.filter((medicament) =>
    medicament.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  const totalStock = medicaments.reduce(
    (total, medicament) => total + medicament.quantite,
    0
  );

  const alertesStock = medicaments.filter(
    (medicament) => medicament.quantite <= 5
  ).length;

  if (!connecte) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <form
          onSubmit={seConnecter}
          className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
        >
          <h1 className="mb-2 text-center text-3xl font-bold text-blue-600">
            💊 Medicaments App
          </h1>

          <p className="mb-6 text-center text-gray-600">
            Connexion à votre espace
          </p>

          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={utilisateur}
            onChange={(e) => setUtilisateur(e.target.value)}
            className="mb-4 w-full rounded-lg border p-3"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="mb-4 w-full rounded-lg border p-3"
          />

          {erreur && (
            <p className="mb-4 text-red-600">{erreur}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700"
          >
            Se connecter
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Démo : admin / admin123
          </p>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">

        <header className="mb-8 flex items-center justify-between rounded-xl bg-blue-600 p-6 text-white">
          <div>
            <h1 className="text-3xl font-bold">
              💊 Gestion des médicaments
            </h1>

            <p className="mt-2">
              Bienvenue dans votre application de gestion
            </p>
          </div>

          <button
            onClick={() => setConnecte(false)}
            className="rounded-lg bg-white px-4 py-2 text-blue-600"
          >
            Déconnexion
          </button>
        </header>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-gray-500">Total médicaments</h2>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {medicaments.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-gray-500">Stock disponible</h2>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {totalStock}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-gray-500">Alertes de stock</h2>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {alertesStock}
            </p>
          </div>

        </div>

        <section className="mt-8 rounded-xl bg-white p-6 shadow">

          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Liste des médicaments
            </h2>

            <button
              onClick={ouvrirAjout}
              className="rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
            >
              + Ajouter
            </button>
          </div>

          <input
            type="text"
            placeholder="🔍 Rechercher un médicament..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="mt-6 w-full rounded-lg border p-3"
          />

          {formulaireOuvert && (
            <form
              onSubmit={enregistrer}
              className="mt-6 rounded-lg bg-gray-100 p-6"
            >
              <h3 className="mb-4 text-xl font-bold">
                {modification !== null
                  ? "Modifier le médicament"
                  : "Ajouter un médicament"}
              </h3>

              <div className="grid gap-4 md:grid-cols-2">

                <input
                  type="text"
                  placeholder="Nom du médicament"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="rounded-lg border p-3"
                />

                <input
                  type="number"
                  placeholder="Quantité"
                  value={quantite}
                  onChange={(e) => setQuantite(e.target.value)}
                  className="rounded-lg border p-3"
                />

                <input
                  type="number"
                  placeholder="Prix en FCFA"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  className="rounded-lg border p-3"
                />

                <input
                  type="date"
                  value={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                  className="rounded-lg border p-3"
                />

              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-5 py-3 text-white"
                >
                  Enregistrer
                </button>

                <button
                  type="button"
                  onClick={() => setFormulaireOuvert(false)}
                  className="rounded-lg bg-gray-400 px-5 py-3 text-white"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-3">Nom</th>
                  <th className="p-3">Quantité</th>
                  <th className="p-3">Prix</th>
                  <th className="p-3">Expiration</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {medicamentsFiltres.map((medicament) => (
                  <tr key={medicament.id} className="border-b">
                    <td className="p-3 font-medium">
                      {medicament.nom}
                    </td>

                    <td className="p-3">
                      {medicament.quantite}
                    </td>

                    <td className="p-3">
                      {medicament.prix} FCFA
                    </td>

                    <td className="p-3">
                      {medicament.expiration}
                    </td>

                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => ouvrirModification(medicament)}
                          className="rounded bg-yellow-500 px-3 py-2 text-white"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() => supprimer(medicament.id)}
                          className="rounded bg-red-600 px-3 py-2 text-white"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {medicamentsFiltres.length === 0 && (
              <p className="mt-6 text-center text-gray-600">
                Aucun médicament trouvé.
              </p>
            )}
          </div>

        </section>
      </div>
    </main>
  );
}