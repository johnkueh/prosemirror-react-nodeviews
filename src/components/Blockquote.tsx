import { Box } from "@chakra-ui/core";
import React from "react";
// import { useReactNodeView } from "./ReactNodeView";

const Blockquote: React.FC = ({ children }) => {
  // const context = useReactNodeView();
  // console.log(context);
  return (
    <Box pl={5} borderLeftWidth="5px" borderLeftColor="gray.800">
      {children}
    </Box>
  );
};
export default Blockquote;
