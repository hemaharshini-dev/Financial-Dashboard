import InsightsPanel from '../components/insights/InsightsPanel';
import { SkeletonChart } from '../components/ui/Skeleton';
import { useState, useEffect } from 'react';

export default function Insights() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <SkeletonChart key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => <SkeletonChart key={i} />)}
      </div>
    </div>
  );

  return <InsightsPanel />;
}
