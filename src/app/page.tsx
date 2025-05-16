import Image from "next/image";
import MapComponent from "../components/map";
import ChatBox from "../components/chatbox/ChatBox";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <main className="flex flex-col w-full max-w-6xl gap-6 sm:flex-row sm:gap-8">
        <div className="flex-1 flex items-center justify-center">
          <MapComponent />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <ChatBox />
        </div>
      </main>
    </div>
  );
}
