import React, { useState } from 'react';
import { Button } from '../components/Button';
import { InterestTag } from '../components/InterestTag';
import { SparklesIcon } from 'lucide-react';
interface InterestsPageProps {
  onNavigate: (page: string) => void;
}
export const InterestsPage = ({
  onNavigate
}: InterestsPageProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Ancient Life']);
  const interests = [{
    name: 'Ancient Life',
    icon: '🏺'
  }, {
    name: 'War & Weaponry',
    icon: '⚔️'
  }, {
    name: 'Politics & Power',
    icon: '👑'
  }, {
    name: 'Mythology',
    icon: '🔮'
  }, {
    name: 'Architecture',
    icon: '🏛️'
  }];
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  return <div className="flex flex-col min-h-screen bg-navy-900 px-6">
      <div className="flex-1 flex flex-col pt-16">
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl text-white mb-3">
            Your Interests
          </h1>
          <p className="text-gray-400">
            Select topics you'd like to explore. This helps us personalize your
            experience.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {interests.map(interest => <InterestTag key={interest.name} name={interest.name} icon={interest.icon} isSelected={selectedInterests.includes(interest.name)} onClick={() => toggleInterest(interest.name)} />)}
        </div>
        <div className="mt-auto mb-8">
          <Button fullWidth onClick={() => onNavigate('home')} disabled={selectedInterests.length === 0}>
            <SparklesIcon size={20} className="mr-2" />
            Start Exploring
          </Button>
          <button className="w-full text-center mt-4 text-gray-400 text-sm" onClick={() => onNavigate('home')}>
            Skip for now
          </button>
        </div>
      </div>
    </div>;
};