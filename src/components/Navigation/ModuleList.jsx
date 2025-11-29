import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRightIcon, ChevronDownIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import mockTopics from '../../data/mockTopics';

const ModuleList = ({ onSelectModule }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedModules, setExpandedModules] = useState({ 1: true });
  const [expandedSubmodules, setExpandedSubmodules] = useState({ '1. 1': true });
  const [activeItem, setActiveItem] = useState('submodule-1. 1');

  const topic = mockTopics[0];

  const toggleModuleExpand = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const toggleSubmoduleExpand = (submoduleId, e) => {
    e.stopPropagation();
    setExpandedSubmodules(prev => ({
      ...prev,
      [submoduleId]: !prev[submoduleId],
    }));
  };

  const handleSubmoduleClick = (submodule) => {
    if (! submodule.isLocked) {
      setActiveItem(`submodule-${submodule.id}`);
      navigate('/material', {
        state: {
          submodule,
          quiz: submodule.quiz
        }
      });
    }
  };

  const handleQuizClick = (submodule, e) => {
    e.stopPropagation();
    if (! submodule.isLocked) {
      setActiveItem(`quiz-${submodule.id}`);
      navigate('/quiz-intro', {
        state: {
          submodule,
          quiz: submodule.quiz
        }
      });
    }
  };

  const renderQuizItem = (submodule, quizNumber) => {
    const isActive = activeItem === `quiz-${submodule.id}`;
    
    return (
      <div
        key={`quiz-${submodule.id}`}
        onClick={(e) => handleQuizClick(submodule, e)}
        className={`py-2 px-3 ml-12 rounded cursor-pointer transition-all flex items-center gap-2 ${
          submodule.isLocked 
            ? 'opacity-60 cursor-not-allowed' 
            : isActive 
              ?  'bg-blue-50 text-blue-600' 
              : 'hover:bg-gray-50 text-gray-600'
        }`}
      >
        <p className={`text-sm leading-snug ${isActive ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
          Quiz Submodul #{quizNumber}
        </p>
      </div>
    );
  };

  const renderSubmodule = (submodule, index) => {
    const isSubmoduleExpanded = expandedSubmodules[submodule. id];
    const quizNumber = index + 1;
    const isActive = activeItem === `submodule-${submodule.id}`;

    return (
      <div key={submodule. id}>
        <div
          onClick={() => handleSubmoduleClick(submodule)}
          className={`px-3 py-2 ml-4 rounded cursor-pointer transition-all flex items-center justify-between ${
            submodule.isLocked 
              ? 'opacity-60 cursor-not-allowed' 
              : isActive 
                ? 'bg-blue-50' 
                : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={(e) => toggleSubmoduleExpand(submodule. id, e)}
              className="p-0. 5 hover:bg-gray-200 rounded transition"
            >
              {isSubmoduleExpanded ? (
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <p className={`text-sm leading-snug truncate ${
              isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}>
              {submodule.title}
            </p>
          </div>
          {submodule.isLocked && (
            <LockClosedIcon className="w-5 h-5 text-orange-300 ml-2 flex-shrink-0" />
          )}
        </div>

        {isSubmoduleExpanded && renderQuizItem(submodule, quizNumber)}
      </div>
    );
  };

  const renderModule = (module) => {
    const isModuleExpanded = expandedModules[module. id];

    return (
      <div key={module.id} className="mb-1">
        <div
          onClick={() => toggleModuleExpand(module.id)}
          className="py-2 px-3 rounded cursor-pointer transition-all flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center gap-2 flex-1">
            {isModuleExpanded ? (
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
            )}
            <p className="text-sm font-semibold text-gray-900">
              {module. title}
            </p>
          </div>
        </div>

        {isModuleExpanded && module.submodules. length > 0 && (
          <div className="border-l-2 border-gray-200 ml-4">
            {module.submodules. map((sub, idx) => renderSubmodule(sub, idx))}
          </div>
        )}
      </div>
    );
  };

  if (! topic || !topic. modules) {
    return <div className="p-4 text-gray-500">Tidak ada modul tersedia</div>;
  }

  return (
    <div className="bg-white h-full">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Daftar Modul</h3>
      </div>

      <div className="p-3 overflow-y-auto space-y-1">
        {topic.modules.map(module => renderModule(module))}
      </div>  
    </div>
  );
};

export default ModuleList;