import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import React from "react";
import EditorPage from "./EditorPage";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <EditorPage />
    </ThemeProvider>
  );
}

export default App;
