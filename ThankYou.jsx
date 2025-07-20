import { Link } from 'react-router-dom';

export default function ThankYou() {
  return (
    <div>
      <h1>Thank You for Your Submission!</h1>
      <p>Your concern has been received. We appreciate your effort in helping improve your community.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}
