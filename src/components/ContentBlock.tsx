import { getContentBlock } from '@/lib/data';

export async function ContentBlock({ blockKey }: { blockKey: string }) {
  const block = await getContentBlock(blockKey);
  if (!block) return null;
  return (
    <div className="glass-card p-8 text-center max-w-3xl mx-auto">
      <p className="text-lg text-gray-700 leading-relaxed">{block.value}</p>
    </div>
  );
}