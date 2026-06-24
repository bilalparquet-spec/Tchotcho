import { useCallback, useState } from 'react';
import SplashScreen from './components/SplashScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import SettingsScreen from './components/SettingsScreen';
import type { GameState } from './game/constants';
import { audioEngine } from './utils/audio';
import { getSettings } from './utils/storage';

function App() {
  const [state, setState] = useState<GameState>('splash');
  const [lastScore, setLastScore] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);

  const goPlay = useCallback(() => {
    const settings = getSettings();
    audioEngine.setMusicEnabled(settings.music);
    audioEngine.setSfxEnabled(settings.sfx);
    setResetSignal((s) => s + 1);
    setState('ready');
  }, []);

  const goLeaderboard = useCallback(() => setState('leaderboard'), []);
  const goSettings = useCallback(() => setState('settings'), []);
  const goHome = useCallback(() => setState('splash'), []);

  const handleStartPlaying = useCallback(() => {
    setState('playing');
  }, []);

  const handleGameOver = useCallback((score: number) => {
    setLastScore(score);
    setState('dead');
  }, []);

  const handleRetry = useCallback(() => {
    setResetSignal((s) => s + 1);
    setState('ready');
  }, []);

  return (
    <div
      className="relative mx-auto h-full w-full overflow-hidden bg-black"
      style={{ maxWidth: 560 }}
    >
      {state === 'splash' && (
        <SplashScreen onPlay={goPlay} onLeaderboard={goLeaderboard} onSettings={goSettings} />
      )}

      {(state === 'ready' || state === 'playing' || state === 'dead') && (
        <GameScreen
          phase={state === 'dead' ? 'playing' : state}
          onStartPlaying={handleStartPlaying}
          onGameOver={handleGameOver}
          resetSignal={resetSignal}
        />
      )}

      {state === 'dead' && (
        <GameOverScreen score={lastScore} onRetry={handleRetry} onHome={goHome} />
      )}

      {state === 'leaderboard' && <LeaderboardScreen onBack={goHome} />}
      {state === 'settings' && <SettingsScreen onBack={goHome} />}
    </div>
  );
}

export default App;
