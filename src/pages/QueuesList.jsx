import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllQueues, joinQueue } from '../services/api';

const QueuesList = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQueues();
  }, []);

  const fetchQueues = async () => {
    try {
      const res = await getAllQueues();
      setQueues(res.data);
    } catch (err) {
      setError('Could not load queues. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (queueId) => {
    setJoiningId(queueId);
    try {
      const res = await joinQueue(queueId);
      // Token got — redirect to token status page
      navigate(`/my-token/${res.data.id}`, { state: { tokenData: res.data } });
    } catch (err) {
      alert(err.response?.data?.message || 'Could not join queue.');
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading queues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Available Queues</h1>
          <p className="text-gray-500 mt-1">Select a queue to get your token</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {queues.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">🏖️</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No queues available</h3>
            <p className="text-gray-500 text-sm">Check back later or ask an admin to create a queue.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {queues.map(queue => (
              <div key={queue.id} className="card hover:shadow-md transition-shadow">

                {/* Queue header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{queue.name}</h3>
                    {queue.location && (
                      <p className="text-gray-500 text-sm mt-0.5">📍 {queue.location}</p>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    queue.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {queue.isActive ? 'Open' : 'Closed'}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{queue.waitingCount}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Waiting</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-gray-700">
                      {queue.waitingCount * queue.avgServiceTime}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">Est. mins</div>
                  </div>
                </div>

                {/* Current serving */}
                <div className="text-xs text-gray-500 mb-4">
                  Now serving:{' '}
                  <span className="font-semibold text-green-600">
                    {queue.currentServing === 'None' ? 'Not started' : queue.currentServing}
                  </span>
                </div>

                {/* Join button */}
                <button
                  onClick={() => handleJoin(queue.id)}
                  // disabled={joiningId === queue.id || !queue.isActive}
                  disabled={joiningId === queue.id}
                  className="btn-primary w-full"
                >
                  {joiningId === queue.id ? 'Joining...' : 'Get Token'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueuesList;
