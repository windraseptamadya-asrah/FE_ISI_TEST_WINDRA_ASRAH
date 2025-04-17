import { Button as HButton } from "@headlessui/react";
import { ComponentPropsWithRef, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faSpinner } from "@fortawesome/free-solid-svg-icons";

type ButtonProps = ComponentPropsWithRef<"button"> &
  ComponentPropsWithRef<"a"> & {
    loading?: boolean;
    children: ReactNode;
  };

export default function Button({ children, loading, ...props }: Readonly<ButtonProps>) {
  return (
    <HButton
      as={props.href ? "a" : "button"}
      disabled={props.disabled || loading}
      type={props.type}
      className={`bg-black hover:bg-neutral-700 cursor-pointer data-[disabled]:bg-neutral-700 data-[disabled]:cursor-not-allowed text-white px-4 py-2 rounded transition duration-200 ease-in-out ${
        props.className ? " " + props.className : ""
      }`}
      style={props.style}
    >
      {loading && <FontAwesomeIcon icon={faCircleNotch} spin className="mr-2" /> }
      {children}
    </HButton>
  );
}
