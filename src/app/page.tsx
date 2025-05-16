import Image from "next/image";
import PlaceExplorer from "../components/placeexplorer/place_explorer";
import ChatBox from "../components/chatbox/ChatBox";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <main className="flex flex-row w-full gap-6 pl-18 pr-18">
        <div className="grid grid-cols-1 gap-4 w-1/2 h-[5vh]">
          <PlaceExplorer />
        </div>
        <div className="w-1/2 h-[95vh]">
          <ChatBox />
        </div>
      </main>
    </div>
  );
}
