/**
 * ErrorPage Component
 *
 * Displays a fallback UI when a route does not match any defined path.
 * Includes a message and a link to redirect the user back to the homepage.
 */

import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <section className="error-page">
      <div className="center">
        {/* Navigation button back to home */}
        <Link to="/" className="btn primary">
          Go Back Home
        </Link>

        {/* Not found message */}
        <h2>Page Not Found</h2>
      </div>
    </section>
  );
};

export default ErrorPage;
