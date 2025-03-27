import LoadingGif from '../images/loading.gif';

/**
 * Loader component
 *
 * A simple loading spinner displayed during asynchronous operations like data fetching.
 * Uses a custom loading GIF as a visual indicator.
 */
const Loader = () => {
  return (
    <div className="loader">
      <div className="loader__img">
        <img src={LoadingGif} alt="Loading..." />
      </div>
    </div>
  );
};

export default Loader;
