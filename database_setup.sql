    DROP TABLE IF EXISTS "organizations", "users", "oauth_accounts", "questions", "question_starters", "test_cases", "interviews", "interview_participants", "interview_questions", "code_sessions", "code_snapshots", "executions", "execution_test_results", "chat_messages", "interview_feedback", "session_events" CASCADE;

    DROP TYPE IF EXISTS "UserRole" CASCADE;
    DROP TYPE IF EXISTS "Difficulty" CASCADE;
    DROP TYPE IF EXISTS "QuestionType" CASCADE;
    DROP TYPE IF EXISTS "InterviewStatus" CASCADE;
    DROP TYPE IF EXISTS "ExecutionStatus" CASCADE;

    -- CreateEnum
    CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'RECRUITER', 'INTERVIEWER', 'CANDIDATE');

    -- CreateEnum
    CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

    -- CreateEnum
    CREATE TYPE "QuestionType" AS ENUM ('CODING', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'SQL');

    -- CreateEnum
    CREATE TYPE "InterviewStatus" AS ENUM ('SCHEDULED', 'WAITING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

    -- CreateEnum
    CREATE TYPE "ExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR', 'SYSTEM_ERROR');

    -- CreateTable
    CREATE TABLE "organizations" (
        "id" UUID NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "slug" VARCHAR(100) NOT NULL,
        "logo_url" TEXT,
        "plan" VARCHAR(50) NOT NULL DEFAULT 'free',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "users" (
        "id" UUID NOT NULL,
        "org_id" UUID,
        "email" VARCHAR(255) NOT NULL,
        "name" VARCHAR(255),
        "avatar_url" TEXT,
        "role" "UserRole" NOT NULL DEFAULT 'INTERVIEWER',
        "password_hash" TEXT,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "last_login_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "oauth_accounts" (
        "id" UUID NOT NULL,
        "user_id" UUID NOT NULL,
        "provider" VARCHAR(50) NOT NULL,
        "provider_id" VARCHAR(255) NOT NULL,
        "access_token" TEXT,
        "refresh_token" TEXT,
        "expires_at" TIMESTAMPTZ,

        CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "questions" (
        "id" UUID NOT NULL,
        "org_id" UUID,
        "created_by" UUID,
        "title" VARCHAR(500) NOT NULL,
        "slug" VARCHAR(255) NOT NULL,
        "description" TEXT NOT NULL,
        "difficulty" "Difficulty" NOT NULL,
        "type" "QuestionType" NOT NULL DEFAULT 'CODING',
        "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "time_limit_ms" INTEGER NOT NULL DEFAULT 5000,
        "memory_limit_mb" INTEGER NOT NULL DEFAULT 256,
        "is_public" BOOLEAN NOT NULL DEFAULT false,
        "is_archived" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "question_starters" (
        "id" UUID NOT NULL,
        "question_id" UUID NOT NULL,
        "language" VARCHAR(50) NOT NULL,
        "starter_code" TEXT NOT NULL,
        "solution_code" TEXT,

        CONSTRAINT "question_starters_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "test_cases" (
        "id" UUID NOT NULL,
        "question_id" UUID NOT NULL,
        "input" TEXT NOT NULL,
        "expected_output" TEXT NOT NULL,
        "is_hidden" BOOLEAN NOT NULL DEFAULT false,
        "explanation" TEXT,
        "order_index" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "test_cases_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "interviews" (
        "id" UUID NOT NULL,
        "org_id" UUID,
        "title" VARCHAR(255),
        "status" "InterviewStatus" NOT NULL DEFAULT 'SCHEDULED',
        "scheduled_at" TIMESTAMPTZ,
        "started_at" TIMESTAMPTZ,
        "ended_at" TIMESTAMPTZ,
        "duration_minutes" INTEGER NOT NULL DEFAULT 60,
        "room_id" VARCHAR(100) NOT NULL,
        "invite_token" VARCHAR(255),
        "notes" TEXT,
        "recording_url" TEXT,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "interview_participants" (
        "id" UUID NOT NULL,
        "interview_id" UUID NOT NULL,
        "user_id" UUID,
        "role" VARCHAR(50) NOT NULL,
        "joined_at" TIMESTAMPTZ,
        "left_at" TIMESTAMPTZ,
        "guest_name" VARCHAR(255),
        "guest_email" VARCHAR(255),

        CONSTRAINT "interview_participants_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "interview_questions" (
        "id" UUID NOT NULL,
        "interview_id" UUID NOT NULL,
        "question_id" UUID NOT NULL,
        "order_index" INTEGER NOT NULL DEFAULT 0,
        "assigned_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "started_at" TIMESTAMPTZ,
        "completed_at" TIMESTAMPTZ,

        CONSTRAINT "interview_questions_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "code_sessions" (
        "id" UUID NOT NULL,
        "interview_id" UUID NOT NULL,
        "question_id" UUID,
        "language" VARCHAR(50) NOT NULL DEFAULT 'python',
        "current_code" TEXT NOT NULL DEFAULT '',
        "yjs_state" BYTEA,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "code_sessions_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "code_snapshots" (
        "id" UUID NOT NULL,
        "session_id" UUID NOT NULL,
        "code" TEXT NOT NULL,
        "language" VARCHAR(50),
        "created_by" UUID,
        "snapshot_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "code_snapshots_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "executions" (
        "id" UUID NOT NULL,
        "session_id" UUID NOT NULL,
        "submitted_by" UUID,
        "code" TEXT NOT NULL,
        "language" VARCHAR(50) NOT NULL,
        "status" "ExecutionStatus" NOT NULL DEFAULT 'PENDING',
        "stdout" TEXT,
        "stderr" TEXT,
        "compile_output" TEXT,
        "exit_code" INTEGER,
        "time_ms" INTEGER,
        "memory_kb" INTEGER,
        "is_run" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "completed_at" TIMESTAMPTZ,

        CONSTRAINT "executions_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "execution_test_results" (
        "id" UUID NOT NULL,
        "execution_id" UUID NOT NULL,
        "test_case_id" UUID,
        "status" "ExecutionStatus" NOT NULL,
        "actual_output" TEXT,
        "time_ms" INTEGER,
        "memory_kb" INTEGER,

        CONSTRAINT "execution_test_results_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "chat_messages" (
        "id" UUID NOT NULL,
        "interview_id" UUID NOT NULL,
        "sender_id" UUID,
        "sender_name" VARCHAR(255),
        "content" TEXT NOT NULL,
        "message_type" VARCHAR(50) NOT NULL DEFAULT 'text',
        "sent_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "interview_feedback" (
        "id" UUID NOT NULL,
        "interview_id" UUID NOT NULL,
        "reviewer_id" UUID,
        "candidate_id" UUID,
        "overall_score" DECIMAL(3,1),
        "problem_solving" INTEGER,
        "code_quality" INTEGER,
        "communication" INTEGER,
        "technical_knowledge" INTEGER,
        "hire_decision" VARCHAR(50),
        "strengths" TEXT,
        "improvements" TEXT,
        "private_notes" TEXT,
        "submitted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "interview_feedback_pkey" PRIMARY KEY ("id")
    );

    -- CreateTable
    CREATE TABLE "session_events" (
        "id" BIGSERIAL NOT NULL,
        "interview_id" UUID NOT NULL,
        "event_type" VARCHAR(100) NOT NULL,
        "payload" JSONB NOT NULL,
        "actor_id" UUID,
        "occurred_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "session_events_pkey" PRIMARY KEY ("id")
    );

    -- CreateIndex
    CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

    -- CreateIndex
    CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

    -- CreateIndex
    CREATE INDEX "users_org_id_role_idx" ON "users"("org_id", "role");

    -- CreateIndex
    CREATE UNIQUE INDEX "oauth_accounts_provider_provider_id_key" ON "oauth_accounts"("provider", "provider_id");

    -- CreateIndex
    CREATE UNIQUE INDEX "questions_slug_key" ON "questions"("slug");

    -- CreateIndex
    CREATE UNIQUE INDEX "question_starters_question_id_language_key" ON "question_starters"("question_id", "language");

    -- CreateIndex
    CREATE INDEX "test_cases_question_id_idx" ON "test_cases"("question_id");

    -- CreateIndex
    CREATE UNIQUE INDEX "interviews_room_id_key" ON "interviews"("room_id");

    -- CreateIndex
    CREATE UNIQUE INDEX "interviews_invite_token_key" ON "interviews"("invite_token");

    -- CreateIndex
    CREATE INDEX "interviews_room_id_idx" ON "interviews"("room_id");

    -- CreateIndex
    CREATE INDEX "interviews_org_id_status_idx" ON "interviews"("org_id", "status");

    -- CreateIndex
    CREATE UNIQUE INDEX "code_sessions_interview_id_question_id_key" ON "code_sessions"("interview_id", "question_id");

    -- CreateIndex
    CREATE INDEX "executions_session_id_idx" ON "executions"("session_id");

    -- CreateIndex
    CREATE INDEX "session_events_interview_id_occurred_at_idx" ON "session_events"("interview_id", "occurred_at");

    -- AddForeignKey
    ALTER TABLE "users" ADD CONSTRAINT "users_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "questions" ADD CONSTRAINT "questions_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "questions" ADD CONSTRAINT "questions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "question_starters" ADD CONSTRAINT "question_starters_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "interviews" ADD CONSTRAINT "interviews_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "interview_participants" ADD CONSTRAINT "interview_participants_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "interview_participants" ADD CONSTRAINT "interview_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "code_sessions" ADD CONSTRAINT "code_sessions_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "code_sessions" ADD CONSTRAINT "code_sessions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "code_snapshots" ADD CONSTRAINT "code_snapshots_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "code_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "code_snapshots" ADD CONSTRAINT "code_snapshots_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "executions" ADD CONSTRAINT "executions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "code_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "executions" ADD CONSTRAINT "executions_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "execution_test_results" ADD CONSTRAINT "execution_test_results_execution_id_fkey" FOREIGN KEY ("execution_id") REFERENCES "executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "execution_test_results" ADD CONSTRAINT "execution_test_results_test_case_id_fkey" FOREIGN KEY ("test_case_id") REFERENCES "test_cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "interview_feedback" ADD CONSTRAINT "interview_feedback_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "interview_feedback" ADD CONSTRAINT "interview_feedback_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "interview_feedback" ADD CONSTRAINT "interview_feedback_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "session_events" ADD CONSTRAINT "session_events_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- AddForeignKey
    ALTER TABLE "session_events" ADD CONSTRAINT "session_events_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

