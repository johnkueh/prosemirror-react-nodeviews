import { Button, ButtonProps, Flex } from "@chakra-ui/core";
import {
  faBold,
  faItalic,
  faLink,
  faUnderline,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toggleMark } from "prosemirror-commands";
import { MarkType, NodeType } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import React, { useCallback } from "react";
import { useProseMirror } from "./ProseMirror";
import HeadingButton from "./ProseMirrorToolbar/HeadingButton";

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

  return (
    <Flex mb={3}>
      <Flex mr={3}>
        <ToolbarButton
          icon={faBold}
          active={Boolean(markActive(editorView?.state, schema?.marks.strong))}
          onClick={() => toggleMarkCallback(schema?.marks.strong)}
        />
        <ToolbarButton
          icon={faItalic}
          active={Boolean(markActive(editorView?.state, schema?.marks.em))}
          onClick={() => toggleMarkCallback(schema?.marks.em)}
        />
        <ToolbarButton
          icon={faUnderline}
          active={Boolean(
            markActive(editorView?.state, schema?.marks.underline)
          )}
          onClick={() => toggleMarkCallback(schema?.marks.underline)}
        />
        <ToolbarButton
          icon={faLink}
          active={Boolean(markActive(editorView?.state, schema?.marks.link))}
          onClick={() => {}}
        />
      </Flex>
      <Flex mr={3}>
        <HeadingButton />
      </Flex>
    </Flex>
  );
};

export const ToolbarButton: React.FC<{
  icon: IconDefinition;
  active?: boolean;
} & Partial<ButtonProps>> = ({ active, icon, ...props }) => (
  <Button
    rounded="none"
    color={active ? "gray.800" : "gray.500"}
    _first={{ roundedTopLeft: "md", roundedBottomLeft: "md" }}
    _last={{ roundedTopRight: "md", roundedBottomRight: "md" }}
    size="xs"
    {...props}
  >
    <FontAwesomeIcon icon={icon} />
  </Button>
);

export function markActive(state?: EditorState, type?: MarkType) {
  if (state != null && type != null) {
    let { from, $from, to, empty } = state.selection;
    if (empty) return type.isInSet(state.storedMarks || $from.marks());
    else return state.doc.rangeHasMark(from, to, type);
  }
}

export function nodeActive(state?: EditorState, type?: NodeType, attrs?: any) {
  if (state != null && type != null) {
    let { $from, to } = state.selection;
    return to <= $from.end() && $from.parent.hasMarkup(type, attrs);
  }
}

export default ProseMirrorToolbar;
