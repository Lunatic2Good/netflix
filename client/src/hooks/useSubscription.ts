import { useReducer } from "react";
import axios from "axios";
import Cookie from "universal-cookie";

const cookie = new Cookie();

export interface Subscription {
    id: string;
    name: string;
}

interface State {
  data: Subscription | null;
  error: string | null;
  loading: boolean;
}

const initialState: State = {
  data: null,
  error: null,
  loading: true,
};

enum ActionType {
  LOADING,
  SUCCESS,
  FAILED,
}

type Action =
  | { type: ActionType.LOADING }
  | { type: ActionType.SUCCESS; payload: Subscription }
  | { type: ActionType.FAILED; payload: string };

const reducer = (_: State, action: Action): State => {
  switch (action.type) {
    case ActionType.LOADING:
      return {
        data: null,
        loading: true,
        error: null,
      };
    case ActionType.FAILED:
      return {
        loading: false,
        error: action.payload,
        data: null,
      };
    case ActionType.SUCCESS:
      return {
        loading: false,
        error: null,
        data: action.payload,
      };
    default:
      return initialState;
  }
};

type UseSubscription = () => [{
    data: Subscription | null;
    loading: boolean;
    error: string | null;
}, () => Promise<Subscription>]

const useSubscription: UseSubscription = () => {
  const [{ data, loading, error }, dispatch] = useReducer(reducer, initialState);

  const fetchSubscription = async () => {
    const sessionToken = cookie.get("session_token");

    dispatch({type: ActionType.LOADING});
    try {
        const response = await axios.get(`http://localhost:3000/sub/subscription`, {
            headers: {
                ...(sessionToken) ? {Authorization: `Bearer ${sessionToken}`} : null
            }
        });
        // console.log(response);
        dispatch({ type: ActionType.SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        dispatch({type: ActionType.FAILED, payload: "Something went wrong"});
    }
  }

  return [{ data, loading, error }, fetchSubscription];
};

export default useSubscription;