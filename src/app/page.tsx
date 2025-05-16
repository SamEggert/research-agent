import Image from "next/image";
import MapComponent from "../components/map";
import ChatBox from "../components/chatbox/ChatBox";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <main className="flex flex-row w-full max-w-6xl gap-6">
        <div className="w-1/2 h-[80vh]">
          <MapComponent />
        </div>
        <div className="w-1/2 h-[80vh]">
          <ChatBox />
        </div>
      </main>
    </div>
  );
}
