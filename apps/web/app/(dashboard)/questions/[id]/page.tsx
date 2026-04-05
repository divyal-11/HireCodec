'use client';

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-dash-text mb-4">Question Detail</h1>
      <p className="text-dash-muted text-sm">Question ID: {params.id}</p>
      {/* Reuses same form as /new but in edit mode */}
    </div>
  );
}
