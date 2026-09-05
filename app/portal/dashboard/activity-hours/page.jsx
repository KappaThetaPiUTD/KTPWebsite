const hourEntries = [
  { activity: "LeetCode Workshop", date: "September 9, 2026", category: "Professional", hours: 2 },
  { activity: "Brotherhood Social", date: "September 23, 2026", category: "Brotherhood", hours: 2 },
  { activity: "Community Service Day", date: "August 30, 2026", category: "Service", hours: 3 },
  { activity: "Resume Review", date: "August 20, 2026", category: "Professional", hours: 1.5 },
];

export default function ActivityHoursPage() {
  const completedHours = hourEntries.reduce((total, entry) => total + entry.hours, 0);
  const requiredHours = 20;
  const progress = Math.min((completedHours / requiredHours) * 100, 100);

  return (
    <div>
      <h1 className="mt-2 text-3xl font-bold text-gray-950">Activity Hours</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
        Track your chapter involvement and progress toward this semester&apos;s activity-hour requirement.
      </p>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-600">Semester progress</p>
            <p className="mt-1 text-3xl font-bold text-gray-950">{completedHours} <span className="text-lg font-semibold text-gray-500">/ {requiredHours} hours</span></p>
          </div>
          <p className="text-sm font-semibold text-primary">{requiredHours - completedHours} hours remaining</p>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100" aria-label={`${completedHours} of ${requiredHours} hours complete`}>
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-950">Logged activity</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr><th className="px-6 py-4">Activity</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Category</th><th className="px-6 py-4 text-right">Hours</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {hourEntries.map((entry) => (
                  <tr key={`${entry.activity}-${entry.date}`} className="text-gray-700">
                    <td className="px-6 py-4 font-semibold text-gray-950">{entry.activity}</td><td className="px-6 py-4">{entry.date}</td><td className="px-6 py-4"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{entry.category}</span></td><td className="px-6 py-4 text-right font-bold text-gray-950">{entry.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
