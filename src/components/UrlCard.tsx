import React from 'react';
import { UrlType } from '../types';
import { copyToClipboard } from '../utils';

interface UrlCardProps {
  url: UrlType;
  apiEndpoint: string;
}

export const UrlCard: React.FC<UrlCardProps> = ({ url, apiEndpoint }) => {
  return (
    <div className="card-item">
      <div className="flex-between flex-gap-lg">
        <div className="url-meta">
          <div className="url-actions">
            <a
              href={`${apiEndpoint}${url.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="url-link"
            >
              {apiEndpoint}{url.shortCode}
            </a>
            <button
              onClick={() => copyToClipboard(`${apiEndpoint}${url.shortCode}`)}
              className="btn btn-small"
            >
              Copy
            </button>
          </div>
          <div 
            title={url.originalUrl}
            className="url-original"
          >
            → {url.originalUrl}
          </div>
          <div className="text-light">
            Created {url.createdAt && new Date(url.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
