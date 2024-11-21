-- CreateTable
CREATE TABLE "Donor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "cpf" TEXT,
    "dateRegistration" DATETIME
);

-- CreateTable
CREATE TABLE "Donatary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "cpf" TEXT,
    "dateRegistration" DATETIME
);

-- CreateTable
CREATE TABLE "Family" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "numberMembers" INTEGER,
    "dateRegistration" DATETIME,
    "bairro" TEXT
);

-- CreateTable
CREATE TABLE "DonationDelivered" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "donataryId" INTEGER NOT NULL,
    CONSTRAINT "DonationDelivered_donataryId_fkey" FOREIGN KEY ("donataryId") REFERENCES "Donatary" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DonationReceived" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "donorId" INTEGER NOT NULL,
    CONSTRAINT "DonationReceived_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
