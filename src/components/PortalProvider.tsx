import * as React from "react";
import {
  createPortal,
  unmountComponentAtNode,
  unstable_renderSubtreeIntoContainer
} from "react-dom";
import { EventDispatcher } from "./event-dispatcher";

export type PortalProviderProps = {
  render: (
    portalProviderAPI: PortalProviderAPI
  ) => React.ReactChild | JSX.Element | null;
};

export type Portals = Map<HTMLElement, React.ReactChild>;

export type PortalRendererState = {
  portals: Portals;
};

type MountedPortal = {
  children: () => React.ReactChild | null;
  hasReactContext: boolean;
};

export class PortalProviderAPI extends EventDispatcher {
  portals: Map<HTMLElement, MountedPortal> = new Map();
  context: any;

  setContext = (context: any) => {
    this.context = context;
  };

  render(
    children: () => React.ReactChild | JSX.Element | null,
    container: HTMLElement,
    hasReactContext: boolean = false
  ) {
    this.portals.set(container, { children, hasReactContext });
    unstable_renderSubtreeIntoContainer(
      this.context,
      children() as React.ReactElement<any>,
      container
    );
  }

  // TODO: until https://product-fabric.atlassian.net/browse/ED-5013
  // we (unfortunately) need to re-render to pass down any updated context.
  // selectively do this for nodeviews that opt-in via `hasReactContext`
  forceUpdate() {
    this.portals.forEach((portal, container) => {
      if (!portal.hasReactContext) {
        return;
      }

      unstable_renderSubtreeIntoContainer(
        this.context,
        portal.children() as React.ReactElement<any>,
        container
      );
    });
  }

  remove(container: HTMLElement) {
    this.portals.delete(container);
    unmountComponentAtNode(container);
  }
}

export class PortalProvider extends React.Component<PortalProviderProps> {
  portalProviderAPI: PortalProviderAPI;

  constructor(props: PortalProviderProps) {
    super(props);
    this.portalProviderAPI = new PortalProviderAPI();
  }

  render() {
    return this.props.render(this.portalProviderAPI);
  }

  componentDidUpdate() {
    this.portalProviderAPI.forceUpdate();
  }
}

export class PortalRenderer extends React.Component<
  { portalProviderAPI: PortalProviderAPI },
  PortalRendererState
> {
  constructor(props: { portalProviderAPI: PortalProviderAPI }) {
    super(props);
    props.portalProviderAPI.setContext(this);
    props.portalProviderAPI.on("update", this.handleUpdate);
    this.state = { portals: new Map() };
  }

  handleUpdate = (portals: Portals) => this.setState({ portals });

  render() {
    const { portals } = this.state;
    return (
      <>
        {Array.from(portals.entries()).map(([container, children]) =>
          createPortal(children, container)
        )}
      </>
    );
  }
}
