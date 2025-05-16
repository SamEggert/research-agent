import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (open) setShow(true);
    else setShow(false);
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur">
      {/* Clickable backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal backdrop"
      />
      {/* Modal content */}
      <div
        className={`
          relative bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-[90vw] max-h-[90vh] overflow-auto z-10
          transition-all duration-300
          ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 