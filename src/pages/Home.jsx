import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase/config';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
} from 'firebase/auth';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Home component mounted");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user);
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  console.log("Rendering Home component");

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div>
        <Navbar user={user} />
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Inventory Manager</h1>
      <p className="text-xl mb-8">
        Manage your inventory efficiently and effectively!
      </p>
      {!user ? (
        <>
          <button
            onClick={loginWithGoogle}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600"
          >
            Get Started with Google
          </button>
          <p className="mt-4">
            Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link> 
          </p>
          <p className="mt-4">
            <Link to="/login" className="text-blue-500 hover:underline">login </Link>
          </p>
        </>
      ) : (
        <p className="mt-4">You are logged in as {user.email}</p>
      )}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          title="Organize Your Inventory"
          description="Upload and categorize your inventory items for easy access."
        />
        <FeatureCard
          title="Track Stock Levels"
          description="Monitor your stock levels and receive alerts for low inventory."
        />
        <FeatureCard
          title="Manage Suppliers"
          description="Keep track of your suppliers and their contact information."
        />
      </div>
    </div>
    </div>
    

  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default Home;
