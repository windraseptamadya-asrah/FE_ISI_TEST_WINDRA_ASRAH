import { Fragment, ReactNode, useState } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClassName,
}: Readonly<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: ReactNode;
  onConfirm: () => Promise<void>;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClassName?: string;
}>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      const error = e as Error;
      console.error("Error during async operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        onClose={!isLoading ? onClose : () => null}
        className="relative z-[6000]"
      >
        {/* Backdrop with transition */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </TransitionChild>

        {/* Modal container with transition */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center p-2">
            <DialogPanel className="w-full max-w-md rounded-lg bg-white/90 backdrop-blur-2xl p-4">
              <DialogTitle className="font-bold text-lg">{title}</DialogTitle>
              <Description className="py-4">{description}</Description>

              {/* Modal actions */}
              <div className="flex justify-end space-x-2">
                <button
                  className="text-black hover:bg-black/10 rounded px-2 py-1 transition-colors duration-200 cursor-pointer"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {cancelText}
                </button>
                <button
                  className={`text-black hover:bg-black/10 rounded px-2 py-1 transition-colors duration-200 cursor-pointer ${
                    confirmButtonClassName ?? ""
                  }`}
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <FontAwesomeIcon icon={faCircleNotch} spin className="mr-2" />
                  )}{" "}
                  {confirmText}
                </button>
              </div>
            </DialogPanel>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
