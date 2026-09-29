import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Play,
  Sparkles,
  Code,
  Database,
  Calculator,
  Coffee,
  Terminal,
  MessageSquare,
  Shield,
  Award,
} from 'lucide-react';
import { PreparationCategory } from '../../types';
import { StorageService } from '../../services/storage';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';

export const PlacementPreparation: React.FC = () => {
  const [categories, setCategories] = useState<PreparationCategory[]>(() =>
    StorageService.getPreparationCategories()
  );
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || 'cat-dsa');
  const [practiceModalCategory, setPracticeModalCategory] = useState<PreparationCategory | null>(null);

  const selectedCategory = categories.find((c) => c.id === activeCategory) || categories[0];

  const handleToggleTopic = (categoryId: string, topicId: string) => {
    const updated = StorageService.toggleTopicCompletion(categoryId, topicId);
    setCategories([...updated]);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Binary':
        return Code;
      case 'Database':
        return Database;
      case 'Calculator':
        return Calculator;
      case 'Coffee':
        return Coffee;
      case 'Terminal':
        return Terminal;
      case 'MessageSquare':
        return MessageSquare;
      case 'Shield':
        return Shield;
      default:
        return Award;
    }
  };

  const getPracticeContent = (catName: string) => {
    if (catName.includes('DSA')) {
      return [
        {
          title: 'Two Pointer Technique (Arrays)',
          desc: 'Sort array if needed. Maintain left = 0, right = n-1. Adjust pointers based on sum.',
          code: 'while (left < right) {\n  let sum = arr[left] + arr[right];\n  if (sum === target) return [left, right];\n  else if (sum < target) left++;\n  else right--;\n}',
        },
        {
          title: 'Cycle Detection in Linked List',
          desc: 'Floyd’s Tortoise and Hare algorithm with slow (1 step) and fast (2 steps) pointers.',
          code: 'let slow = head, fast = head;\nwhile (fast && fast.next) {\n  slow = slow.next;\n  fast = fast.next.next;\n  if (slow === fast) return true; // Cycle detected\n}',
        },
      ];
    }
    if (catName.includes('SQL')) {
      return [
        {
          title: 'Find 2nd Highest Salary in Employee Table',
          desc: 'Using subquery and MAX or LIMIT OFFSET',
          code: 'SELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (SELECT MAX(salary) FROM Employee);',
        },
        {
          title: 'Inner Join with Group By and Having',
          desc: 'Find departments having more than 5 placed students',
          code: 'SELECT d.name, COUNT(s.id) AS placed_count\nFROM departments d\nJOIN students s ON d.id = s.dept_id\nWHERE s.status = "Placed"\nGROUP BY d.name\nHAVING COUNT(s.id) > 5;',
        },
      ];
    }
    return [
      {
        title: 'Core Interview Framework',
        desc: 'Structure every technical answer: 1. Clarifying questions, 2. Brute-force approach, 3. Optimal approach with space/time complexity, 4. Clean implementation.',
        code: '// Interviewer Tip: Always state Big-O complexity before writing code.',
      },
      {
        title: 'STAR Behavioral Framework',
        desc: 'Situation (Context), Task (Challenge), Action (Your steps), Result (Quantifiable outcome).',
        code: '// Example: Increased model prediction accuracy by 14% while reducing latency by 200ms.',
      },
    ];
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Placement Preparation & Skill Trackers
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete high-frequency company interview topics across DSA, SQL, Aptitude & Soft Skills
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interactive LocalStorage Checklist</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.iconName);
          const total = cat.topics.length;
          const completed = cat.topics.filter((t) => t.completed).length;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
          const isSelected = cat.id === activeCategory;

          return (
            <div
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-xl ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{pct}%</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">{cat.name}</h4>
                <p className="text-[11px] text-slate-500 mb-3">
                  {completed} of {total} topics completed
                </p>
              </div>

              <ProgressBar
                percentage={pct}
                showValue={false}
                height="sm"
                color={pct >= 75 ? 'emerald' : pct >= 40 ? 'indigo' : 'amber'}
              />
            </div>
          );
        })}
      </div>

      {selectedCategory && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{selectedCategory.name}</h3>
                <span className="text-xs text-slate-400">
                  ({selectedCategory.topics.filter((t) => t.completed).length}/
                  {selectedCategory.topics.length} Done)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{selectedCategory.description}</p>
            </div>

            <button
              onClick={() => setPracticeModalCategory(selectedCategory)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Practice Questions & Code</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {selectedCategory.topics.map((topic, idx) => (
              <div
                key={topic.id}
                onClick={() => handleToggleTopic(selectedCategory.id, topic.id)}
                className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="text-slate-400 group-hover:text-indigo-600 transition-colors"
                    aria-label={topic.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {topic.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </button>
                  <span
                    className={`text-xs font-medium ${
                      topic.completed
                        ? 'line-through text-slate-400'
                        : 'text-slate-800 group-hover:text-indigo-900'
                    }`}
                  >
                    {idx + 1}. {topic.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      topic.difficulty === 'Easy'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : topic.difficulty === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {topic.difficulty}
                  </span>
                  <span className="text-[11px] text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {topic.completed ? 'Mark Pending' : 'Mark Done'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {practiceModalCategory && (
        <Modal
          isOpen={!!practiceModalCategory}
          onClose={() => setPracticeModalCategory(null)}
          title={`Practice & Cheat Sheet: ${practiceModalCategory.name}`}
          subtitle="Key problem templates, formulas, and interview tips"
          maxWidth="2xl"
          footer={
            <button
              onClick={() => setPracticeModalCategory(null)}
              className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Done Reviewing
            </button>
          }
        >
          <div className="space-y-4 text-xs">
            {getPracticeContent(practiceModalCategory.name).map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                <p className="text-slate-600">{item.desc}</p>
                <pre className="p-3 bg-slate-900 text-indigo-300 rounded-lg font-mono text-[11px] overflow-x-auto">
                  {item.code}
                </pre>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};
