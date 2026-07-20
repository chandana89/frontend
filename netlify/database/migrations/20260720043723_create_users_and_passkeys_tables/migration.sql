CREATE TABLE "passkeys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"credential_id" bytea NOT NULL,
	"public_key" bytea NOT NULL,
	"counter" integer,
	"transports" text[],
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL UNIQUE,
	"password" text NOT NULL,
	"token" text,
	"current_challenge" text
);
--> statement-breakpoint
CREATE FUNCTION normalize_user_email() RETURNS trigger AS $$
BEGIN
	NEW.email = lower(trim(NEW.email));
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER normalize_user_email_before_insert
	BEFORE INSERT ON "users"
	FOR EACH ROW
	EXECUTE FUNCTION normalize_user_email();
--> statement-breakpoint
ALTER TABLE "passkeys" ADD CONSTRAINT "passkeys_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
