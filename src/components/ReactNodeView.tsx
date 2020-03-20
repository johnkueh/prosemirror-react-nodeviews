import { Node } from "prosemirror-model";
import { Decoration, EditorView, NodeView } from "prosemirror-view";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

type TGetPos = boolean | (() => number);

class ReactNodeView implements NodeView {
  componentRef: React.RefObject<React.FC>;
  dom?: HTMLElement;
  contentDOM?: HTMLElement;
  component: React.FC<any>;
  node: Node;
  view: EditorView;
  getPos: TGetPos;
  decorations: Decoration[];

  constructor(
    node: Node,
    view: EditorView,
    getPos: TGetPos,
    decorations: Decoration[],
    component: React.FC<any>
  ) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.decorations = decorations;
    this.componentRef = React.createRef();
    this.component = component;
  }

  init() {
    this.dom = document.createElement("div");
    this.contentDOM = document.createElement("div");
    this.dom.classList.add("ProseMirror__dom");
    this.contentDOM.classList.add("ProseMirror__contentDOM");

    this.dom.appendChild(this.contentDOM);

    const Component: React.FC<{
      node: Node;
      view: EditorView;
      getPos: TGetPos;
      decorations: Decoration[];
    }> = props => {
      const componentRef = useRef<HTMLElement>(null);
      useEffect(() => {
        const componentDOM = componentRef.current;
        if (componentDOM != null && this.contentDOM != null) {
          componentDOM.appendChild(this.contentDOM);
        }
      }, [componentRef]);

      return <this.component ref={componentRef} {...props} />;
    };

    return {
      nodeView: this,
      portal: ReactDOM.createPortal(
        <Component
          node={this.node}
          view={this.view}
          getPos={this.getPos}
          decorations={this.decorations}
        />,
        this.dom
      )
    };
  }

  update(node: Node) {
    return true;
  }

  destroy() {
    if (this.dom != null) {
      ReactDOM.unmountComponentAtNode(this.dom);
    }
    this.dom = undefined;
    this.contentDOM = undefined;
  }
}

export default ReactNodeView;
