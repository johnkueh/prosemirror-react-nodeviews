import { Box } from "@chakra-ui/core";
import { baseKeymap } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { schema } from "prosemirror-schema-basic";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ReactNodeView, { useReactNodeView } from "./ReactNodeView";
import ReactNodeViewPortalsProvider, {
  useReactNodeViewPortals
} from "./ReactNodeViewPortals";

interface Props {
  defaultValue: any;
  onChange: any;
}

const ProseMirrorWrapper: React.FC<Props> = props => {
  return (
    <ReactNodeViewPortalsProvider>
      <ProseMirror {...props} />
    </ReactNodeViewPortalsProvider>
  );
};

const ProseMirror: React.FC<Props> = ({ defaultValue, onChange }) => {
  const { createPortal } = useReactNodeViewPortals();
  const editorViewRef = useRef(null);
  const handleChange = useCallback(onChange, []);
  const handleCreatePortal = useCallback(createPortal, []);
  const state = useMemo(() => {
    const doc = schema.nodeFromJSON(defaultValue);
    return EditorState.create({
      doc,
      plugins: [
        history(),
        keymap({ "Mod-z": undo, "Mod-y": redo }),
        keymap(baseKeymap)
      ]
    });
  }, [defaultValue]);

  useEffect(() => {
    const editorView = editorViewRef.current;
    if (editorView) {
      const view = new EditorView(editorView, {
        state,
        nodeViews: {
          paragraph(node, view, getPos, decorations) {
            const paragraphView = new ReactNodeView(
              node,
              view,
              getPos,
              decorations,
              Paragraph
            );
            const { nodeView, portal } = paragraphView.init();
            handleCreatePortal(portal);
            return nodeView;
          }
        },
        dispatchTransaction(transaction) {
          const newState = view.state.apply(transaction);
          handleChange(newState.doc.toJSON());
          view.updateState(newState);
        }
      });
    }
  }, [state, handleChange, handleCreatePortal]);

  return (
    <Box rounded="md" borderColor="gray.100" borderWidth="1px" p={4}>
      <div ref={editorViewRef}></div>
    </Box>
  );
};

const Paragraph: React.FC = ({ children }) => {
  const context = useReactNodeView();
  console.log(context);
  return (
    <Box bg="red.100" fontSize="lg">
      {children}
    </Box>
  );
};

export default ProseMirrorWrapper;
