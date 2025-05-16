import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const TRANSITION_DURATION = 300; // ms

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  const [show, setShow] = React.useState(false);
  const [shouldRender, setShouldRender] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setShouldRender(true);
      setTimeout(() => setShow(true), 10); // allow next tick for transition
    } else {
      setShow(false);
      const timeout = setTimeout(() => setShouldRender(false), TRANSITION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!shouldRender) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Clickable backdrop with fade */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 bg-white/10 backdrop-blur ${show ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-label="Close modal backdrop"
      />
      {/* Modal content with fade/scale */}
      <div
        className={`relative bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-[90vw] max-h-[90vh] overflow-auto z-10 transition-all duration-300 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
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