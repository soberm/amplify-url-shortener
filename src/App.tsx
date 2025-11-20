import { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import './styles/index.css';

import { UrlType, UrlShortenerProps } from './types';
import { UrlInput } from './components/UrlInput';
import { UrlCard } from './components/UrlCard';
import { LandingPage } from './components/LandingPage';
import outputs from '../amplify_outputs.json';
import type { Schema } from '../amplify/data/resource';

type Client = ReturnType<typeof generateClient<Schema>>;
let client: Client;

function App() {
  const [configured, setConfigured] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      Amplify.configure(outputs);
      client = generateClient<Schema>();
      setConfigured(true);
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  if (!configured) {
    return (
      <div className="loading">
        Loading configuration...
      </div>
    );
  }

  if (!showAuth) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <UrlShortener signOut={signOut} user={user} />
      )}
    </Authenticator>
  );
}

function UrlShortener({ signOut }: UrlShortenerProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [urls, setUrls] = useState<UrlType[]>([]);
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUrls();
    loadApiEndpoint();
  }, []);

  const loadApiEndpoint = async () => {
    try {
      const endpoint = outputs.custom?.API?.['URL Shortener API']?.endpoint;
      setApiEndpoint(endpoint);
    } catch (error) {
      console.error('Failed to load API endpoint:', error);
    }
  };

  const fetchUrls = async () => {
    try {
      const result = await client.models.Url.list();
      setUrls(result.data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  const shortenUrl = async () => {
    if (!originalUrl.trim()) return;
    
    setIsLoading(true);
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      
      const response = await fetch(`${apiEndpoint}shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ originalUrl })
      });
      
      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }
      
      const result = await response.json();
      
      // Save to GraphQL after getting short code from API
      await client.models.Url.create({
        shortCode: result.shortCode,
        originalUrl: result.originalUrl,
        createdAt: new Date().toISOString()
      });
      
      setOriginalUrl('');
      fetchUrls();
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="content">
        {/* Header */}
        <div className="card">
          <div className="flex-between">
            <h1 className="title">
              🔗 URL Shortener
            </h1>
            <button onClick={signOut} className="btn btn-secondary">
              Sign Out
            </button>
          </div>
        </div>

        {/* URL Input */}
        <UrlInput
          value={originalUrl}
          onChange={setOriginalUrl}
          onSubmit={shortenUrl}
          isLoading={isLoading}
        />

        {/* URLs List */}
        <div className="card">
          <h2 className="subtitle">
            Your Shortened URLs ({urls.length})
          </h2>
          
          {urls.length === 0 ? (
            <div className="empty-state">
              No URLs shortened yet. Create your first one above! 🚀
            </div>
          ) : (
            <div className="flex-column flex-gap-lg">
              {urls.map((url) => (
                <UrlCard 
                  key={url.id} 
                  url={url} 
                  apiEndpoint={apiEndpoint} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
