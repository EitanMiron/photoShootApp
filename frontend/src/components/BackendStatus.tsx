import { useState, useEffect } from 'react';

const BackendStatus: React.FC = () => {
  const [isBackendRunning, setIsBackendRunning] = useState<boolean | null>(null);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setIsBackendRunning(response.ok);
      } catch (error) {
        setIsBackendRunning(false);
      }
    };

    checkBackendStatus();
  }, []);

  if (isBackendRunning === null) {
    return null; // Don't show anything while checking
  }

  if (!isBackendRunning) {
    return (
      <div className="backend-warning">
        <div className="backend-warning-content">
          <h3>⚠️ Backend Server Not Running</h3>
          <p>
            The backend server at <code>http://localhost:5000</code> is not running.
            Authentication and data features will not work until the backend is started.
          </p>
          <p>
            <strong>To start the backend:</strong>
          </p>
          <ol>
            <li>Navigate to the <code>backend</code> directory</li>
            <li>Run <code>npm install</code> (if not done already)</li>
            <li>Run <code>npm start</code> or <code>npm run dev</code></li>
          </ol>
        </div>
      </div>
    );
  }

  return null;
};

export default BackendStatus; 