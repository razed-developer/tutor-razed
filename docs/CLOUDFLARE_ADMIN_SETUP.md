# Cloudflare admin setup

The repository contains the D1 schema, existing catalogue seed, Pages Functions API, and working admin interface. The public portal uses D1 when it is available and safely falls back to the checked-in catalogue during setup or an outage.

## 1. Create D1

In Cloudflare, open **Storage & Databases → D1 SQL Database → Create database**.

- Name: `tutor-portal`
- Region: automatic

Copy the database ID shown after creation.

## 2. Bind D1 to the Pages project

Open **Workers & Pages → tutor-razed → Settings → Bindings → Add binding → D1 database**.

- Variable name: `DB`
- Database: `tutor-portal`

Add it to both Production and Preview. Then add this block to `wrangler.toml`, replacing the placeholder with the copied ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "tutor-portal"
database_id = "YOUR_DATABASE_ID"
```

## 3. Set the administrator allow-list

In **Workers & Pages → tutor-razed → Settings → Variables and Secrets**, add a plain-text variable to Production and Preview:

- Name: `ADMIN_EMAILS`
- Value: the email address allowed to administer the site

Multiple administrators can be separated by commas.

## 4. Apply the migration

From a clone of this repository, authenticate Wrangler and apply the committed migration:

```bash
npx wrangler login
npm run db:migrate:remote
```

This applies both migrations: the schema and the existing resource catalogue.

## 5. Protect both admin paths with Access

In **Zero Trust → Access → Applications**, add a self-hosted application for the production hostname. Create two protected paths:

- `/admin*`
- `/api/admin/*`

Create an Allow policy containing only the administrator email address. Use the same identity provider for both paths.

The API performs a second check: it requires Cloudflare Access's authenticated-email header to match `ADMIN_EMAILS`. Protecting only `/admin` is insufficient because an unprotected API could still be called directly.

If the Pages project has both a custom domain and a `pages.dev` hostname, ensure Access covers both hostnames or disable the public `pages.dev` route.

## 6. Verify before enabling live publishing

After redeploying, sign in through Access and check:

1. `/api/admin/resources` returns JSON when signed in.
2. The same URL returns `403` without an Access session.
3. `/api/resources` returns the seeded resource catalogue.
4. Creating a draft in `/admin` does not show it publicly; publishing it does.

The anonymous public API deliberately excludes resources assigned to specific students or groups. Those assignments will become visible only through a later authenticated student endpoint.

The admin interface can now create, edit, publish, feature, order and archive resources, and assign them to age bands, students and groups.
