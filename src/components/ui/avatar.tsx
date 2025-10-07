"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * Renders the avatar root element with standardized styling and a `data-slot="avatar"` attribute.
 *
 * @param className - Additional CSS class names to merge with the component's default avatar styles
 * @returns The AvatarPrimitive.Root element with combined class names and `data-slot="avatar"`
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a styled avatar image element used as the avatar's image slot.
 *
 * @param className - Additional CSS classes to apply to the image element
 * @returns A React element for the avatar image with `data-slot="avatar-image"` and composed styling
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

/**
 * Renders a styled avatar fallback element shown when the avatar image is unavailable.
 *
 * @param className - Additional CSS class names to merge with the component's default styles
 * @returns The AvatarPrimitive.Fallback element with merged `className` and `data-slot="avatar-fallback"`
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }