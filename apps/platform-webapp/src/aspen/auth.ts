import { createAccessControl } from "@aspen-os/framework/client";

export const access_control = createAccessControl({
  audit_logs: ["read"],
  platform_settings: ["read", "update"],
  platform_users: ["create", "read", "update", "delete"],
  tenant_users: ["create", "read", "update", "delete"],
  tenants: ["create", "read", "update", "delete", "provision", "suspend"],
});

export const roles = {
  admin: access_control.newRole({
    audit_logs: ["read"],
    platform_settings: ["read", "update"],
    platform_users: ["create", "read", "update"],
    tenant_users: ["create", "read", "update", "delete"],
    tenants: ["create", "read", "update", "provision", "suspend"],
  }),
  super_admin: access_control.newRole({
    audit_logs: ["read"],
    platform_settings: ["read", "update"],
    platform_users: ["create", "read", "update", "delete"],
    tenant_users: ["create", "read", "update", "delete"],
    tenants: ["create", "read", "update", "delete", "provision", "suspend"],
  }),
  support: access_control.newRole({
    audit_logs: ["read"],
    platform_users: ["read"],
    tenant_users: ["read", "update"],
    tenants: ["read"],
  }),
  viewer: access_control.newRole({
    audit_logs: ["read"],
    tenants: ["read"],
  }),
} as const;
