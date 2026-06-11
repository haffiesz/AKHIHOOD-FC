import { useState } from 'react';
import { Player } from '../types';
import { UserPlus, Edit2, Trash2, Search, User, ShieldCheck } from 'lucide-react';

interface SquadGridProps {
  players: Player[];
  onSlotClick: (slotNo: number) => void;
  onDeleteSlot: (slotNo: number) => void;
}

export default function SquadGrid({
  players,
  onSlotClick,
  onDeleteSlot,
}: SquadGridProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Generate complete list of 25 slots
  const allSlots = Array.from({ length: 25 }, (_, i) => {
    const slotNo = i + 1;
    const player = players.find((p) => p.slotNo === slotNo);
    return { slotNo, player };
  });

  // Filter slots based on name query
  const filteredSlots = allSlots.filter(({ slotNo, player }) => {
    if (!searchQuery) return true;
    const matchesName = player?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSlot = String(slotNo).includes(searchQuery);
    return matchesName || matchesSlot;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header and Live Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 p-2.5 rounded-2xl border border-amber-500/20">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide font-display">
              Roster Registry: 25 Player Slots
            </h2>
            <p className="text-xs text-slate-400">
              Select any available slot below to register a player's name
            </p>
          </div>
        </div>

        {/* Real-time search field */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search slot or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
        </div>
      </div>

      {/* Grid of 25 slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSlots.map(({ slotNo, player }) => (
          <div
            key={slotNo}
            id={`slot-card-${slotNo}`}
            className={`group relative rounded-2xl border p-4 transition-all duration-300 ${
              player
                ? 'bg-gradient-to-br from-slate-950 to-slate-900 border-amber-500/40 hover:border-amber-400/80 shadow-md shadow-amber-500/[0.02]'
                : 'bg-slate-950/40 border-slate-850 hover:border-slate-700 hover:bg-slate-950/60'
            }`}
          >
            {/* Slot No Ribbon */}
            <div className="absolute top-3 right-3 flex items-center justify-center font-mono font-black text-xs px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 group-hover:text-amber-400 transition-colors">
              SLOT {String(slotNo).padStart(2, '0')}
            </div>

            {player ? (
              // Occupied State Design
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2.5 min-w-0 pr-12">
                  <div className="bg-amber-400/10 p-2 rounded-xl text-amber-400 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider font-mono">Active Player</p>
                    <p className="text-sm font-semibold text-slate-100 truncate font-display">
                      {player.name}
                    </p>
                  </div>
                </div>

                {player.phone && (
                  <p className="text-[10px] font-mono text-slate-500 truncate">
                    📞 {player.phone}
                  </p>
                )}

                {/* Edit / Delete action overlay bar */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => onSlotClick(slotNo)}
                    id={`btn-edit-slot-${slotNo}`}
                    className="p-1 px-2.5 rounded-lg text-[10px] font-bold text-amber-400 bg-amber-500/5 hover:bg-amber-400 hover:text-slate-950 border border-amber-500/20 hover:border-amber-400 transition cursor-pointer"
                    title="Update Name"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to empty Slot ${slotNo} (${player.name})?`)) {
                        onDeleteSlot(slotNo);
                      }
                    }}
                    id={`btn-delete-slot-${slotNo}`}
                    className="p-1 px-1.5 rounded-lg text-rose-450 hover:text-rose-400 bg-rose-500/5 hover:bg-rose-500/20 border border-rose-500/20 transition cursor-pointer"
                    title="Clear Slot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              // Vacant State Design
              <button
                onClick={() => onSlotClick(slotNo)}
                id={`btn-register-slot-${slotNo}`}
                className="w-full text-left pt-2 pb-1 space-y-2 cursor-pointer focus:outline-none focus:ring-0"
              >
                <div className="flex items-center gap-2.5">
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-slate-500 group-hover:text-amber-400 group-hover:border-amber-400/40 transition shrink-0">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] uppercase font-bold text-slate-500 group-hover:text-slate-400 tracking-widest font-mono">
                      Vacant
                    </h4>
                    <p className="text-xs font-medium text-slate-400 group-hover:text-amber-300 font-display transition-colors">
                      + Claim Slot {slotNo}
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
