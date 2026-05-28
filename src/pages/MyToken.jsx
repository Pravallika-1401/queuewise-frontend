import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getTokenStatus } from '../services/api';

const MyToken = () => {
  const { tokenId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [tokenData, setTokenData] = useState(location.state?.tokenData || null);
  const [loading, setLoading] = useState(!location.state?.tokenData);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await getTokenStatus(tokenId);
      setTokenData(res.data);
    } catch (err) {
      console.error('Status fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [tokenId]);

  useEffect(() => {
    if (!tokenData) fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, [fetchStatus, tokenData]);

  const getStatusColor = (status) => {
    const map = {
      WAITING: 'bg-yellow-50 border-yellow-200',
      SERVING: 'bg-green-50 border-green-200',
      COMPLETED: 'bg-gray-50 border-gray-200',
      SKIPPED: 'bg-red-50 border-red-200',
    };
    return map[status] || 'bg-gray-50 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Token not found.</p>
          <button onClick={() => navigate('/queues')} className="btn-primary">Back to Queues</button>
        </div>
      </div>
    );
  }

  const isServing = tokenData.status === 'SERVING';
  const isDone = ['COMPLETED', 'SKIPPED'].includes(tokenData.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm mb-1">Queue</p>
          <h2 className="text-xl font-bold text-gray-900">{tokenData.queueName}</h2>
        </div>

        <div className={`card border-2 text-center py-10 mb-4 ${getStatusColor(tokenData.status)}`}>
          <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Your Token</p>
          <div className="text-7xl sm:text-8xl font-black text-blue-600 mb-4">
            {tokenData.tokenNumber}
          </div>
          <span className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full ${
            isServing ? 'bg-green-600 text-white' :
            isDone ? 'bg-gray-500 text-white' :
            'bg-yellow-400 text-yellow-900'
          }`}>
            {tokenData.status === 'WAITING' && '⏳ Waiting'}
            {tokenData.status === 'SERVING' && '🔔 Your turn!'}
            {tokenData.status === 'COMPLETED' && '✅ Done'}
            {tokenData.status === 'SKIPPED' && '⏭ Skipped'}
          </span>
          {isServing && (
            <div className="mt-6 p-4 bg-green-600 rounded-xl text-white">
              <p className="font-bold text-lg">Please proceed to the counter!</p>
              <p className="text-green-200 text-sm mt-1">Your token is being called now.</p>
            </div>
          )}
        </div>

        {tokenData.status === 'WAITING' && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="card text-center">
              <div className="text-3xl font-bold text-orange-500">{tokenData.peopleAhead}</div>
              <div className="text-xs text-gray-500 mt-1">People ahead</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-600">{tokenData.estimatedWaitMinutes}</div>
              <div className="text-xs text-gray-500 mt-1">Est. minutes</div>
            </div>
          </div>
        )}

        {tokenData.aiEstimate && tokenData.status === 'WAITING' && (
          <div className="card border border-purple-100 bg-purple-50 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">AI Wait Estimate</p>
                <p className="text-sm text-purple-900">{tokenData.aiEstimate}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-gray-400 mb-6">
          <span>Auto-refreshes every 15 seconds</span>
          <button onClick={fetchStatus} className="text-blue-500 hover:underline">Refresh now</button>
        </div>

        {isDone && (
          <button onClick={() => navigate('/queues')} className="btn-primary w-full">
            Join Another Queue
          </button>
        )}
      </div>
    </div>
  );
};

export default MyToken;