import {
  Box,
  Flex,
  Heading,
  PseudoBox,
  PseudoBoxProps,
  Text,
  useDisclosure
} from "@chakra-ui/core";
import { faHeading } from "@fortawesome/free-solid-svg-icons";
import { setBlockType } from "prosemirror-commands";
import React, { useCallback } from "react";
import { useProseMirror } from "../ProseMirror";
import { nodeActive, ToolbarButton } from "../ProseMirrorToolbar";

interface Props {}

const HeadingButton: React.FC<Props> = () => {
  const { editorView, schema } = useProseMirror();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setBlockTypeCallback = useCallback(
    (type, attrs?) => {
      if (schema != null && editorView != null) {
        setBlockType(type, attrs)(editorView.state, editorView.dispatch);
        editorView.focus();
      }
    },
    [schema, editorView]
  );

  console.log(editorView?.state.doc);

  return (
    <Flex position="relative">
      <ToolbarButton
        icon={faHeading}
        active={Boolean(
          nodeActive(editorView?.state, schema?.nodes.heading, { level: 1 }) ||
            nodeActive(editorView?.state, schema?.nodes.heading, {
              level: 2
            }) ||
            nodeActive(editorView?.state, schema?.nodes.heading, {
              level: 3
            }) ||
            nodeActive(editorView?.state, schema?.nodes.heading, {
              level: 4
            }) ||
            nodeActive(editorView?.state, schema?.nodes.heading, { level: 5 })
        )}
        onClick={onOpen}
      />
      {isOpen && (
        <>
          <Box
            onClick={onClose}
            zIndex={10}
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
          />
          <Box
            rounded="md"
            borderWidth="1px"
            borderColor="gray.100"
            bg="white"
            top={8}
            shadow="md"
            position="absolute"
            zIndex={20}
            width="10rem"
          >
            <MenuItem
              active={nodeActive(editorView?.state, schema?.nodes.paragraph)}
              onClick={() => {
                setBlockTypeCallback(schema?.nodes.paragraph);
                onClose();
              }}
            >
              <Text fontSize="md">Paragraph</Text>
            </MenuItem>
            <MenuItem
              active={nodeActive(editorView?.state, schema?.nodes.heading, {
                level: 1
              })}
              onClick={() => {
                setBlockTypeCallback(schema?.nodes.heading, { level: 1 });
                onClose();
              }}
            >
              <Heading fontSize="2xl">Heading 1</Heading>
            </MenuItem>
            <MenuItem
              active={nodeActive(editorView?.state, schema?.nodes.heading, {
                level: 2
              })}
              onClick={() => {
                setBlockTypeCallback(schema?.nodes.heading!, { level: 2 });
                onClose();
              }}
            >
              <Heading fontSize="xl">Heading 2</Heading>
            </MenuItem>
            <MenuItem
              active={nodeActive(editorView?.state, schema?.nodes.heading, {
                level: 3
              })}
              onClick={() => {
                setBlockTypeCallback(schema?.nodes.heading!, { level: 3 });
                onClose();
              }}
            >
              <Heading fontSize="lg">Heading 3</Heading>
            </MenuItem>
            <MenuItem
              active={nodeActive(editorView?.state, schema?.nodes.heading, {
                level: 4
              })}
              onClick={() => {
                setBlockTypeCallback(schema?.nodes.heading!, { level: 4 });
                onClose();
              }}
            >
              <Heading fontSize="md">Heading 4</Heading>
            </MenuItem>
            <MenuItem
              active={nodeActive(editorView?.state, schema?.nodes.heading, {
                level: 5
              })}
              onClick={() => {
                setBlockTypeCallback(schema?.nodes.heading!, { level: 5 });
                onClose();
              }}
            >
              <Heading fontSize="sm">Heading 5</Heading>
            </MenuItem>
          </Box>
        </>
      )}
    </Flex>
  );
};

const MenuItem: React.FC<{ active?: boolean } & PseudoBoxProps> = ({
  active,
  ...props
}) => (
  <PseudoBox
    as="button"
    width="100%"
    textAlign="left"
    py={2}
    px={4}
    color={active ? "white" : "gray.800"}
    bg={active ? "gray.500" : "white"}
    _hover={{
      bg: active ? "gray.500" : "gray.100"
    }}
    {...props}
  />
);

export default HeadingButton;
