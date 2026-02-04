-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "policy_number" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "policy_type" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "premium_usd" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,
    "insured_value_usd" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endpoint" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "correlation_id" TEXT NOT NULL,
    "rows_inserted" INTEGER NOT NULL DEFAULT 0,
    "rows_rejected" INTEGER NOT NULL DEFAULT 0,
    "duration_ms" INTEGER NOT NULL DEFAULT 0,
    "error_summary" TEXT,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Policy_policy_number_key" ON "Policy"("policy_number");

-- CreateIndex
CREATE INDEX "Policy_status_idx" ON "Policy"("status");

-- CreateIndex
CREATE INDEX "Policy_policy_type_idx" ON "Policy"("policy_type");

-- CreateIndex
CREATE INDEX "Policy_customer_idx" ON "Policy"("customer");
