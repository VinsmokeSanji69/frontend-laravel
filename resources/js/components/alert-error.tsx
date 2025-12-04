import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

export default function AlertError({
                                       errors,
                                       title,
                                       duration = 4000,   // default 4 seconds
                                       onClose,           // callback to remove alert
                                   }: {
    errors: any;
    title?: string;
    duration?: number;
    onClose?: () => void;
}) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{title || 'Something went wrong.'}</AlertTitle>
            <AlertDescription>
                {Array.isArray(errors)
                    ? errors.map((e, i) => <div key={i}>{e}</div>)
                    : errors}
            </AlertDescription>
        </Alert>
    );
}
