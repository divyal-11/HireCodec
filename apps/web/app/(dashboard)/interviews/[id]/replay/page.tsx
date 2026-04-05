'use client';

export default function ReplayPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-dash-text mb-4">Session Replay</h1>
      <p className="text-sm text-dash-muted mb-8">Interview ID: {params.id}</p>
      <div className="card p-8 text-center">
        <div className="text-dash-muted">
          <p className="text-sm">Session replay player will reconstruct code edits, execution results, and chat from recorded events.</p>
          <p className="text-xs mt-2 opacity-60">Requires session_events data from the database.</p>
        </div>
      </div>
    </div>
  );
}
