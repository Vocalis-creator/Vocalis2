import React, { Fragment } from 'react';
import { ChevronRightIcon, HeartIcon, HistoryIcon, ShareIcon, StarIcon, HelpCircleIcon, FileTextIcon, ShieldIcon, MessageSquareIcon } from 'lucide-react';
import { Button } from '../components/Button';
interface ProfilePageProps {
  onNavigate?: (page: string) => void;
}
export const ProfilePage = ({
  onNavigate = () => {}
}: ProfilePageProps) => {
  const menuItems = [{
    id: 'interests',
    title: 'Configure Interests',
    icon: HeartIcon,
    divider: false
  }, {
    id: 'history',
    title: 'Tour History',
    icon: HistoryIcon,
    divider: true
  }, {
    id: 'share',
    title: 'Share App',
    icon: ShareIcon,
    divider: false
  }, {
    id: 'rate',
    title: 'Rate App',
    icon: StarIcon,
    divider: true
  }, {
    id: 'faq',
    title: 'FAQ',
    icon: HelpCircleIcon,
    divider: false
  }, {
    id: 'terms',
    title: 'Terms of Use',
    icon: FileTextIcon,
    divider: false
  }, {
    id: 'privacy',
    title: 'Privacy Notice',
    icon: ShieldIcon,
    divider: false
  }, {
    id: 'contact',
    title: 'Contact Us',
    icon: MessageSquareIcon,
    divider: false
  }];
  return <div className="min-h-screen bg-navy-900 pt-16 pb-20">
      <div className="px-6">
        <h1 className="font-serif text-2xl text-white mb-6">Settings</h1>
        <Button fullWidth onClick={() => onNavigate('login')} className="mb-4 py-3">
          Join Vocalis
        </Button>
        <div className="flex items-center justify-between mb-8">
          <span className="text-white">Have an Account?</span>
          <button className="text-gold-400 font-medium" onClick={() => onNavigate('login')}>
            Log In
          </button>
        </div>
        <div className="rounded-lg overflow-hidden">
          {menuItems.map((item, index) => <Fragment key={item.id}>
              <div className="flex items-center justify-between p-4 bg-navy-800 hover:bg-navy-700 transition-colors" onClick={() => console.log(`Navigate to ${item.id}`)}>
                <div className="flex items-center">
                  <item.icon size={20} className="text-gold-400 mr-3" />
                  <span className="text-white">{item.title}</span>
                </div>
                <ChevronRightIcon size={20} className="text-gray-400" />
              </div>
              {item.divider && <div className="h-2 bg-navy-900" />}
            </Fragment>)}
        </div>
      </div>
    </div>;
};