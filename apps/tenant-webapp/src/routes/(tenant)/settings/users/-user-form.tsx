import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useId,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type UserRole = "admin" | "member";

export type UserFormValues = {
  email: string;
  name: string;
  password: string;
  role: UserRole;
};

type UserFormProps = {
  initialValues: UserFormValues;
  isOwner?: boolean;
  isEditing?: boolean;
  onCancel: () => void;
  onSubmit: (values: UserFormValues) => Promise<void>;
};

const selectClass =
  "h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 md:text-xs/relaxed";

export function UserForm({
  initialValues,
  isOwner = false,
  isEditing = false,
  onCancel,
  onSubmit,
}: UserFormProps) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const roleId = useId();

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, name: event.target.value }));
    },
    [],
  );
  const handleEmailChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, email: event.target.value }));
    },
    [],
  );
  const handlePasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, password: event.target.value }));
    },
    [],
  );
  const handleRoleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setValues((current) => ({
        ...current,
        role: event.target.value as UserRole,
      }));
    },
    [],
  );
  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Unable to save user",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, values],
  );

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-1.5">
        <label className="font-medium text-xs" htmlFor={nameId}>
          Full name
        </label>
        <Input
          autoComplete="name"
          id={nameId}
          onChange={handleNameChange}
          placeholder="Jane Doe"
          required
          value={values.name}
        />
      </div>

      <div className="grid gap-1.5">
        <label className="font-medium text-xs" htmlFor={emailId}>
          Email address
        </label>
        <Input
          autoComplete="email"
          disabled={isEditing}
          id={emailId}
          onChange={handleEmailChange}
          placeholder="jane@acme.com"
          required
          type="email"
          value={values.email}
        />
        {isEditing ? (
          <p className="text-[11px] text-muted-foreground">
            Email addresses cannot be changed here.
          </p>
        ) : null}
      </div>

      {!isEditing ? (
        <div className="grid gap-1.5">
          <label className="font-medium text-xs" htmlFor={passwordId}>
            Temporary password
          </label>
          <Input
            aria-describedby={`${passwordId}-hint`}
            autoComplete="new-password"
            id={passwordId}
            minLength={8}
            onChange={handlePasswordChange}
            placeholder="At least 8 characters"
            required
            type="password"
            value={values.password}
          />
          <p
            className="text-[11px] text-muted-foreground"
            id={`${passwordId}-hint`}
          >
            Share this securely with the user so they can sign in.
          </p>
        </div>
      ) : null}

      <div className="grid gap-1.5">
        <label className="font-medium text-xs" htmlFor={roleId}>
          Workspace role
        </label>
        {isOwner ? (
          <div
            className="flex h-7 items-center rounded-md border border-input bg-muted/40 px-2 text-muted-foreground text-xs"
            id={roleId}
          >
            Owner
          </div>
        ) : (
          <select
            className={selectClass}
            id={roleId}
            onChange={handleRoleChange}
            value={values.role}
          >
            <option value="member">Member</option>
            <option value="admin">Administrator</option>
          </select>
        )}
        <p className="text-[11px] text-muted-foreground">
          Administrators can manage workspace settings and users.
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-destructive text-xs">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse justify-end gap-2 border-t pt-4 sm:flex-row">
        <Button onClick={onCancel} type="button" variant="outline">
          Cancel
        </Button>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Save changes"
              : "Create user"}
        </Button>
      </div>
    </form>
  );
}
