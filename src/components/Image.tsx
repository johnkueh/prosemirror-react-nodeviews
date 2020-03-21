import { Box, Image, Text } from "@chakra-ui/core";
import React from "react";
import { useReactNodeView } from "./ReactNodeView";

const ImageBlock: React.FC = () => {
  const context = useReactNodeView();
  const attrs = context.node?.attrs;
  return (
    <Box>
      <Image alt={attrs?.alt} src={attrs?.src} />
      {attrs?.title && (
        <Text mt={2} color="gray.500" textAlign="center" fontSize="xs">
          {attrs.title}
        </Text>
      )}
    </Box>
  );
};

export default ImageBlock;
