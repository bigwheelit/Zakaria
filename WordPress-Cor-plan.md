I maintain a reusable “WordPress Core” baseline package used to bootstrap new client sites (“bigwheelit core”). It is currently offline (not hosted). I suspect it has been used on compromised sites. I want to audit and harden it into a clean baseline.

PRIMARY GOALS

Audit core + BigWheel-specific code for backdoors/malware and insecure patterns.

Produce a clean, hardened, reusable baseline suitable for future deployments.

Perform work STEP-BY-STEP, ONE FILE AT A TIME (I upload one file; you review and return a fully corrected/replaced file; then you STOP).

NON-NEGOTIABLE WORKFLOW (STRICT)

You MUST work one file at a time.

You MUST NOT move to the next file until I explicitly say: “DONE, NEXT”.

You MUST begin by outputting:

the upload order (priority list of file paths)

the first file I must upload
Then STOP and wait for my upload.

When you return a fix, you MUST provide the FULL corrected file content (complete file), not partial diffs.

If you detect suspicious code, you MUST explain:

why it’s suspicious

what it does

how your fix removes/mitigates it

Avoid guesswork. If uncertain, label it exactly: NEEDS CONFIRMATION, and provide safe options.

SCOPE (WHAT MAY BE INCLUDED)

WordPress baseline files (core)

mu-plugins (must-use)

wp-config.php template or related bootstrap files

custom plugins

themes (parent/child)

install scripts / automation helpers

licensing / remote-calling code (any telemetry, update checks, activation checks, etc.)

SECURITY OBJECTIVES (CHECK EVERY FILE FOR)

Backdoors / webshell patterns

eval(), base64_decode(), gzinflate(), str_rot13(), preg_replace with /e

create_function(), assert() used dynamically

variable functions like $f($_POST['x'])

suspicious includes to /tmp, uploads, remote URLs

hidden admin creation, wp_options injections, cron persistence

obfuscation: long encoded strings, hex/char maps, string concatenation to form function names

Unsafe remote calls / supply-chain risks

wp_remote_get/post to unknown domains

curl/file_get_contents to remote URLs

auto-update from custom servers without signature/integrity checks

Privilege / auth weaknesses

bypassing capability checks

missing nonces

unsafe AJAX handlers

REST endpoints missing permission_callback

weak login/session code

Input validation & file handling

unsanitized $_GET/$_POST/$_REQUEST usage

file upload handling, path traversal

SQL injection, XSS, CSRF

Hardening best practices for a reusable baseline

disable file editor, restrict XML-RPC if not needed

secure headers, salts handling, wp-config separation

mu-plugin structure, logging, integrity checks

sane defaults for permissions and wp-content layout

REQUIRED OUTPUT FOR EACH FILE (ALWAYS THIS STRUCTURE)
A) Verdict: CLEAN / SUSPICIOUS / MALICIOUS / NEEDS CONFIRMATION
B) Findings: bullet list with approximate line references (e.g., “~L40–L68”)
C) Fix: Provide the FULL cleaned file content (complete file)
D) Notes: compatibility concerns, safe defaults, and immediate next steps

DELIVERABLE AT THE VERY END (AFTER ALL FILES)

Final checklist of hardened defaults for new deployments

Short “How to verify the core is clean” procedure

Recommendations to prevent reinfection on client sites (plugin hygiene, WAF, backups, least privilege, credential hygiene)

IMPORTANT CONSTRAINTS

Do NOT ask me to upload the entire zip at once. I will upload one file at a time.

Do NOT provide instructions for attacking/hacking; only defensive remediation.

Keep steps minimal and practical.

START INSTRUCTIONS (DO NOT AUDIT YET)

Output the audit upload order (top-priority file paths first), and keep it explicit.

Tell me the FIRST file to upload.

Then STOP and wait for my upload.

REQUIRED UPLOAD ORDER (PRIORITY LIST YOU MUST USE)

Use this exact priority sequence unless a file is missing. If missing, say “MISSING” and move to the next.

P0 — Highest-risk entry points / bootstraps

/wp-config.php (or wp-config-sample.php / templates)

/wp-load.php

/wp-settings.php

/index.php

/.htaccess (if present)

/wp-cron.php

/xmlrpc.php

/wp-login.php

/wp-admin/admin-ajax.php

/wp-content/advanced-cache.php (if present)

/wp-content/db.php (if present)

/wp-content/object-cache.php (if present)

P1 — Must-use plugins (common persistence layer)
13) /wp-content/mu-plugins/* (start with any “loader” file, e.g., mu-plugins.php, autoloader, security bootstrap)

P2 — Drop-ins, bootstrappers, and unusual include points
14) /wp-content/sunrise.php (if present)
15) /wp-content/wp-cache-config.php (if present)
16) /wp-content/plugins/* any plugin that runs on init or has remote calls (license/updater/security/optimizer)

Start with: custom/updater/license plugins, then security, then others.

P3 — Themes (most common place for hidden backdoors)
17) /wp-content/themes/<active-theme>/functions.php
18) /wp-content/themes/<active-theme>/header.php
19) /wp-content/themes/<active-theme>/footer.php
20) /wp-content/themes/<active-theme>/inc/* or includes/* (enqueue, setup, helpers)
21) /wp-content/themes/<child-theme>/functions.php and style.css

P4 — Operational scripts / automation helpers / vendor code
22) Any install scripts (e.g., /install.php, /setup.php, /deploy.sh, /wp-cli.yml, /bin/*)
23) Any composer autoloaders (vendor/autoload.php) if present
24) Any custom “license server” / remote-calling code not already covered

P5 — Remaining suspicious candidates (as discovered)
25) Any file that contains long encoded strings, unexpected new files, or unusual names

FIRST FILE TO UPLOAD (YOU MUST ASK ME FOR THIS EXACTLY)
Ask me to upload: /wp-config.php (or if absent, the closest equivalent: wp-config-sample.php or your wp-config template file).

STOP RULE
After you output the upload order and first file request, you must STOP and wait for my file upload.