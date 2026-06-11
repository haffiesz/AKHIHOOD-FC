import { useState, useEffect } from 'react';
import { Player, MatchDetails } from './types';
import SquadGrid from './components/SquadGrid';
import RegistrationFormModal from './components/RegistrationFormModal';
import TeamControlPanel from './components/TeamControlPanel';
import { ShieldCheck, Info, RefreshCw, Trophy, Sparkles } from 'lucide-react';
// @ts-ignore
import logoUrl from './assets/images/akhihood_logo_1781144245965.png';

const INITIAL_MATCH_DETAILS: MatchDetails = {
  title: 'Akhihood FC Friendly Match vs Esbisk FC',
  opponent: 'Esbisk FC',
  subtitle: 'Akhihood FC',
  date: 'Saturday, 14 Jun 2026',
  time: '8:00 PM - 10:00 PM',
  venue: 'Rhino Pitch, Cyberjaya',
};

// Start 100% blank
const PRELOADED_PLAYERS: Player[] = [];

export default function App() {
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('akhihood_squad_roster');
    return saved ? JSON.parse(saved) : PRELOADED_PLAYERS;
  });

  const [matchDetails, setMatchDetails] = useState<MatchDetails>(() => {
    const saved = localStorage.getItem('akhihood_match_config');
    return saved ? JSON.parse(saved) : INITIAL_MATCH_DETAILS;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [syncStatus, setSyncStatus] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Registration modal triggers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlotNo, setSelectedSlotNo] = useState<number | null>(null);

  // Sync mutations to browser storage
  useEffect(() => {
    localStorage.setItem('akhihood_squad_roster', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('akhihood_match_config', JSON.stringify(matchDetails));
  }, [matchDetails]);

  const handleSlotClick = (slotNo: number) => {
    setSelectedSlotNo(slotNo);
    setIsModalOpen(true);
  };

  const handleSaveSlot = (name: string, phone: string) => {
    setPlayers((prev) => {
      // Avoid duplication, clear old entry on the same slot
      const filtered = prev.filter((p) => p.slotNo !== selectedSlotNo);
      return [...filtered, { slotNo: selectedSlotNo!, name, phone }].sort((a, b) => a.slotNo - b.slotNo);
    });
    setSyncStatus(false);
  };

  const handleDeleteSlot = (slotNo: number) => {
    setPlayers((prev) => prev.filter((p) => p.slotNo !== slotNo));
    setSyncStatus(false);
  };

  const handleClearRoster = () => {
    setPlayers([]);
    setSyncStatus(false);
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus(true);
    }, 1200);
  };

  // Pre-load specific state
  const activePlayer = selectedSlotNo !== null 
    ? players.find((p) => p.slotNo === selectedSlotNo) || null 
    : null;

  // Percentage calculations
  const totalSlots = 25;
  const occupiedCount = players.length;
  const progressPercentage = (occupiedCount / totalSlots) * 100;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-150 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Visual Accent top ribbon */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 w-full" />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Customized Roster Header card */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/40 p-6 rounded-3xl border border-slate-850">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            
            {/* Elegant Akhihood Logo Emblem */}
            <div className="bg-slate-950 p-0.5 rounded-full border border-amber-500/30 shadow-lg shadow-amber-500/[0.04] shrink-0 overflow-hidden w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              <img
                src={logoUrl}
                alt="Akhihood FC Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-black italic tracking-tight text-white font-display uppercase">
                {matchDetails.title}
              </h1>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-500 mt-1 flex items-center gap-1.5 justify-center md:justify-start">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {matchDetails.subtitle}
              </p>
            </div>
          </div>

          {/* Quick Slot Status Summary layout */}
          <div className="flex flex-col gap-2 items-center md:items-end w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 px-4 py-2.5 rounded-2xl w-full sm:w-auto justify-between sm:justify-start font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-amber-400 text-sm">{occupiedCount}</span>
                <span className="text-slate-500"> / {totalSlots} SLOTS FILLED</span>
              </div>
            </div>

            {/* Roster Live fill progress indicator */}
            <div className="w-full sm:w-48 bg-slate-950 p-1.5 rounded-full border border-slate-850 flex items-center">
              <div className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
        </header>

        {/* Info Instruction Banner */}
        <div className="bg-amber-500/[0.03] border border-amber-500/20 px-4 py-3 rounded-2xl flex items-start sm:items-center gap-3">
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-semibold uppercase tracking-wide">
            INFO: Field positions have been removed. Please click any of the 25 slots below to register a player's name into the roster!
          </p>
        </div>

        {/* Main Split Section Viewport */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Active 25-Jersey roster grids board (Col span 8 on widescreen detail) */}
          <section className="xl:col-span-8">
            <SquadGrid
              players={players}
              onSlotClick={handleSlotClick}
              onDeleteSlot={handleDeleteSlot}
            />
          </section>

          {/* Control widgets, Admin configuration, WA Copier container (Col span 4) */}
          <section className="xl:col-span-4">
            <TeamControlPanel
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
              matchDetails={matchDetails}
              setMatchDetails={setMatchDetails}
              players={players}
              onClearRoster={handleClearRoster}
              syncStatus={syncStatus}
              onSync={handleManualSync}
              isSyncing={isSyncing}
            />
          </section>

        </div>

      </main>

      {/* Registration/Update Form overlay modal */}
      <RegistrationFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSlotNo(null);
        }}
        slotNo={selectedSlotNo}
        player={activePlayer}
        onSave={handleSaveSlot}
        onDelete={() => {
          if (selectedSlotNo !== null) {
            handleDeleteSlot(selectedSlotNo);
            setIsModalOpen(false);
          }
        }}
      />

      {/* Structured footer credits */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-[10px] text-slate-500 font-mono">
        <p>© 2026 Akhihood FC Team Manager Board</p>
        <p className="mt-1 text-slate-600">Simple, quick, and easy sports roster management</p>
      </footer>

    </div>
  );
}
