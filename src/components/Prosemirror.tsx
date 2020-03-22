import { Box } from "@chakra-ui/core";
import { baseKeymap } from "prosemirror-commands";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef
} from "react";
import { buildKeymap } from "../lib/prosemirror-keymap";
import { schema } from "../lib/prosemirror-schema";
import Blockquote from "./Blockquote";
import CodeBlock from "./CodeBlock";
import Heading from "./Heading";
// import ImageView from "./ImageView";
import Image from "./Image";
import Paragraph from "./Paragraph";
import ProseMirrorCSS from "./ProseMirrorCSS";
import ProseMirrorToolbar from "./ProseMirrorToolbar";
import { createReactNodeView } from "./ReactNodeView";
import ReactNodeViewPortalsProvider, {
  useReactNodeViewPortals
} from "./ReactNodeViewPortals";

interface Props {
  defaultValue: any;
  onChange: any;
}

const ProseMirrorContext = React.createContext<
  Partial<{
    schema: Schema;
    editorView: EditorView;
  }>
>({});

const ProseMirrorWrapper: React.FC<Props> = props => {
  return (
    <ReactNodeViewPortalsProvider>
      <ProseMirror {...props} />
    </ReactNodeViewPortalsProvider>
  );
};

const ProseMirror: React.FC<Props> = ({ defaultValue, onChange }) => {
  const { createPortal, destroyPortal } = useReactNodeViewPortals();
  const editorViewDOMref = useRef(null);
  const editorViewRef = useRef<any>(null);

  const state = useMemo(() => {
    const doc = schema.nodeFromJSON(defaultValue);
    return EditorState.create({
      doc,
      plugins: [
        history(),
        keymap(buildKeymap(schema)),
        keymap(baseKeymap),
        gapCursor(),
        dropCursor()
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
      editorViewRef.current = view;
    },
    [state, onChangeCallback, createPortalCallback, destroyPortalCallback]
  );

  useEffect(() => {
    const editorViewDOM = editorViewDOMref.current;
    if (editorViewDOM) {
      createEditorView(editorViewDOM);
    }
  }, [createEditorView]);

  return (
    <ProseMirrorContext.Provider
      value={{
        schema,
        editorView: editorViewRef.current
      }}
    >
      <Box rounded="md" borderColor="gray.100" borderWidth="1px" p={4}>
        <ProseMirrorCSS />
        <ProseMirrorToolbar />
        <div ref={editorViewDOMref} />
      </Box>
    </ProseMirrorContext.Provider>
  );
};

export const useProseMirror = () => useContext(ProseMirrorContext);
export default ProseMirrorWrapper;
