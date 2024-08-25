import { useCallback, useRef, useState } from "react";
import Billboard from "../components/Billboard";
import MovieList from "../components/MovieList";
import NavBar from "../components/Navbar";
import useMoviesList from "../hooks/useMoviesList";
import LoadingCards from "../components/LoadingCards";

export default function BrowsePage() {
  const [offset, setOffset] = useState(0);
  const { data, loading, error } = useMoviesList(offset);
  // console.log({ data, loading, error });

  const observer = useRef<null | IntersectionObserver>(null); //useRef is used to persist this reference across re-renders

  const lastElementRef = useCallback((node: HTMLDivElement) => { //just like memo for function, to prevent unnecessary calls
    if(loading) return; // If data is loading, do not set up the observer

    // Disconnect the previous observer before creating a new one
    if(observer.current) observer.current.disconnect();

     // Create a new Intersection Observer
    observer.current = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting) {//always this
        setOffset(offset + 12) // sometimes might, not work
        // setOffset(prevOffset => prevOffset + 12)
        console.log("intersecting");
      }
    });

    // If there is a valid node, observe it
    if(node) observer.current.observe(node);
  }, [loading]);

  return (
    <div>
      <NavBar />
      <Billboard />
      <div className="pb-5">
        {error && <p>{error}</p>}
        {data && <MovieList movies={data} lastElementRef={lastElementRef}/>}
        {loading ? <LoadingCards/> : null }
      </div>
    </div>
  );
}
