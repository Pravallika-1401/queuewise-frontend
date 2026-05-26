import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isLoggedIn } = useAuth();

  const features = [
    { icon: '🎫', title: 'Digital Tokens', desc: 'Get a token instantly, no physical slip needed.' },
    { icon: '📊', title: 'Live Queue Tracking', desc: 'See exactly how many people are ahead of you.' },
    { icon: '🤖', title: 'AI Wait Estimate', desc: 'Smart estimates powered by AI — not just simple math.' },
    { icon: '⚡', title: 'Admin Dashboard', desc: 'Call next, skip, and manage tokens in real time.' },
  ];

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-blue-500 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
            Smart Queue Management
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight">
            No more waiting <br className="hidden sm:block"/>in crowded lines
          </h1>
          <p className="text-blue-200 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            QueueWise gives customers a digital token and live wait time updates.
            Admins manage everything from one clean dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isLoggedIn() ? (
              <Link to="/queues" className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">
                View Queues →
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">
                  Get Started Free
                </Link>
                <Link to="/login" className="border border-blue-400 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { step: '1', title: 'Join the queue', desc: 'Register, pick a queue, and get your token instantly.' },
              { step: '2', title: 'Track live', desc: 'See people ahead and AI-powered wait time estimates.' },
              { step: '3', title: 'Get called', desc: 'Receive alert when your token is called. No waiting around.' },
            ].map(item => (
              <div key={item.step}>
                <div className="w-12 h-12 bg-blue-100 text-blue-700 text-xl font-black rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">Built for real businesses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map(f => (
              <div key={f.title} className="card flex gap-4">
                <div className="text-3xl">{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <p>QueueWise — Built with React, Spring Boot, MySQL & OpenAI</p>
      </footer>
    </div>
  );
};

export default Home;
