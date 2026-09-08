"use client";

import {useEffect, useId, useRef, useState} from "react";

import {
    AdminControlCheckIcon,
    AdminControlChevronIcon,
} from "@/components/admin/admin-control-icons";
import {adminGuests} from "@/components/admin/admin-ui";
import {adminSelectOptionTone} from "@/lib/admin/admin-controls";
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
    labelClassName?: string;
    triggerClassName?: string;
};

export function AdminSelect<T extends string>({
    label,
    value,
    options,
    onChange,
    className,
    labelClassName,
    triggerClassName,
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
        <div ref={rootRef} className={cn("relative grid gap-1.5", className)}>
            <span
                id={labelId}
                className={cn(
                    labelClassName ?? adminGuests.filterLabel,
                    open && "text-admin-olive",
                )}
            >
                {label}
            </span>
            <button
                type="button"
                className={cn(
                    triggerClassName ?? adminGuests.filterTrigger,
                    open && adminGuests.filterTriggerOpen,
                )}
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
                <span className="min-w-0 flex-1 truncate">{selected?.label}</span>
                <AdminControlChevronIcon open={open} />
            </button>
            {open ? (
                <ul
                    id={listId}
                    role="listbox"
                    aria-labelledby={labelId}
                    className={adminGuests.selectMenu}
                >
                    {options.map((option, index) => {
                        const isSelected = option.value === value;
                        const tone = adminSelectOptionTone({
                            selected: isSelected,
                            highlighted: index === activeIndex,
                        });

                        return (
                            <li key={option.value} role="none">
                                <button
                                    type="button"
                                    role="option"
                                    tabIndex={-1}
                                    aria-selected={isSelected}
                                    className={cn(
                                        adminGuests.selectOption,
                                        tone === "hover" && adminGuests.selectOptionHover,
                                        tone === "selected" &&
                                            adminGuests.selectOptionSelected,
                                    )}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onClick={() => commit(index)}
                                >
                                    <span className="min-w-0 truncate">{option.label}</span>
                                    {isSelected ? <AdminControlCheckIcon /> : null}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </div>
    );
}
