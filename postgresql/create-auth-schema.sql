-- CreateTable
CREATE TABLE "roles" (
    "role" VARCHAR(50) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "user_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "hashed_rt" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_foreign" FOREIGN KEY ("role") REFERENCES "roles"("role") ON DELETE NO ACTION ON UPDATE NO ACTION;


-- Touch
-- input roles
INSERT INTO "public"."roles" ("role") VALUES ('admin'),('user'),('developer'),('manager'),('tester');