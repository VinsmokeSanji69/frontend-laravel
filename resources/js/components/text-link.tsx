import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ComponentProps } from 'react';

type LinkProps = ComponentProps<typeof Link>;

export default function TextLink({
    className = '',
    children,
    ...props
}: LinkProps) {
    return (
        <Link
            className={cn(
                'text-primary underline decoration-red-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-red-500',
                className,
            )}
            {...props}
        >
            {children}
        </Link>
    );
}
