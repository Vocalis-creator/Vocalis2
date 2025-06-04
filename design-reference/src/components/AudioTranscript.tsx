import React from 'react';
interface AudioTranscriptProps {
  transcript: string[];
  currentLineIndex: number;
}
export const AudioTranscript = ({
  transcript,
  currentLineIndex
}: AudioTranscriptProps) => {
  return <div className="bg-navy-800/50 p-6 rounded-lg overflow-y-auto h-[40vh] border border-navy-600">
      <div className="space-y-4">
        {transcript.map((line, index) => <p key={index} className={`transition-colors duration-300 ${index === currentLineIndex ? 'text-white' : index < currentLineIndex ? 'text-gray-400' : 'text-gray-600'}`}>
            {line}
          </p>)}
      </div>
    </div>;
};