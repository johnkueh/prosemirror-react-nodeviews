import React, { ReactText, useContext, useReducer } from "react";

interface Props {}

const initialState = {};
const ReactNodeViewPortalsContext = React.createContext<{
  destroyPortal: (portal: any) => void;
  createPortal: (portal: any) => void;
  state: Partial<State>;
}>({
  destroyPortal: () => {},
  createPortal: () => {},
  state: {}
});

const ReactNodeViewPortalsProvider: React.FC<Props> = ({ children }) => {
  const [data, dispatch] = useReducer(reducer, initialState);

  return (
    <ReactNodeViewPortalsContext.Provider
      value={{
        destroyPortal: (portal: any) => {
          return dispatch({ type: "destroyPortal", key: portal.key! });
        },
        createPortal: (portal: any) => {
          return dispatch({ type: "createPortal", key: portal.key!, portal });
        },
        state: data
      }}
    >
      {children}
      {Object.values(data).map(obj => obj.portal)}
    </ReactNodeViewPortalsContext.Provider>
  );
};

type State = {
  [key: string]: any;
};

type Action =
  | {
      type: "createPortal";
      key: ReactText;
      portal: any;
    }
  | {
      type: "destroyPortal";
      key: ReactText;
    };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "createPortal":
      return {
        ...state,
        [action.key]: {
          portal: action.portal
        }
      };
    case "destroyPortal":
      const { [action.key]: omit, ...updatedState } = state;
      return updatedState;
    default:
      return state;
  }
}

export const useReactNodeViewPortals = () =>
  useContext(ReactNodeViewPortalsContext);

export default ReactNodeViewPortalsProvider;
