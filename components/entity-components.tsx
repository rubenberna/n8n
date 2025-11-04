import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { newButtonHref?: never; onNew?: never }
);

/**
 * EntityHeader component
 Scenario 1: The button is an ACTION (e.g., opens a modal)
TypeScript

{ onNew: () => void; newButtonHref?: never }
You must provide an onNew function (a callback).

You must NOT provide a newButtonHref.

When to use: When clicking the button should trigger an action, like opening a modal or running some JavaScript code. It will likely render as a <button>.

Scenario 2: The button is a LINK (e.g., goes to a new page)
TypeScript

{ newButtonHref: string; onNew?: never }
You must provide a newButtonHref string (a URL).

You must NOT provide an onNew function.

When to use: When clicking the button should navigate the user to a different page (like /users/new). It will likely render as an <a> tag.

Scenario 3: There is NO "New" button
TypeScript

{ newButtonHref?: never; onNew?: never }
You must NOT provide a newButtonHref.

You must NOT provide an onNew function.

When to use: When you just want to display a title and description with no call-to-action button.
 */

type EntityContainerProps = {
  children: React.ReactNode;
  header: React.ReactNode;
  search: React.ReactNode;
  pagination: React.ReactNode;
};

export function EntityHeader({
  title,
  description,
  newButtonLabel,
  disabled,
  isCreating,
  onNew,
  newButtonHref,
}: EntityHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {!!onNew && !newButtonHref && (
        <Button onClick={onNew} disabled={disabled || isCreating} size="sm">
          <PlusIcon className="size-4" />
          {newButtonLabel}
        </Button>
      )}
      {!!newButtonHref && !onNew && (
        <Button asChild disabled={disabled || isCreating} size="sm">
          <Link href={newButtonHref} prefetch>
            <PlusIcon className="size-4" />
            {newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}

export function EntityContainer({
  header,
  search,
  pagination,
  children,
}: EntityContainerProps) {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-y-8 h-full">
        {header}
        <div className="flex flex-col gap-y-4 h-full">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
}
