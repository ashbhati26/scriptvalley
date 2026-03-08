"use client";

import { useRef } from "react";
import { Grid } from "./_components/Grid";
import { PathfindingProvider } from "./context/PathfindingContext";
import { SpeedProvider } from "./context/SpeedContext";
import { TileProvider } from "./context/TileContext";
import { Nav } from "./_components/Nav";

function App() {
  const isVisulaizationRunningRef = useRef(false);

  return (
    <PathfindingProvider>
      <TileProvider>
        <SpeedProvider>
          <div className="flex flex-col min-h-screen bg-[var(--bg-base)] overflow-x-hidden">
            <Nav isVisulaizationRunningRef={isVisulaizationRunningRef} />
            <Grid isVisulaizationRunningRef={isVisulaizationRunningRef} />
          </div>
        </SpeedProvider>
      </TileProvider>
    </PathfindingProvider>
  );
}

export default App;