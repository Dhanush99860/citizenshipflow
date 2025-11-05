import * as React from "react";

// 1 = h1, 2 = h2, ...
export const HeadingLevelContext = React.createContext<number>(1);

// Increments the current heading level for everything inside it (max h6)
export function HeadingLevel({ children }: { children: React.ReactNode }) {
  const parent = React.useContext(HeadingLevelContext);
  const next = Math.min(6, parent + 1);
  return <HeadingLevelContext.Provider value={next}>{children}</HeadingLevelContext.Provider>;
}
