import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase/config';;
import { 
  signInWithPopup, 
  GoogleAuthProvider,
} from 'firebase/auth';

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
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to EcoFlow</h1>
      <p className="text-xl mb-8">
        Store your debate flows digitally and help save the environment!
      </p>
      {!user && (
        <button
          onClick={loginWithGoogle}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600"
        >
          Get Started
        </button> 
      )}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          title="Digital Storage"
          description="Upload and organize your debate flows in one secure location"
        />
        <FeatureCard
          title="Easy Access"
          description="Access your flows anytime, anywhere, from any device"
        />
        <FeatureCard
          title="Environmental Impact"
          description="Track your contribution to saving trees and reducing paper waste"
        />
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
