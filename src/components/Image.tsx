import { Box, Image, Input } from "@chakra-ui/core";
import React, { useRef, useState } from "react";
import { useReactNodeView } from "./ReactNodeView";

const ImageBlock: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const context = useReactNodeView();
  const attrs = context.node?.attrs;
  const [focused, setFocused] = useState(false);
  const [title, setTitle] = useState(attrs?.title);
  // console.log(context.node);

  return (
    <Box as="span" position="relative">
      <Image
        onClick={(e: any) => {
          // e.preventDefault();
          // setFocused(true);
          // inputRef.current?.focus();
        }}
        alt={attrs?.alt}
        src={attrs?.src}
      />
      <Input
        ref={inputRef}
        placeholder="Image caption"
        variant="unstyled"
        defaultValue={title}
        onChange={(e: any) => {
          setTitle(e.target.value);
        }}
        onBlur={() => {
          const { view, getPos } = context;
          if (view) {
            view.dispatch(
              view.state.tr.setNodeMarkup(getPos(), context.node?.type, {
                ...attrs,
                title
              })
            );
          }
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
