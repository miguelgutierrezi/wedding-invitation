"use client";

import {useEffect, useRef} from "react";

type AdminRowCheckboxProps = {
    checked: boolean;
    indeterminate?: boolean;
    label: string;
    onChange: (checked: boolean) => void;
};

export function AdminRowCheckbox({
    checked,
    indeterminate = false,
    label,
    onChange,
}: AdminRowCheckboxProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate && !checked;
        }
    }, [checked, indeterminate]);

    return (
        <label
            className="inline-flex size-11 shrink-0 items-center justify-center"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
        >
            <span className="sr-only">{label}</span>
            <input
                ref={inputRef}
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="size-5 accent-accent"
            />
        </label>
    );
}
