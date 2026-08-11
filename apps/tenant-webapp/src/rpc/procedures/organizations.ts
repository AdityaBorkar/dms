import { env } from "@/env";
import { base } from "../middlewares/auth";

const SUBDOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

/**
 * Extracts the tenant subdomain from a request Host header by stripping the
 * app's apex domain (PUBLIC_WEB_DOMAIN). Returns null when the request is
 * hitting the apex domain itself or a host we don't serve.
 *
 * @example
 *   ("acme.localhost:3000", "localhost") => "acme"
 *   ("localhost:3000", "localhost")       => null
 *   ("acme.example.com", "example.com")   => "acme"
 *   ("example.com", "example.com")        => null
 */
function extractSubdomain(host: string, appDomain: string): string | null {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  const suffix = `.${appDomain.toLowerCase()}`;
  if (!hostname.endsWith(suffix)) return null;
  const subdomain = hostname.slice(0, -suffix.length);
  return subdomain.length > 0 && SUBDOMAIN_PATTERN.test(subdomain)
    ? subdomain
    : null;
}

export const getOrganizationBySubdomain = base.handler(async ({ context }) => {
  const host = context.headers.get("host");
  if (!host) return { organization: null, subdomain: null };

  const subdomain = extractSubdomain(host, env.PUBLIC_WEB_DOMAIN);
  if (!subdomain) return { organization: null, subdomain: null };

  const { p } = await import("@/aspen/server");

  return p.run("$global", async () => {
    const result = await p.db.pool.query<{
      created_at: Date;
      id: string;
      logo: string | null;
      metadata: unknown;
      name: string;
      slug: string;
    }>(
      `SELECT id, name, slug, logo, metadata, created_at
         FROM organization
         WHERE slug = $1
         LIMIT 1`,
      [subdomain],
    );

    const row = result.rows[0];
    if (!row) return { organization: null, subdomain };

    return {
      organization: {
        createdAt: row.created_at.toISOString(),
        id: row.id,
        logo: row.logo,
        metadata: row.metadata,
        name: row.name,
        slug: row.slug,
      },
      subdomain,
    };
  });
});

export const listOrganizations = base.handler(async () => {
  const { p } = await import("@/aspen/server");

  return p.run("$global", async () => {
    const result = await p.db.pool.query<{
      id: string;
      logo: string | null;
      name: string;
      slug: string;
    }>(
      `SELECT id, name, slug, logo
         FROM organization
         ORDER BY name ASC`,
    );

    return {
      organizations: result.rows,
    };
  });
});
