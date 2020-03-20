import React from "react";
import { Box, BoxProps } from "@chakra-ui/core";

const Container: React.FC<BoxProps> = props => {
  return <Box width="90%" mx="auto" {...props} />;
};

export default Container;
