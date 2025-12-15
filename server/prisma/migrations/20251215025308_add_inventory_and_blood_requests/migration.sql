-- CreateTable
CREATE TABLE "Inventory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "blood_group" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "expiry_date" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BloodRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hospital_id" INTEGER NOT NULL,
    "patient_name" TEXT NOT NULL,
    "blood_group" TEXT NOT NULL,
    "units_needed" INTEGER NOT NULL,
    "urgency" TEXT NOT NULL DEFAULT 'NORMAL',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BloodRequest_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_blood_group_key" ON "Inventory"("blood_group");
