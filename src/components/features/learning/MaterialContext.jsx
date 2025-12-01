/**
 * MaterialContent Component
 * Display tutorial content
 */

import React from 'react';
import Card from '../../common/Card';

const MaterialContent = ({ title, content, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {title && <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>}
      <div
        className="prose prose-sm max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Card>
  );
};

export default MaterialContent;