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
        <span className="text-lg font-bold">☰</span>
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