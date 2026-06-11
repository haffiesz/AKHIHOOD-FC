import React, { useState } from 'react';
import { MatchDetails, Player } from '../types';
import { Settings, Copy, Check, MessageSquare, RotateCcw, Edit2, Save, MapPin, Calendar, Clock, RefreshCw } from 'lucide-react';

interface TeamControlPanelProps {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  matchDetails: MatchDetails;
  setMatchDetails: React.Dispatch<React.SetStateAction<MatchDetails>>;
  players: Player[];
  onClearRoster: () => void;
  syncStatus: boolean;
  onSync: () => void;
  isSyncing: boolean;
}

export default function TeamControlPanel({
  isAdmin,
  setIsAdmin,
  matchDetails,
  setMatchDetails,
  players,
  onClearRoster,
  syncStatus,
  onSync,
  isSyncing,
}: TeamControlPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form states local
  const [localTitle, setLocalTitle] = useState(matchDetails.title);
  const [localOpponent, setLocalOpponent] = useState(matchDetails.opponent);
  const [localSubtitle, setLocalSubtitle] = useState(matchDetails.subtitle);
  const [localDate, setLocalDate] = useState(matchDetails.date);
  const [localTime, setLocalTime] = useState(matchDetails.time);
  const [localVenue, setLocalVenue] = useState(matchDetails.venue);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setMatchDetails({
      title: localTitle,
      opponent: localOpponent,
      subtitle: localSubtitle,
      date: localDate,
      time: localTime,
      venue: localVenue,
    });
    setIsEditing(false);
  };

  const generateWhatsappText = () => {
    let t = `⚽ *AKHIHOOD FC FRIENDLY MATCH ROSTER* ⚽\n`;
    t += `📌 *${matchDetails.title.toUpperCase()}*\n`;
    t += `⚔️ *Opponent:* ${matchDetails.opponent}\n\n`;
    
    t += `📅 *Date/Day:* ${matchDetails.date}\n`;
    t += `⏰ *Time:* ${matchDetails.time}\n`;
    t += `🏟️ *Venue:* ${matchDetails.venue}\n\n`;

    const filledCount = players.length;
    t += `👥 *REGISTERED SLOTS:* ${filledCount} / 25 Players\n`;
    t += `-------------------------------------------\n\n`;

    for (let i = 1; i <= 25; i++) {
      const pl = players.find((p) => p.slotNo === i);
      const indexStr = String(i).padStart(2, '0');
      if (pl) {
        t += `${indexStr}. *${pl.name}* ${pl.phone ? `(${pl.phone})` : ''}\n`;
      } else {
        t += `${indexStr}. _[VACANT - PLEASE REGISTER]_\n`;
      }
    }

    t += `\n📌 _Please click the registration link to claim your favorite slot!_`;
    return t;
  };

  const handleCopyWhatsappStr = async () => {
    try {
      await navigator.clipboard.writeText(generateWhatsappText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Admin and Configuration Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-semibold text-white font-display">
              Roster Management System
            </h3>
          </div>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            id="toggle-admin-btn"
            className={`text-[10px] font-bold px-3 py-1.5 rounded-xl transition cursor-pointer ${
              isAdmin 
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10' 
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-705'
            }`}
          >
            {isAdmin ? 'ADMIN MODE: ACTIVE' : 'ACTIVATE ADMIN MODE'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveDetails} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Event / Match Title</label>
              <input
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Opponent</label>
                <input
                  type="text"
                  value={localOpponent}
                  onChange={(e) => setLocalOpponent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Organizer Group</label>
                <input
                  type="text"
                  value={localSubtitle}
                  onChange={(e) => setLocalSubtitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Pitch / Venue</label>
                <input
                  type="text"
                  value={localVenue}
                  onChange={(e) => setLocalVenue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Match Date</label>
                <input
                  type="text"
                  value={localDate}
                  onChange={(e) => setLocalDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Pitch Time</label>
                <input
                  type="text"
                  value={localTime}
                  onChange={(e) => setLocalTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs px-3 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-xl text-xs space-y-2.5 relative">
              {isAdmin && (
                <button
                  onClick={() => setIsEditing(true)}
                  id="btn-edit-match-details"
                  className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-amber-500 transition cursor-pointer"
                  title="Update Details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              <h4 className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Current Match Info</h4>
              <div className="space-y-1 text-slate-300 font-display">
                <p className="font-bold text-slate-100">{matchDetails.title}</p>
                <p className="text-amber-500 text-[11px] font-semibold">vs {matchDetails.opponent} • {matchDetails.subtitle}</p>
              </div>

              <div className="pt-2 border-t border-slate-900 grid grid-cols-1 gap-2.5 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{matchDetails.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>{matchDetails.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{matchDetails.time}</span>
                </div>
              </div>
            </div>

            {/* Sync database status trigger */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-850">
              <div className="font-mono">
                <p className="text-[9px] text-slate-500 uppercase">Cloud Sync</p>
                <span className={`text-[10px] font-bold ${syncStatus ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {syncStatus ? 'SYNCHRONIZED' : 'NOT SYNCHRONIZED'}
                </span>
              </div>
              <button
                onClick={onSync}
                disabled={isSyncing}
                className="flex items-center gap-1 bg-slate-900 hover:bg-slate-850 hover:border-amber-500/25 border border-slate-800 text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer"
              >
                {isSyncing ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
                ) : (
                  <RefreshCw className="w-3 h-3 text-amber-500" />
                )}
                Sync Now
              </button>
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to completely clear the 25-player roster?')) {
                    onClearRoster();
                  }
                }}
                className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-[10px] py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear All 25 Slots
              </button>
            )}
          </div>
        )}
      </div>

      {/* WhatsApp Formatter Output Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-500" />
          <h4 className="text-sm font-semibold text-white font-display">WhatsApp Broadcast Format</h4>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          Copy this formatted friendly match roster list into your WhatsApp group.
        </p>

        {/* Live preview formatted list from 1 to 25 */}
        <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl max-h-52 overflow-y-auto font-mono text-[10px] whitespace-pre-wrap text-emerald-400/90 leading-relaxed scrollbar-thin scrollbar-thumb-slate-850">
          {generateWhatsappText()}
        </div>

        <button
          onClick={handleCopyWhatsappStr}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-550 text-white font-bold text-xs py-3 px-4 rounded-xl transition active:scale-95 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied Successfully!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy WhatsApp Format
            </>
          )}
        </button>
      </div>

    </div>
  );
}
