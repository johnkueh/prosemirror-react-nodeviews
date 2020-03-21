import { Box } from "@chakra-ui/core";
import React from "react";
import { useReactNodeView } from "./ReactNodeView";

const CodeBlock: React.FC = ({ children }) => {
  const context = useReactNodeView();
  console.log(context);
  return (
    <Box bg="gray.100" my={3} p={2} rounded="md" fontSize="lg">
      {children}
    </Box>
  );
};

export default CodeBlock;
