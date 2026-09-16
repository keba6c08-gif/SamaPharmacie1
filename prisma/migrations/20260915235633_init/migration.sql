-- CreateTable
CREATE TABLE "Medicament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix" REAL NOT NULL,
    "expiration" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
