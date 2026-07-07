-- CreateTable
CREATE TABLE "Integrante" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    CONSTRAINT "Integrante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aporte" (
    "id" SERIAL NOT NULL,
    "integranteId" INTEGER NOT NULL,
    "banco" TEXT NOT NULL,
    "referencia" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "mes" TEXT NOT NULL,
    "aporte" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Aporte_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Integrante_numero_key" ON "Integrante"("numero");

-- AddForeignKey
ALTER TABLE "Aporte" ADD CONSTRAINT "Aporte_integranteId_fkey" FOREIGN KEY ("integranteId") REFERENCES "Integrante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
