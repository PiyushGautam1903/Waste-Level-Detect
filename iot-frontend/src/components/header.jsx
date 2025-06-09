
import { Bell } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-gray-300 shadow-sm bg-background/80 backdrop-blur-sm sticky top-0 z-10 px-6">
      <div className="max-w-[1400px] w-full mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full eco-gradient flex items-center justify-center bg-green-500 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M4 19h17"/>
                <path d="M4 15h17"/>
                <path d="M4 11h17"/>
                <path d="M4 7h17"/>
              </svg>
            </div>
            <span className="font-semibold text-xl">EcoSmart Bin</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-full hover:bg-gray-200 transition-colors text-black"> 
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-alert-500" />
          </button>
        </div>
      </div>
    </header>
  );
}