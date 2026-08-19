"use client";

import {useEffect, useId, useRef, useState} from "react";

import {admin} from "@/components/admin/admin-ui";
import {cn} from "@/lib/utils";

export type AdminSelectOption<T extends string = string> = {
    value: T;
    label: string;
};

type AdminSelectProps<T extends string> = {
    label: string;
    value: T;
    options: readonly AdminSelectOption<T>[];
    onChange: (value: T) => void;
    className?: string;
};

export function AdminSelect<T extends string>({
                                                  label,
                                                  value,
                                                  options,
                                                  onChange,
                                                  className,
                                              }: AdminSelectProps<T>) {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const rootRef = useRef<HTMLDivElement>(null);
    const labelId = useId();
    const listId = useId();
    const selected = options.find((option) => option.value === value) ?? options[0];
    const selectedIndex = Math.max(
        0,
        options.findIndex((option) => option.value === value),
    );

    useEffect(() => {
        if (!open) {
            return;
        }

        const onPointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open]);

    function openMenu() {
        setActiveIndex(selectedIndex);
        setOpen(true);
    }

    function toggleMenu() {
        if (open) {
            setOpen(false);
            return;
        }
        openMenu();
    }

    function commit(index: number) {
        const next = options[index];
        if (!next) {
            return;
        }
        onChange(next.value);
        setOpen(false);
    }

    function moveActive(direction: 1 | -1) {
        setActiveIndex(
            (current) => (current + direction + options.length) % options.length,
        );
    }

    return (
        <div ref={rootRef} className={cn("relative grid gap-2", className)}>
      <span id={labelId} className={admin.label}>
        {label}
      </span>
            <button
                type="button"
                className={cn(admin.selectTrigger, open && "border-cover-cta-fg")}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-labelledby={labelId}
                aria-controls={listId}
                onClick={toggleMenu}
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        event.preventDefault();
                        setOpen(false);
                        return;
                    }
                    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                        event.preventDefault();
                        if (!open) {
                            openMenu();
                            return;
                        }
                        moveActive(event.key === "ArrowDown" ? 1 : -1);
                    }
                    if (open && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        commit(activeIndex);
                    }
                }}
            >
                <span className="truncate">{selected?.label}</span>
                <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    className={cn(
                        "size-4 shrink-0 text-cover-cta-fg/80 transition-transform duration-200 motion-reduce:transition-none",
                        open && "rotate-180",
                    )}
                >
                    <path
                        d="M5 7.5 10 12.5 15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            {open ? (
                <ul
                    id={listId}
                    role="listbox"
                    aria-labelledby={labelId}
                    className={admin.selectMenu}
                >
                    {options.map((option, index) => {
                        const isSelected = option.value === value;
                        const isActive = index === activeIndex;

                        return (
                            <li key={option.value} role="none">
                                <button
                                    type="button"
                                    role="option"
                                    tabIndex={-1}
                                    aria-selected={isSelected}
                                    className={cn(
                                        admin.selectOption,
                                        isActive && "bg-accent/25",
                                        isSelected && "bg-accent/40 font-medium",
                                    )}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onClick={() => commit(index)}
                                >
                                    {option.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </div>
    );
}
