"use client";
import React from "react";
import Modal from "./Modal";

const ClientLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <>
      {/* Modal open button */}
      <button
        className="fixed top-4 left-4 z-50 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 h-10 w-10 transition justify-center items-center"
        onClick={() => setModalOpen(true)}
        aria-label="Open modal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">Modal Title</h2>
          <p>This is the modal content. You can put anything here.</p>
        </div>
      </Modal>
      {children}
    </>
  );
};

export default ClientLayoutWrapper; 