import { Button, ButtonProps, Flex } from "@chakra-ui/core";
import {
  faBold,
  faHeading,
  faItalic,
  faLink,
  faUnderline,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toggleMark } from "prosemirror-commands";
import React, { useCallback } from "react";
import { useProseMirror } from "./ProseMirror";

interface Props {}

const ProseMirrorToolbar: React.FC<Props> = () => {
  const { editorView, schema } = useProseMirror();
  const toggleMarkCallback = useCallback(
    mark => {
      if (schema != null && editorView != null) {
        toggleMark(mark)(editorView.state, editorView.dispatch);
        editorView.focus();
      }
    },
    [schema, editorView]
  );

  console.log(editorView);

  return (
    <Flex mb={3}>
      <Flex mr={3}>
        <ToolbarButton
          icon={faBold}
          onClick={() => toggleMarkCallback(schema?.marks.strong)}
        />
        <ToolbarButton
          icon={faItalic}
          onClick={() => toggleMarkCallback(schema?.marks.em)}
        />
        <ToolbarButton
          icon={faUnderline}
          onClick={() => toggleMarkCallback(schema?.marks.underline)}
        />
        <ToolbarButton icon={faLink} onClick={() => {}} />
      </Flex>
      <Flex mr={3}>
        <ToolbarButton icon={faHeading} onClick={() => {}} />
      </Flex>
    </Flex>
  );
};

const ToolbarButton: React.FC<{ icon: IconDefinition } & Partial<
  ButtonProps
>> = ({ icon, ...props }) => (
  <Button
    rounded="none"
    _first={{ roundedTopLeft: "md", roundedBottomLeft: "md" }}
    _last={{ roundedTopRight: "md", roundedBottomRight: "md" }}
    size="xs"
    {...props}
  >
    <FontAwesomeIcon icon={icon} />
  </Button>
);

export default ProseMirrorToolbar;
