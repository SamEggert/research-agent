import Image from "next/image";
import MapComponent from "../components/map";
import ChatBox from "../components/chatbox/ChatBox";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <main className="flex flex-row w-full gap-6 pl-8 pr-8">
        <div className="w-1/2 h-[95vh]">
          <MapComponent />
        </div>
        <div className="w-1/2 h-[95vh]">
          <ChatBox />
        </div>
      </main>
    </div>
  );
}
