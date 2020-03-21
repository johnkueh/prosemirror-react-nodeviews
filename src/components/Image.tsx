import { Box, Image, Input } from "@chakra-ui/core";
import React, { useState } from "react";
import { useReactNodeView } from "./ReactNodeView";

const ImageBlock: React.FC = () => {
  const context = useReactNodeView();
  const attrs = context.node?.attrs;
  const [title, setTitle] = useState(attrs?.title);
  return (
    <Box>
      <Image alt={attrs?.alt} src={attrs?.src} />
      <Input
        placeholder="Image caption"
        variant="unstyled"
        value={title}
        onChange={(e: any) => {
          setTitle(e.target.value);
        }}
        mt={2}
        color="gray.500"
        textAlign="center"
        fontSize="xs"
      />
    </Box>
  );
};

export default ImageBlock;
