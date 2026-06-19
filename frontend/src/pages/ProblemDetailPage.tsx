import { useParams } from 'react-router-dom';
import { useProblemDetail } from '@/hooks/useProblems';
import { Difficulty } from 'lucide-react';

const ProblemDetailPage = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const { data: problem, isLoading, error } = useProblemDetail(idOrSlug);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="p-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading problem. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Description */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {problem.title}
          </h1>

          <div className="flex gap-2 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              problem.difficulty === 'EASY'
                ? 'text-green-600 bg-green-100 dark:bg-green-900/30'
                : problem.difficulty === 'MEDIUM'
                ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
                : 'text-red-600 bg-red-100 dark:bg-red-900/30'
            }`}>
              {problem.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {problem.acceptanceRate.toFixed(1)}% Acceptance
            </span>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: problem.description }} />
          </div>

          {problem.constraints && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Constraints
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: problem.constraints }} />
              </div>
            </div>
          )}

          {problem.topics.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {problem.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Code Editor - Phase 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="h-full flex items-center justify-center text-gray-600 dark:text-gray-400">
            <p>Code editor coming in Phase 2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;
