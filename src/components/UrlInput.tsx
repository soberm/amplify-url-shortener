import React from 'react';

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ 
  value, 
  onChange, 
  onSubmit, 
  isLoading 
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="card">
      <h2 className="subtitle">
        Shorten a URL
      </h2>
      <div className="flex-input-group">
        <input
          type="url"
          placeholder="https://example.com/very-long-url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input"
        />
        <button
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="btn btn-primary"
        >
          {isLoading ? '...' : 'Shorten'}
        </button>
      </div>
    </div>
  );
};
