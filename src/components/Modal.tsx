import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const TRANSITION_DURATION = 300; // ms

const Modal: React.FC<ModalProps> = ({ open, onClose }) => {
  const [show, setShow] = React.useState(false);
  const [shouldRender, setShouldRender] = React.useState(open);

  // Data state
  const [recommendations, setRecommendations] = React.useState<any[] | null>(null);
  const [preferences, setPreferences] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setShouldRender(true);
      setTimeout(() => setShow(true), 10); // allow next tick for transition
      setLoading(true);
      // Fetch data from API
      Promise.all([
        fetch('/api/neon/recommendations').then(r => r.json()),
        fetch('/api/neon/preferences').then(r => r.json())
      ]).then(([recs, prefs]) => {
        setRecommendations(recs);
        setPreferences(prefs);
        setLoading(false);
      }).catch(() => setLoading(false));
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
        className={`relative bg-white rounded-lg shadow-lg p-6 min-w-[500px] max-w-[800px] w-full max-h-[90vh] overflow-auto z-10 transition-all duration-300 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-2">LLM Notes</h2>
        <div className="mb-4">
          {loading ? (
            <span>Loading notes...</span>
          ) : preferences && preferences.llm_notes ? (
            <ul>
              {preferences.llm_notes.map((note: string, idx: number) => (
                <li key={idx} className="mb-1">- {note}</li>
              ))}
            </ul>
          ) : (
            <span>No notes found.</span>
          )}
        </div>
        <h2 className="text-xl font-bold mb-2">Recommendations</h2>
        <div>
          {loading ? (
            <span>Loading recommendations...</span>
          ) : recommendations && recommendations.length > 0 ? (
            <ul>
              {recommendations.map((rec) => (
                <li key={rec.id} className="mb-2">
                  <div className="font-semibold">{rec.display_name}</div>
                  <div className="text-sm text-gray-500">{rec.address}</div>
                  <div className="text-xs">Rating: {rec.rating ?? "N/A"}</div>
                </li>
              ))}
            </ul>
          ) : (
            <span>No recommendations found.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal; 