-- CreateTable
CREATE TABLE "Aporte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" INTEGER NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "banco" TEXT NOT NULL,
    "referencia" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "mes" TEXT NOT NULL,
    "aporte" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Aporte_numero_key" ON "Aporte"("numero");
