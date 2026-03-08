'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    autoDismiss: boolean;
    dismissAfterMs?: number;
}

interface ToastContextValue {
    toasts: Toast[];
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showInfo: (message: string) => void;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Module-level error handler so apiFetch (non-React code) can show toasts
let _errorHandler: ((msg: string) => void) | null = null;

export function registerToastErrorHandler(fn: (msg: string) => void) {
    _errorHandler = fn;
}

export function notifyError(message: string) {
    if (_errorHandler) {
        _errorHandler(message);
    }
}

let _counter = 0;
function nextId() {
    return `toast-${++_counter}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const dismiss = useCallback((id: string) => {
        const timer = timersRef.current.get(id);
        if (timer !== undefined) {
            clearTimeout(timer);
            timersRef.current.delete(id);
        }
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback(
        (toast: Omit<Toast, 'id'>) => {
            const id = nextId();
            setToasts((prev) => [...prev, { ...toast, id }]);

            if (toast.autoDismiss && toast.dismissAfterMs) {
                const timer = setTimeout(() => dismiss(id), toast.dismissAfterMs);
                timersRef.current.set(id, timer);
            }
        },
        [dismiss],
    );

    const showSuccess = useCallback(
        (message: string) =>
            addToast({ type: 'success', message, autoDismiss: true, dismissAfterMs: 4000 }),
        [addToast],
    );

    const showError = useCallback(
        (message: string) => addToast({ type: 'error', message, autoDismiss: false }),
        [addToast],
    );

    const showInfo = useCallback(
        (message: string) =>
            addToast({ type: 'info', message, autoDismiss: true, dismissAfterMs: 3000 }),
        [addToast],
    );

    useEffect(() => {
        registerToastErrorHandler(showError);
        return () => {
            registerToastErrorHandler(() => {});
        };
    }, [showError]);

    // Cleanup all timers on unmount
    useEffect(() => {
        const timers = timersRef.current;
        return () => {
            timers.forEach((timer) => clearTimeout(timer));
        };
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showSuccess, showError, showInfo, dismiss }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return ctx;
}
