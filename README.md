# ProseMirror React NodeViews

This is an example repo of how to use React FC components as NodeViews for ProseMirror

![Screenshot](https://i.imgur.com/iRkNpJr.png)

How to use:

### Wrap your root component with `ReactNodeViewPortalsProvider`

Lets use React portals to preserve your app context (css-in-js, data, etc) when the NodeViews are rendered. `ReactNodeViewPortalsProvider` is a convenient way to help you with this.

```tsx
import { createReactNodeView } from "./ReactNodeView";
import ReactNodeViewPortalsProvider from "./ReactNodeViewPortals";

const App: React.FC<Props> = props => {
  return (
    <ReactNodeViewPortalsProvider>
      <App {...props} />
    </ReactNodeViewPortalsProvider>
  );
};

export default App;
```

### Loading ProseMirror with React components

This is how you initialize your ProseMirror editor

```tsx
import React from "react";
import { useReactNodeViewPortals } from "./ReactNodeViewPortals";

const ProseMirror: React.FC<Props> = () => {
  const { createPortal } = useReactNodeViewPortals();
  const editorViewRef = useRef(null);

  const handleCreatePortal = useCallback(createPortal, []);
  const state = useMemo(() => {
    const doc = schema.nodeFromJSON(YOUR_PROSEMIRROR_SCHEMA);
    return EditorState.create({
      doc,
      plugins: [
        history(),
        keymap({ "Mod-z": undo, "Mod-y": redo }),
        keymap(baseKeymap)
      ]
    });
  }, []);

  const createEditorView = useCallback(
    editorViewDOM => {
      const view = new EditorView(editorViewDOM, {
        state,
        nodeViews: {
          heading(node, view, getPos, decorations) {
            return createReactNodeView({
              node,
              view,
              getPos,
              decorations,
              component: Heading,
              onCreatePortal: handleCreatePortal
            });
          },
          paragraph(node, view, getPos, decorations) {
            return createReactNodeView({
              node,
              view,
              getPos,
              decorations,
              component: Paragraph,
              onCreatePortal: handleCreatePortal
            });
          }
        },
        dispatchTransaction(transaction) {
          const newState = view.state.apply(transaction);
          handleChange(newState.doc.toJSON());
          view.updateState(newState);
        }
      });
    },
    [state, handleChange, handleCreatePortal]
  );

  useEffect(() => {
    const editorViewDOM = editorViewRef.current;
    if (editorViewDOM) {
      createEditorView(editorViewDOM);
    }
  }, [createEditorView]);

  return <div ref={editorViewRef}></div>;
};

export default ProseMirror;
```

### Getting node props within your React components

Each of the React components have been wrapped with a context provider before sending it through the portal, so its easy to access the nodeview's props:

```tsx
import { Heading } from "@chakra-ui/core";
import React from "react";
import { useReactNodeView } from "./ReactNodeView";

const HeadingBlock: React.FC = ({ children }) => {
  const context = useReactNodeView();
  // node: Node; view: EditorView; getPos: () => number; decorations: Decorations[]
  const { node, view, getPos, decorations } = context;
  console.log(context);
  return <Heading>{children}</Heading>;
};

export default HeadingBlock;
```
