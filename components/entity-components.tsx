import { Button } from "./ui/button";
import {
  AlertTriangleIcon,
  Loader2Icon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "./ui/empty";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";

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

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function EntitySearch({
  value,
  onChange,
  placeholder,
}: EntitySearchProps) {
  return (
    <div className="relative ml-auto">
      <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="mx-w-[200px] bg-background shadow-none border-border pl-8"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

interface EntityPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function EntityPagination({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages ?? 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4"></div>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || page === 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || page === totalPages || totalPages === 0}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        Next
      </Button>
    </div>
  );
}

interface StateViewProps {
  message?: string;
}

export function LoadingView({ message }: StateViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full flex-1 gap-y-4">
      <Loader2Icon className="size-6 animate-spin text-primary" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}

export function ErrorView({ message }: StateViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full flex-1 gap-y-4">
      <AlertTriangleIcon className="size-6 text-primary" />
      {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}

interface EmptyViewProps extends StateViewProps {
  onNew?: () => void;
}

export function EmptyView({ message, onNew }: EmptyViewProps) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon />
        </EmptyMedia>

        <EmptyTitle>No items</EmptyTitle>
        {!!message && <EmptyDescription>{message}</EmptyDescription>}
      </EmptyHeader>
      {!!onNew && (
        <EmptyContent>
          <Button onClick={onNew} size="sm">
            <PlusIcon className="size-4" />
            Add item
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}

interface EntityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
}

export function EntityList<T>({
  items,
  renderItem,
  getKey,
  emptyView,
  className,
}: EntityListProps<T>) {
  if (items.length === 0 && emptyView) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="max-w-sm mx-auto">{emptyView}</div>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

interface EntityItemProps {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
}

export function EntityItem({
  href,
  title,
  subtitle,
  image,
  actions,
  onRemove,
  isRemoving,
  className,
}: EntityItemProps) {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRemoving) {
      return;
    }
    if (onRemove) {
      await onRemove();
    }
  };
  return (
    <Link href={href} prefetch>
      <Card
        className={cn(
          "p-4 shadow-none hover:shadow cursor-pointer",
          isRemoving && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <CardContent className="flex flex-row items-center justify-between p-0">
          <div className="flex items-center gap-3">
            {image}
            <div>
              <CardTitle className="text-base font-medium">{title}</CardTitle>
              {!!subtitle && (
                <CardDescription className="text-xs">
                  {subtitle}
                </CardDescription>
              )}
            </div>
          </div>
          {(!!actions || !!onRemove) && (
            <div>
              <div className="flex items-center gap-x-4">
                {actions}
                {!!onRemove && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MoreVerticalIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <DropdownMenuItem onClick={handleRemove}>
                        <TrashIcon className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
