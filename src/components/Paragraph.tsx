import { Box } from "@chakra-ui/core";
import React from "react";
import { useReactNodeView } from "./ReactNodeView";

const Paragraph: React.FC = ({ children }) => {
  const context = useReactNodeView();
  console.log(context);
  return <Box>{children}</Box>;
};

export default Paragraph;
