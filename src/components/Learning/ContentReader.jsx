import React from 'react';

const ContentReader = ({ containerRef, submodule, isCompleted }) => {
  return (
    <div
      ref={containerRef}
      className="space-y-8 max-h-[calc(100vh-300px)] overflow-y-auto pr-4"
    >
      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-blue-600 pb-4 border-b-2 border-blue-200">
          {submodule. title}
        </h1>

        <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
          {submodule.content?. sections?.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {section.title}
              </h2>
              <p className="text-base leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Optional: Images/Visuals dari content */}
        {submodule.content?.visuals && (
          <div className="mt-12 space-y-6">
            {submodule.content.visuals.map((visual, idx) => (
              <div key={idx} className="flex justify-center">
                <img 
                  src={visual.url} 
                  alt={visual.alt}
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentReader;