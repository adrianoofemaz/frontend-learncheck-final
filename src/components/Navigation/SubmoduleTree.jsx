import React from 'react';

const SubmoduleTree = ({ modules, activeSubmoduleId, onSelectSubmodule }) => {
  return (
    <div className="space-y-2">
      {modules && modules.map((module) => (
        <div key={module.id} className="space-y-1">
          <div className="text-sm font-semibold text-gray-900 px-3 py-2">
            {module.title}
          </div>
          {module.submodules && module. submodules.map((submodule) => (
            <button
              key={submodule. id}
              onClick={() => onSelectSubmodule(submodule.id)}
              className={`w-full text-left px-4 py-2 rounded transition ${
                activeSubmoduleId === submodule.id
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${submodule.isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {submodule.icon} {submodule.title}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SubmoduleTree;