import React from 'react';
import { MicIcon, RefreshCwIcon, MousePointerClickIcon } from 'lucide-react';
interface AudioInteractionsProps {
  onAskQuestion: () => void;
  onChangeTopic: () => void;
  onDoubleClick: () => void;
}
export const AudioInteractions = ({
  onAskQuestion,
  onChangeTopic,
  onDoubleClick
}: AudioInteractionsProps) => {
  return <div className="grid grid-cols-3 gap-4">
      <button onClick={onDoubleClick} className="flex flex-col items-center justify-center p-4 rounded-lg bg-navy-700 hover:bg-navy-600 transition-colors">
        <MousePointerClickIcon size={24} className="text-gold-400 mb-2" />
        <span className="text-sm text-gray-300">Deep dive</span>
      </button>
      <button onClick={onAskQuestion} className="flex flex-col items-center justify-center p-4 rounded-lg bg-navy-700 hover:bg-navy-600 transition-colors">
        <MicIcon size={24} className="text-gold-400 mb-2" />
        <span className="text-sm text-gray-300">Ask a question</span>
      </button>
      <button onClick={onChangeTopic} className="flex flex-col items-center justify-center p-4 rounded-lg bg-navy-700 hover:bg-navy-600 transition-colors">
        <RefreshCwIcon size={24} className="text-gold-400 mb-2" />
        <span className="text-sm text-gray-300">Change topic</span>
      </button>
    </div>;
};