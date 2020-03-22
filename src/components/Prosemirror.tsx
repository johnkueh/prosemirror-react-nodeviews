import { Box } from "@chakra-ui/core";
import { baseKeymap } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { schema } from "../lib/prosemirror-schema";
import Blockquote from "./Blockquote";
import CodeBlock from "./CodeBlock";
import Heading from "./Heading";
// import ImageView from "./ImageView";
import Image from "./Image";
import Paragraph from "./Paragraph";
import { createReactNodeView } from "./ReactNodeView";
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
  const { createPortal, destroyPortal } = useReactNodeViewPortals();
  const editorViewRef = useRef(null);

  const state = useMemo(() => {
    const doc = schema.nodeFromJSON(defaultValue);
    return EditorState.create({
      doc,
      plugins: [
        history(),
        keymap({ "Mod-z": undo, "Mod-y": redo, "Shift-Mod-z": redo }),
        keymap(baseKeymap)
      ]
    });
  }, [defaultValue]);

  const createPortalCallback = useCallback(createPortal, []);
  const destroyPortalCallback = useCallback(destroyPortal, []);
  const onChangeCallback = useCallback(onChange, []);
  const createEditorView = useCallback(
    editorViewDOM => {
      const portalContext = {
        createPortal: createPortalCallback,
        destroyPortal: destroyPortalCallback
      };
      const view = new EditorView(editorViewDOM, {
        state,
        nodeViews: {
          blockquote(node, view, getPos, decorations) {
            return createReactNodeView({
              node,
              view,
              getPos,
              decorations,
              portalContext,
              component: Blockquote
            });
          },
          heading(node, view, getPos, decorations) {
            return createReactNodeView({
              node,
              view,
              getPos,
              decorations,
              portalContext,
              component: Heading
            });
          },
          paragraph(node, view, getPos, decorations) {
            return createReactNodeView({
              node,
              view,
              getPos,
              decorations,
              portalContext,
              component: Paragraph
            });
          },
          code_block(node, view, getPos, decorations) {
            return createReactNodeView({
              node,
              view,
              getPos,
              decorations,
              portalContext,
              component: CodeBlock
            });
          },
          image(node, view, getPos, decorations) {
            return createReactNodeView({
              node,
              view,
              getPos,
              decorations,
              portalContext,
              component: Image
            });
            // return new ImageView(node, view, getPos);
          }
        },
        dispatchTransaction(transaction) {
          const newState = view.state.apply(transaction);
          onChangeCallback(newState.doc.toJSON());
          view.updateState(newState);
        }
      });
    },
    [state, onChangeCallback, createPortalCallback, destroyPortalCallback]
  );

  useEffect(() => {
    const editorViewDOM = editorViewRef.current;
    if (editorViewDOM) {
      createEditorView(editorViewDOM);
    }
  }, [createEditorView]);

  return (
    <Box rounded="md" borderColor="gray.100" borderWidth="1px" p={4}>
      <div ref={editorViewRef}></div>
    </Box>
  );
};

export default ProseMirrorWrapper;
