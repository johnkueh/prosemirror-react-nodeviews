import { Heading } from "@chakra-ui/core";
import React from "react";
import { useReactNodeView } from "./ReactNodeView";

const HeadingBlock: React.FC = ({ children }) => {
  const context = useReactNodeView();
  const level = context.node?.attrs.level;
  return <Heading fontSize={`${7 - level}xl`}>{children}</Heading>;
};

export default HeadingBlock;
