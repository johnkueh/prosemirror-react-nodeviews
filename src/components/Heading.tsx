import { Heading } from "@chakra-ui/core";
import React from "react";
import { useReactNodeView } from "./ReactNodeView";

const HeadingBlock: React.FC = ({ children }) => {
  const context = useReactNodeView();
  const level = context.node?.attrs.level;
  const levels: any = {
    1: "h1",
    2: "h2",
    3: "h3",
    4: "h4",
    5: "h5",
    6: "h6"
  };
  return (
    <Heading as={levels[level]} fontSize={`${7 - level}xl`}>
      {children}
    </Heading>
  );
};

export default HeadingBlock;
