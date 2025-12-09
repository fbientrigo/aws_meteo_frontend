import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MapView from "@/components/MapView";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile: Sheet Sidebar */}
        <div className="md:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="absolute top-20 left-4 z-50">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-96 p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop: Resizable Panels */}
        <ResizablePanelGroup direction="horizontal" className="hidden md:flex w-full">
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <Sidebar />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={75}>
            <div className="flex flex-col h-full min-h-0">


              {/* Map Area */}
              <div className="flex-1 relative min-h-0">
                <MapView />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Mobile: Stack Layout */}
        <div className="md:hidden flex flex-col w-full min-h-0">

          <div className="flex-1 relative min-h-0">
            <MapView />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
