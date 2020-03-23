import { Node } from "prosemirror-model";
import { Decoration, EditorView, NodeView } from "prosemirror-view";
import React, { useContext, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import shortid from "shortid";
import { getComponent, registerComponent } from "../lib/prosemirror-registry";

interface IReactNodeViewContext {
  node: Node;
  view: EditorView;
  getPos: any;
  decorations: Decoration[];
}

const ReactNodeViewContext = React.createContext<
  Partial<IReactNodeViewContext>
>({
  node: undefined,
  view: undefined,
  getPos: undefined,
  decorations: undefined
});

class ReactNodeView implements NodeView {
  componentRef: React.RefObject<HTMLDivElement>;
  dom?: HTMLElement;
  portal?: React.ReactPortal;
  contentDOM?: HTMLElement;
  component: React.FC<any>;
  portalContext: PortalContext;
  node: Node;
  view: EditorView;
  getPos: any;
  decorations: Decoration[];

  constructor(
    node: Node,
    view: EditorView,
    getPos: any,
    decorations: Decoration[],
    component: React.FC<any>,
    portalContext: PortalContext
  ) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.decorations = decorations;
    this.component = component;
    this.portalContext = portalContext;
    this.componentRef = React.createRef();

    registerComponent(node.type.name, component);
  }

  init() {
    const { createPortal } = this.portalContext;

    this.dom = this.node.isInline
      ? document.createElement("span")
      : document.createElement("div");
    this.dom.classList.add("ProseMirror__dom");

    if (!this.node.isLeaf) {
      this.contentDOM = this.node.isInline
        ? document.createElement("span")
        : document.createElement("div");
      this.contentDOM.classList.add("ProseMirror__contentDOM");
      this.dom.appendChild(this.contentDOM);
    }

    this.portal = this.renderPortal(this.dom);
    createPortal(this.portal);

    return {
      nodeView: this
    };
  }

  renderPortal(container: HTMLElement) {
    const Component: React.FC = props => {
      const componentRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        const componentDOM = componentRef.current;
        if (componentDOM != null && this.contentDOM != null) {
          if (!this.node.isLeaf) {
            componentDOM.firstChild?.appendChild(this.contentDOM);
          }
        }
      }, [componentRef]);

      return (
        <div ref={componentRef} className="ProseMirror__reactComponent">
          <ReactNodeViewContext.Provider
            value={{
              node: this.node,
              view: this.view,
              getPos: this.getPos,
              decorations: this.decorations
            }}
          >
            <this.component {...props} />
          </ReactNodeViewContext.Provider>
        </div>
      );
    };

    const portal = ReactDOM.createPortal(
      <Component />,
      container,
      shortid.generate()
    );

    return portal;
  }

  destroy() {
    if (this.portal) {
      const { destroyPortal } = this.portalContext;
      destroyPortal(this.portal);
    }
    this.dom = undefined;
    this.contentDOM = undefined;
  }

  selectNode() {
    this.dom?.classList.add("ProseMirror-selectednode");
  }

  deselectNode() {
    this.dom?.classList.remove("ProseMirror-selectednode");
  }

  // https://discuss.prosemirror.net/t/draggable-and-nodeviews/955
  stopEvent(e: Event) {
    // console.log(e);
    return e.type === "mousedown" && !e.type.startsWith("drag");
  }

  setDomAttrs(node: Node, element: HTMLElement) {
    Object.keys(node.attrs || {}).forEach(attr => {
      element.setAttribute(attr, node.attrs[attr]);
    });
  }

  update(node: Node) {
    // Handle this properly. Refer to
    // https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/editor/editor-core/src/nodeviews/ReactNodeView.tsx

    if (this.dom && !this.node.sameMarkup(node)) {
      this.node = node;
      // this.dom.innerHTML = "";

      this.component = getComponent(node.type.name);
      const { createPortal, destroyPortal } = this.portalContext;
      const portal = this.renderPortal(this.dom);
      createPortal(portal);
      // if (this.portal) {
      // destroyPortal(this.portal);
      // this.portal = portal;
      // }
    }

    return true;
  }

  ignoreMutation() {
    return false;
  }
}

interface TCreateReactNodeView extends IReactNodeViewContext {
  component: React.FC<any>;
  portalContext: PortalContext;
}

interface PortalContext {
  createPortal: (portal: React.ReactPortal) => void;
  destroyPortal: (portal: React.ReactPortal) => void;
}

export const createReactNodeView = ({
  node,
  view,
  getPos,
  decorations,
  portalContext,
  component
}: TCreateReactNodeView) => {
  const reactNodeView = new ReactNodeView(
    node,
    view,
    getPos,
    decorations,
    component,
    portalContext
  );
  const { nodeView } = reactNodeView.init();

  return nodeView;
};
export const useReactNodeView = () => useContext(ReactNodeViewContext);
export default ReactNodeView;
