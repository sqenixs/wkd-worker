# Advanced PGP Web Key Directory (WKD) Worker

An enterprise-grade, serverless implementation of the **Advanced WKD Method** built for Cloudflare Workers. This project dynamically serves raw binary GPG public keys directly from Cloudflare KV storage, bypassing the need for file trees or static text files, and completely hiding your git commit history from public email crawlers.

## Features

- **Advanced WKD Layout:** Isolates PGP key traffic completely on an independent `openpgpkey` subdomain.
- **Pure Binary Streaming:** Zero runtime decoding loops (`xxd` or string parsing) or performance overhead at the edge.
- **Dynamic Domain Processing:** Supports multiple distinct domains or email aliases natively without code adjustments.
- **Edge Shielding:** Pre-configured with Cloudflare Cache rules and strict WAF rate-limiting rules to safeguard your daily free tier request limits.

## Project Structure

```text
wkd-worker/
├── .gitignore       # Blocks private local binary data from leaking into git logs
├── README.md        # Documentation and commands manual
├── worker.js        # Serverless HTTP edge handler
└── wrangler.jsonc   # Configuration settings, bindings, and project definitions
```

## How to Add an Email Alias

To add a new email user or identity to your directory, use your local python generator or terminal utilities to generate your WKD Z-Base32 hash name and push it to the database using Wrangler:

```bash
# Upload your raw binary PGP public key file straight to your Cloudflare database
npx wrangler kv key put --namespace-id="YOUR_KV_NAMESPACE_ID" "YOUR_32_CHAR_HASH" "./YOUR_32_CHAR_HASH" --remote
```

## Setup Validation

To verify that your serverless architecture aligns perfectly with global IETF standards, run an automated audit against the official validation engine:

- **WKD Compliance Test:** [WebKeyDirectory.com](