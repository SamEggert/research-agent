"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import PlaceExplorer from "../components/placeexplorer/place_explorer";
import ChatBox from "../components/chatbox/ChatBox";

export default function Home() {
  const [markers, setMarkers] = useState<any[]>([]);

  // Fetch markers from the backend
  const fetchMarkers = useCallback(async () => {
    try {
      const res = await fetch("/api/maps/markers");
      const data = await res.json();
      if (data.markers) setMarkers(data.markers);
    } catch (err) {
      // Optionally handle error
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <main className="flex flex-row w-full gap-6 pl-18 pr-18">
        <div className="grid grid-cols-1 gap-4 w-1/2 h-[5vh]">
          <PlaceExplorer markers={markers} fetchMarkers={fetchMarkers} />
        </div>
        <div className="w-1/2 h-[95vh]">
          <ChatBox fetchMarkers={fetchMarkers} />
        </div>
      </main>
    </div>
  ); 
}
