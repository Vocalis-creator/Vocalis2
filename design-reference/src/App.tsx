import React, { useEffect, useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { SearchPage } from './pages/SearchPage';
import { ProfilePage } from './pages/ProfilePage';
import { InterestsPage } from './pages/InterestsPage';
import { NavigationBar } from './components/NavigationBar';
import { TourSelectionPage } from './pages/TourSelectionPage';
import { TourCustomizationPage } from './pages/TourCustomizationPage';
import { TourPlaybackPage } from './pages/TourPlaybackPage';
import { AudioPlayer } from './components/AudioPlayer';
import { FullscreenAudioPlayer } from './components/FullscreenAudioPlayer';
import { useAudioPlayer, AudioTrack } from './hooks/useAudioPlayer';
import { SplashScreen } from './components/SplashScreen';
export function App() {
  console.log('App rendering');
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const audioPlayer = useAudioPlayer();
  const [isFullscreenAudio, setIsFullscreenAudio] = useState(false);
  // Add effect to log when page changes
  useEffect(() => {
    console.log('Current page changed to:', currentPage);
  }, [currentPage]);
  const handleNavigate = (page: string) => {
    console.log('Navigation requested to:', page);
    setCurrentPage(page);
    // Close fullscreen audio if navigating away
    if (isFullscreenAudio) {
      setIsFullscreenAudio(false);
    }
  };
  const handleStartTour = (track: AudioTrack) => {
    audioPlayer.actions.startPlayback(track);
    setIsFullscreenAudio(true);
  };
  const handleMinimizeAudio = () => {
    setIsFullscreenAudio(false);
    setCurrentPage('home');
  };
  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }
  const renderPage = () => {
    console.log('Rendering page:', currentPage);
    // If fullscreen audio is active, show that instead of regular page
    if (isFullscreenAudio && audioPlayer.currentTrack) {
      return <FullscreenAudioPlayer title={audioPlayer.currentTrack.title} isPlaying={audioPlayer.isPlaying} currentTime={audioPlayer.formatTime(audioPlayer.currentTime)} duration={audioPlayer.formatTime(audioPlayer.duration)} onClose={handleMinimizeAudio} onPlayPause={audioPlayer.actions.togglePlayPause} onSeek={audioPlayer.actions.seek} progress={audioPlayer.currentTime / audioPlayer.duration * 100} />;
    }
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'interests':
        return <InterestsPage onNavigate={handleNavigate} />;
      case 'tour-selection':
        return <TourSelectionPage onNavigate={handleNavigate} />;
      case 'tour-customization':
        return <TourCustomizationPage onNavigate={handleNavigate} onStartTour={handleStartTour} />;
      case 'tour-playback':
        return <TourPlaybackPage onNavigate={handleNavigate} onStartTour={handleStartTour} />;
      case 'home':
        return <HomePage username="Explorer" onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      default:
        return <LoginPage onNavigate={handleNavigate} />;
    }
  };
  const showNavBar = ['home', 'profile'].includes(currentPage) && !isFullscreenAudio;
  return <div className="bg-navy-900 min-h-screen text-white font-sans">
      {showNavBar && <NavigationBar activePage={currentPage} onNavigate={handleNavigate} />}
      {renderPage()}
      {audioPlayer.currentTrack && !isFullscreenAudio && <AudioPlayer title={audioPlayer.currentTrack.title} isPlaying={audioPlayer.isPlaying} currentTime={audioPlayer.formatTime(audioPlayer.currentTime)} duration={audioPlayer.formatTime(audioPlayer.duration)} onClose={audioPlayer.actions.stop} onPlayPause={audioPlayer.actions.togglePlayPause} onSeek={audioPlayer.actions.seek} progress={audioPlayer.currentTime / audioPlayer.duration * 100} />}
    </div>;
}