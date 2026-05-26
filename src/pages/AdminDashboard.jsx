import React, { useState, useEffect } from 'react';
import { getAllQueues, createQueue, getQueueTokens, callNextToken, skipToken } from '../services/api';

const AdminDashboard = () => {
  const [queues, setQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQueue, setNewQueue] = useState({ name: '', location: '', avgServiceTime: 5 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchQueues();
  }, []);

  useEffect(() => {
    if (selectedQueue) {
      fetchTokens(selectedQueue.id);
      // Auto refresh tokens every 10 seconds
      const interval = setInterval(() => fetchTokens(selectedQueue.id), 10000);
      return () => clearInterval(interval);
    }
  }, [selectedQueue]);

  const fetchQueues = async () => {
    try {
      const res = await getAllQueues();
      setQueues(res.data);
      if (res.data.length > 0) setSelectedQueue(res.data[0]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTokens = async (queueId) => {
    try {
      const res = await getQueueTokens(queueId);
      setTokens(res.data);
    } catch (err) {
      console.error('Tokens fetch failed');
    }
  };

  const handleCreateQueue = async (e) => {
    e.preventDefault();
    try {
      const res = await createQueue(newQueue);
      setQueues([...queues, res.data]);
      setShowCreateForm(false);
      setNewQueue({ name: '', location: '', avgServiceTime: 5 });
      showMessage('Queue created successfully!');
    } catch (err) {
      showMessage('Failed to create queue.');
    }
  };

  const handleCallNext = async () => {
    try {
      const res = await callNextToken(selectedQueue.id);
      showMessage(res.data);
      fetchTokens(selectedQueue.id);
      fetchQueues();
    } catch (err) {
      showMessage('Failed to call next token.');
    }
  };

  const handleSkip = async (tokenId) => {
    try {
      await skipToken(tokenId);
      showMessage('Token skipped.');
      fetchTokens(selectedQueue.id);
    } catch (err) {
      showMessage('Failed to skip token.');
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const getStatusBadge = (status) => {
    const cls = { WAITING: 'badge-waiting', SERVING: 'badge-serving', COMPLETED: 'badge-completed', SKIPPED: 'badge-skipped' };
    return <span className={cls[status] || 'badge-completed'}>{status}</span>;
  };

  const waitingTokens = tokens.filter(t => t.status === 'WAITING');
  const servingToken = tokens.find(t => t.status === 'SERVING');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage queues and tokens</p>
          </div>
          <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
            + Create Queue
          </button>
        </div>

        {/* Message toast */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm mb-6">
            {message}
          </div>
        )}

        {/* Create Queue form */}
        {showCreateForm && (
          <div className="card mb-6 border-2 border-blue-100">
            <h3 className="font-semibold text-gray-800 mb-4">New Queue</h3>
            <form onSubmit={handleCreateQueue} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text" placeholder="Queue name (e.g. Clinic Queue)"
                value={newQueue.name} onChange={e => setNewQueue({...newQueue, name: e.target.value})}
                className="input-field" required
              />
              <input
                type="text" placeholder="Location (optional)"
                value={newQueue.location} onChange={e => setNewQueue({...newQueue, location: e.target.value})}
                className="input-field"
              />
              <div className="flex gap-2">
                <input
                  type="number" placeholder="Avg time (mins)" min={1} max={60}
                  value={newQueue.avgServiceTime}
                  onChange={e => setNewQueue({...newQueue, avgServiceTime: parseInt(e.target.value)})}
                  className="input-field"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">Create</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Queue selector sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="font-semibold text-gray-700 text-sm mb-3 uppercase tracking-wide">Your Queues</h3>
              {queues.length === 0 ? (
                <p className="text-gray-400 text-sm">No queues yet. Create one!</p>
              ) : (
                <div className="space-y-2">
                  {queues.map(q => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQueue(q)}
                      className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                        selectedQueue?.id === q.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="font-medium">{q.name}</div>
                      <div className={`text-xs mt-0.5 ${selectedQueue?.id === q.id ? 'text-blue-200' : 'text-gray-400'}`}>
                        {q.waitingCount} waiting
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main panel */}
          <div className="lg:col-span-3 space-y-4">
            {selectedQueue ? (
              <>
                {/* Queue stats + control */}
                <div className="card">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedQueue.name}</h2>
                      <p className="text-gray-500 text-sm">{selectedQueue.location || 'No location set'}</p>
                    </div>
                    <button
                      onClick={handleCallNext}
                      disabled={waitingTokens.length === 0}
                      className="btn-primary disabled:opacity-40"
                    >
                      📣 Call Next Token
                    </button>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-600">{waitingTokens.length}</div>
                      <div className="text-xs text-gray-500">Waiting</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {servingToken ? servingToken.tokenNumber : '—'}
                      </div>
                      <div className="text-xs text-gray-500">Serving now</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">{tokens.filter(t => t.status === 'COMPLETED').length}</div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                  </div>
                </div>

                {/* Tokens table */}
                <div className="card">
                  <h3 className="font-semibold text-gray-800 mb-4">All Tokens</h3>
                  {tokens.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">No tokens yet. Share the queue with customers!</p>
                  ) : (
                    <div className="overflow-x-auto -mx-6 px-6">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-2 px-2 text-gray-500 font-medium">Token</th>
                            <th className="text-left py-2 px-2 text-gray-500 font-medium">Status</th>
                            <th className="text-right py-2 px-2 text-gray-500 font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tokens.map(token => (
                            <tr key={token.id} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="py-3 px-2 font-bold text-blue-600">{token.tokenNumber}</td>
                              <td className="py-3 px-2">{getStatusBadge(token.status)}</td>
                              <td className="py-3 px-2 text-right">
                                {token.status === 'WAITING' && (
                                  <button
                                    onClick={() => handleSkip(token.id)}
                                    className="text-xs text-red-600 hover:underline"
                                  >
                                    Skip
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="card text-center py-12">
                <p className="text-gray-400">Select a queue to manage it.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
