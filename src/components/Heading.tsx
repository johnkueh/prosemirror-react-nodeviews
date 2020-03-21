import { Heading } from "@chakra-ui/core";
import React from "react";
import { useReactNodeView } from "./ReactNodeView";

const HeadingBlock: React.FC = ({ children }) => {
  const context = useReactNodeView();
  console.log(context);
  return <Heading>{children}</Heading>;
};

export default HeadingBlock;
