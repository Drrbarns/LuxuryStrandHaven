#!/usr/bin/env python3
"""Prepare Supabase schema SQL for plain Postgres staging restore (Luxury Strand Haven)."""
from pathlib import Path
import re

src = Path(__file__).resolve().parent.parent / "supabase" / "schema.sql"
out = Path(__file__).resolve().parent / "dumps" / "schema_plain.sql"

text = src.read_text()

func_blocks = []


def extract_functions(s: str):
    pattern = re.compile(
        r"CREATE\s+OR\s+REPLACE\s+FUNCTION[\s\S]*?\$\$;",
        re.IGNORECASE,
    )
    blocks = pattern.findall(s)
    cleaned = pattern.sub("\n-- (function moved to end)\n", s)
    return cleaned, blocks


header = """
-- Plain Postgres adapted schema (Luxury Strand Haven staging)
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA public;
"""

text = re.sub(
    r'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"[^;]*;',
    "-- uuid-ossp skipped (use gen_random_uuid)",
    text,
    flags=re.IGNORECASE,
)

body, funcs = extract_functions(text)
body = body.replace("extensions.uuid_generate_v4()", "gen_random_uuid()")
body = body.replace("uuid_generate_v4()", "gen_random_uuid()")

final = header + "\n" + body + "\n-- ===== FUNCTIONS (after tables) =====\n" + "\n\n".join(funcs) + "\n"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(final)
print(f"Wrote {out} ({len(final)} bytes, {len(funcs)} functions)")
