import { useEffect, useState } from "react";

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

interface SimpleToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function SimpleToast({
  message,
  duration = 2000,
  onClose,
}: SimpleToastProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
      onClose?.();
    }, duration);
  }, [duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out transform translate-x-0 opacity-100">
      <div className="flex items-center gap-2">
        <CheckIcon />
        {message}
      </div>
    </div>
  );
}
