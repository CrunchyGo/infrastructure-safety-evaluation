'use client';
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";

const defaultTitleClassName = 'text-xl font-semibold text-dark_green underline';
const defaultSubTitleClassName = 'text-lg font-semibold text-light_black';
const defaultDescriptionClassName = "text-sm mt-1 text-light_black";
const defaultContentClassName = 'z-50 fixed left-1/2 top-1/2 max-w-[90vw] max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 outline-none';

interface ModalProps {
    title: string;
    titleClassName?: string;
    subTitle?: string;
    subTitleClassName?: string;
    description?: string;
    descriptionClassName?: string;
    children: React.ReactNode;
    contentClassName?: string;
    open: boolean;
    setOpen?: any;
}

export default function AlertModal({
    title,
    subTitle,
    description,
    children,
    open,
    setOpen,
    contentClassName,
    descriptionClassName,
    titleClassName,
    subTitleClassName
}: ModalProps) {

    const rootTitleClassName = cn(defaultTitleClassName, titleClassName);
    const rootSubTitleClassName = cn(defaultSubTitleClassName, subTitleClassName);
    const rootDescriptionClassName = cn(defaultDescriptionClassName, descriptionClassName);
    const rootContentClassName = cn(defaultContentClassName, contentClassName);

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
                <AlertDialog.Content className={rootContentClassName} >
                    <AlertDialog.Title className={rootTitleClassName}>{title}</AlertDialog.Title>
                    {subTitle && <AlertDialog.Description className={rootSubTitleClassName}>{subTitle}</AlertDialog.Description>}
                    {description && <AlertDialog.Description className={rootDescriptionClassName}>{description}</AlertDialog.Description>}

                    <div className="mt-3">
                        {children}
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}
