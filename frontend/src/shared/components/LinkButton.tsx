import type { VariantProps } from 'class-variance-authority'
import { Link, type LinkProps } from 'react-router-dom'
import { buttonVariants } from '@/shared/components/ui/button'

type LinkButtonProps = LinkProps & VariantProps<typeof buttonVariants>

export function LinkButton({ variant, size, className, ...props }: LinkButtonProps) {
  return <Link data-slot="button" className={buttonVariants({ variant, size, className })} {...props} />
}
