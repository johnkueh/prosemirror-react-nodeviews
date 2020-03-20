import React from "react";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import Page from "./components/Page";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Page />
    </ThemeProvider>
  );
}

export default App;
