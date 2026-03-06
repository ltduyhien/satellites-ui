import { clsx, type ClassValue } from "clsx"
// clsx: A tiny utility that conditionally joins class names together.
// Accepts strings, objects, arrays — e.g. clsx('foo', { bar: true }, ['baz'])
// ClassValue: The TypeScript type for any valid input to clsx.

import { twMerge } from "tailwind-merge"
// twMerge: Intelligently merges Tailwind CSS classes, resolving conflicts.
// e.g. twMerge('px-2 px-4') → 'px-4' (last one wins instead of both being applied).
// Without this, conflicting Tailwind classes would both stay in the DOM
// and the result depends on CSS specificity order — unpredictable.

export function cn(...inputs: ClassValue[]) {
  // cn: Combines clsx (conditional joining) with twMerge (conflict resolution).
  // Used throughout all shadcn components for className props.
  // Usage: cn('base-class', conditional && 'active-class', className)
  return twMerge(clsx(inputs))
}
