import { useEffect, useReducer } from "react";
import axios from "axios";
import { Movie } from "../types";

interface State {
  data: Movie | null;
  error: string | null;
  loading: boolean;
}

const initialState: State = {
  data: null,
  error: null,
  loading: false,
};

enum ActionType {
  Loading,
  Success,
  Failed,
}

type Action =
  | { type: ActionType.Loading }
  | { type: ActionType.Success; payload: Movie }
  | { type: ActionType.Failed; payload: string };

const reducer = (_: State, action: Action): State => {
  switch (action.type) {
    case ActionType.Loading:
      return {
        loading: true,
        error: null,
        data: null,
      };
    case ActionType.Failed:
      return {
        loading: false,
        error: action.payload,
        data: null,
      };
    case ActionType.Success:
      return {
        loading: false,
        error: null,
        data: action.payload,
      };
    default:
      return initialState;
  }
};

const useMovie = (id: string) => {
  const [{ data, loading, error }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchMovie();
  }, []);
  

  const fetchMovie = async () => {
    dispatch({type: ActionType.Loading});
    try {
        const response = await axios.get(`http://localhost:3000/movie/${id}`);
        // console.log(response);
        dispatch({type: ActionType.Success, payload: response.data});
    } catch (error) {
        dispatch({type: ActionType.Failed, payload: "Something went wrong"});
    }
  }

  return { data, loading, error };
};

export default useMovie;

//Loading
//{type: Loading}
//Error
//{type: Error, payload: string}
//Success
//{type: Success, payload: Movie[]}
