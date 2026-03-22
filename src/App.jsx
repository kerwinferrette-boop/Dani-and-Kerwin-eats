import { useState, useEffect } from "react";

const VIBE_ICONS = {
  "Date Night": "🕯️", "Special Occasion": "✨", "Fun & Lively": "🎉",
  "Casual": "😌", "Classic SF": "🌉", "Late Night": "🌙", "Brunch": "☀️",
};
const SUIT_COLORS = ["#e8c84a", "#c084fc", "#f87171", "#34d399", "#60a5fa"];
const SUITS = ["♠", "♥", "♦", "♣", "★"];
const ALL_PRICES = ["$", "$$", "$$$", "$$$$"];

function Pill({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 11px", borderRadius: "100px", cursor: "pointer",
      border: `1px solid ${active ? color : "rgba(255,255,255,0.07)"}`,
      background: active ? `${color}20` : "rgba(255,255,255,0.02)",
      color: active ? color : "rgba(255,255,255,0.3)",
      fontSize: "11px", fontWeight: "600", fontFamily: "'DM Mono',monospace",
      transition: "all 0.15s", whiteSpace: "nowrap",
    }}>{label}</button>
  );
}

function Card({ r, idx, flipped, selected, isWinner, onSelect, onDiscard }) {
  const color = SUIT_COLORS[idx];
  const suit = SUITS[idx];
  const rot = [-8, -4, 0, 4, 8][idx];
  const ty = selected ? -22 : isWinner ? -14 : 0;
  return (
    <div onClick={() => flipped && !isWinner && onSelect(idx)} style={{
      width: "100%", maxWidth: "130px", aspectRatio: "2.5/3.5", position: "relative",
      cursor: flipped && !isWinner ? "pointer" : "default",
      transform: `rotate(${rot}deg) translateY(${ty}px)`,
      transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      transformOrigin: "bottom center", flexShrink: 0,
    }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "14px", boxShadow: selected ? `0 20px 50px ${color}55, 0 0 0 2px ${color}` : isWinner ? `0 16px 40px ${color}44, 0 0 0 1.5px ${color}88` : "0 8px 24px rgba(0,0,0,0.5)", transition: "box-shadow 0.3s" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "14px", background: flipped ? "linear-gradient(145deg,#1a1a2e,#16213e,#0f0e17)" : "linear-gradient(145deg,#1e1b2e,#2d1f3d,#1a1228)", border: flipped ? `1px solid ${color}44` : "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", padding: flipped ? "10px" : "0", overflow: "hidden" }}>
        {!flipped ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "repeating-linear-gradient(45deg,rgba(255,255,255,0.02) 0px,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 8px)" }}>
            <span style={{ fontSize: "28px", opacity: 0.2 }}>🍽️</span>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "16px", color, lineHeight: 1 }}>{suit}</span>
              <span style={{ fontSize: "10px", color: `${color}99`, fontFamily: "'DM Mono',monospace" }}>{r.price}</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "3px" }}>
              <div style={{ fontSize: "clamp(9px,1.6vw,12px)", fontFamily: "'Syne',sans-serif", fontWeight: "800", color: "white", lineHeight: 1.2 }}>{r.name.length > 22 ? r.name.slice(0, 20) + "…" : r.name}</div>
              <div style={{ fontSize: "9px", color: `${color}cc`, fontFamily: "'DM Mono',monospace" }}>{r.cuisine}</div>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.28)", lineHeight: 1.2 }}>{r.neighborhood}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "5px" }}>
              <span style={{ fontSize: "13px" }}>{VIBE_ICONS[r.vibe] || "🍽️"}</span>
              <span style={{ fontSize: "16px", color, transform: "rotate(180deg)", display: "inline-block" }}>{suit}</span>
            </div>
          </>
        )}
      </div>
      {flipped && !isWinner && (
        <button onClick={e => { e.stopPropagation(); onDiscard(idx); }} style={{ position: "absolute", top: "-9px", right: "-5px", width: "20px", height: "20px", borderRadius: "50%", background: "rgba(255,80,80,0.85)", border: "none", color: "white", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>✕</button>
      )}
    </div>
  );
}

export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [loadState, setLoadState] = useState("loading");
  const [locks, setLocks] = useState({ cuisine: [], neighborhood: [], price: [], vibe: [] });
  const [showFilters, setShowFilters] = useState(false);

  // deck mode: "random" | "custom"
  const [deckMode, setDeckMode] = useState("random");
  const [customList, setCustomList] = useState([]);
  const [customSearch, setCustomSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [phase, setPhase] = useState("idle");
  const [hand, setHand] = useState([]);
  const [flipped, setFlipped] = useState([false, false, false, false, false]);
  const [selected, setSelected] = useState(null);
  const [winner, setWinner] = useState(null);
  const [saved, setSaved] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [dealCount, setDealCount] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/.netlify/functions/restaurants")
      .then(r => r.json())
      .then(data => { setRestaurants(data); setLoadState("ready"); })
      .catch(() => setLoadState("error"));
  }, []);

  useEffect(() => {
    if (!customSearch.trim()) { setSearchResults([]); return; }
    const q = customSearch.toLowerCase();
    setSearchResults(
      restaurants.filter(r => r.name.toLowerCase().includes(q) && !customList.find(c => c.name === r.name)).slice(0, 6)
    );
  }, [customSearch, restaurants, customList]);

  const toggle = (key, val) => {
    setLocks(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val] }));
    setError(false);
  };

  const allCuisines = [...new Set(restaurants.map(r => r.cuisine))].sort().slice(0, 40);
  const allNeighborhoods = [...new Set(restaurants.map(r => r.neighborhood))].filter(n => n !== "San Francisco").sort().slice(0, 25);
  const allVibes = [...new Set(restaurants.map(r => r.vibe))].sort();
  const totalLocks = Object.values(locks).flat().length;

  const filteredPool = restaurants.filter(r =>
    (!locks.cuisine.length || locks.cuisine.includes(r.cuisine)) &&
    (!locks.neighborhood.length || locks.neighborhood.includes(r.neighborhood)) &&
    (!locks.price.length || locks.price.includes(r.price)) &&
    (!locks.vibe.length || locks.vibe.includes(r.vibe))
  );

  const activePool = deckMode === "custom" && customList.length > 0 ? customList : filteredPool;

  const deal = () => {
    if (activePool.length < 1) { setError(true); return; }
    setError(false);
    const available = activePool.filter(r => !saved.find(s => s.name === r.name));
    const hand5 = [...available].sort(() => Math.random() - 0.5).slice(0, 5);
    if (!hand5.length) { setError(true); return; }
    setHand(hand5);
    setFlipped([false, false, false, false, false]);
    setSelected(null); setWinner(null);
    setPhase("dealing"); setDealCount(c => c + 1);
    hand5.forEach((_, i) => {
      setTimeout(() => {
        setFlipped(p => { const n = [...p]; n[i] = true; return n; });
        if (i === hand5.length - 1) setPhase("hand");
      }, 300 + i * 220);
    });
  };

  const discard = (idx) => {
    const used = hand.map(r => r.name);
    const fresh = activePool.filter(r => !used.includes(r.name) && !saved.find(s => s.name === r.name));
    if (!fresh.length) return;
    const pick = fresh[Math.floor(Math.random() * fresh.length)];
    const newHand = [...hand]; newHand[idx] = pick;
    setHand(newHand);
    setFlipped(p => { const n = [...p]; n[idx] = false; return n; });
    setTimeout(() => setFlipped(p => { const n = [...p]; n[idx] = true; return n; }), 300);
  };

  const confirm = () => { if (selected === null) return; setWinner(hand[selected]); setPhase("winner"); };

  const sections = [
    { key: "cuisine", label: "CUISINE", opts: allCuisines, color: "#e8c84a" },
    { key: "neighborhood", label: "NEIGHBORHOOD", opts: allNeighborhoods, color: "#c084fc" },
    { key: "price", label: "PRICE", opts: ALL_PRICES, color: "#34d399" },
    { key: "vibe", label: "VIBE", opts: allVibes, color: "#f87171" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 30% 0%,#0e1a0a,#060d14 40%,#0a0008)", display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 16px 48px", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;600&family=DM+Mono:wght@500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes sheen { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes shake { 0%,100% { transform:translateX(0); } 25% { transform:translateX(-4px); } 75% { transform:translateX(4px); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>

      {/* header */}
      <div style={{ textAlign: "center", marginBottom: "22px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "5px", color: "rgba(232,200,74,0.45)", fontFamily: "'DM Mono',monospace", marginBottom: "7px" }}>DANI & KERWIN · SF</div>
        <h1 style={{ fontSize: "clamp(26px,6vw,44px)", fontFamily: "'Syne',sans-serif", fontWeight: "800", lineHeight: 1, background: "linear-gradient(135deg,#e8c84a,#fff8dc 40%,#c8a020 70%,#e8c84a)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "sheen 5s linear infinite", marginBottom: "5px" }}>DEAL THE HAND</h1>
        <p style={{ color: "rgba(255,255,255,0.18)", fontSize: "12px", letterSpacing: "1px" }}>
          {loadState === "loading" ? "Loading SF restaurants..." : loadState === "error" ? "Couldn't load. Check connection." : `${restaurants.length} SF restaurants loaded.`}
        </p>
      </div>

      {loadState === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "48px 0" }}>
          <div style={{ fontSize: "36px", animation: "pulse 1.2s ease infinite" }}>🍽️</div>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px", fontFamily: "'DM Mono',monospace", letterSpacing: "2px" }}>FETCHING SF RESTAURANTS...</p>
        </div>
      )}

      {loadState === "error" && (
        <div style={{ padding: "20px", borderRadius: "14px", background: "rgba(255,80,80,0.07)", border: "1px solid rgba(255,80,80,0.2)", color: "rgba(255,120,120,0.8)", fontSize: "13px", fontFamily: "'DM Mono',monospace", textAlign: "center", maxWidth: "400px" }}>
          Couldn't reach the restaurant service. Refresh to try again.
        </div>
      )}

      {loadState === "ready" && (
        <>
          {/* deck mode toggle */}
          <div style={{ width: "100%", maxWidth: "680px", marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              {["random", "custom"].map(mode => (
                <button key={mode} onClick={() => setDeckMode(mode)} style={{
                  flex: 1, padding: "10px", borderRadius: "12px", cursor: "pointer",
                  border: `1px solid ${deckMode === mode ? "rgba(232,200,74,0.5)" : "rgba(255,255,255,0.07)"}`,
                  background: deckMode === mode ? "rgba(232,200,74,0.1)" : "rgba(255,255,255,0.02)",
                  color: deckMode === mode ? "rgba(232,200,74,0.9)" : "rgba(255,255,255,0.3)",
                  fontSize: "12px", fontWeight: "700", fontFamily: "'DM Mono',monospace", letterSpacing: "2px",
                }}>
                  {mode === "random" ? "🎲 RANDOM DECK" : "📋 CUSTOM DECK"}
                </button>
              ))}
            </div>

            {/* custom deck builder */}
            {deckMode === "custom" && (
              <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "16px", animation: "fadeUp 0.2s ease forwards" }}>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(255,255,255,0.22)", fontFamily: "'DM Mono',monospace", marginBottom: "10px" }}>
                  BUILD YOUR DECK {customList.length > 0 && <span style={{ color: "#e8c84a" }}>({customList.length} restaurants)</span>}
                </div>
                <input
                  value={customSearch}
                  onChange={e => setCustomSearch(e.target.value)}
                  placeholder="Search for a restaurant to add..."
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "white", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", outline: "none", marginBottom: "8px" }}
                />
                {searchResults.length > 0 && (
                  <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: "10px", overflow: "hidden", marginBottom: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {searchResults.map((r, i) => (
                      <div key={r.name} onClick={() => { setCustomList(p => [...p, r]); setCustomSearch(""); }} style={{ padding: "10px 14px", cursor: "pointer", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div>
                          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "13px", fontWeight: "700", color: "white" }}>{r.name}</div>
                          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono',monospace" }}>{r.cuisine} · {r.neighborhood} · {r.price}</div>
                        </div>
                        <span style={{ color: "rgba(232,200,74,0.6)", fontSize: "16px" }}>+</span>
                      </div>
                    ))}
                  </div>
                )}
                {customList.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {customList.map(r => (
                      <div key={r.name} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px 5px 12px", borderRadius: "100px", background: "rgba(232,200,74,0.1)", border: "1px solid rgba(232,200,74,0.2)" }}>
                        <span style={{ fontSize: "12px", color: "rgba(232,200,74,0.9)", fontWeight: "600", fontFamily: "'DM Sans',sans-serif" }}>{r.name}</span>
                        <button onClick={() => setCustomList(p => p.filter(x => x.name !== r.name))} style={{ background: "none", border: "none", color: "rgba(255,80,80,0.5)", cursor: "pointer", fontSize: "13px", padding: "0", lineHeight: 1 }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* filters - only show in random mode */}
            {deckMode === "random" && (
              <>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setShowFilters(v => !v)} style={{ padding: "7px 14px", borderRadius: "100px", border: `1px solid ${totalLocks > 0 ? "rgba(232,200,74,0.4)" : "rgba(255,255,255,0.07)"}`, background: totalLocks > 0 ? "rgba(232,200,74,0.07)" : "rgba(255,255,255,0.02)", color: totalLocks > 0 ? "rgba(232,200,74,0.8)" : "rgba(255,255,255,0.3)", fontSize: "11px", fontWeight: "600", fontFamily: "'DM Mono',monospace", cursor: "pointer", letterSpacing: "1px" }}>
                    {showFilters ? "▲" : "▼"} FILTERS{totalLocks > 0 ? ` (${totalLocks} locked)` : ""}
                  </button>
                  {totalLocks > 0 && <>
                    <button onClick={() => { setLocks({ cuisine: [], neighborhood: [], price: [], vibe: [] }); setError(false); }} style={{ padding: "7px 13px", borderRadius: "100px", border: "1px solid rgba(255,80,80,0.2)", background: "rgba(255,80,80,0.05)", color: "rgba(255,110,110,0.6)", fontSize: "11px", fontWeight: "600", fontFamily: "'DM Mono',monospace", cursor: "pointer" }}>CLEAR ALL</button>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.18)", fontFamily: "'DM Mono',monospace", marginLeft: "auto" }}>{filteredPool.length} matches</span>
                  </>}
                </div>
                {showFilters && (
                  <div style={{ marginTop: "10px", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "16px", animation: "fadeUp 0.2s ease forwards" }}>
                    {sections.map(s => (
                      <div key={s.key} style={{ marginBottom: "12px" }}>
                        <div style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(255,255,255,0.22)", fontFamily: "'DM Mono',monospace", marginBottom: "7px" }}>
                          {s.label}{locks[s.key].length > 0 && <span style={{ color: s.color }}> (locked)</span>}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                          {s.opts.map(o => <Pill key={o} label={o} active={locks[s.key].includes(o)} color={s.color} onClick={() => toggle(s.key, o)} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {error && (
              <div style={{ marginTop: "8px", padding: "9px 14px", borderRadius: "10px", background: "rgba(255,80,80,0.07)", border: "1px solid rgba(255,80,80,0.18)", color: "rgba(255,120,120,0.8)", fontSize: "12px", fontFamily: "'DM Mono',monospace", animation: "shake 0.3s ease" }}>
                {deckMode === "custom" ? "Add some restaurants to your custom deck first." : "No restaurants match those filters. Try unlocking a few."}
              </div>
            )}
          </div>

          {/* felt table */}
          <div style={{ width: "100%", maxWidth: "680px", background: "linear-gradient(135deg,rgba(15,40,20,0.55),rgba(10,30,15,0.8))", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "28px", padding: "26px 14px 22px", marginBottom: "18px", boxShadow: "inset 0 2px 40px rgba(0,0,0,0.4),0 20px 60px rgba(0,0,0,0.5)", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: "1px", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)" }} />
            {phase === "idle" ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "165px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "36px", marginBottom: "8px", opacity: 0.2 }}>🂠 🂠 🂠 🂠 🂠</div>
                  <p style={{ color: "rgba(255,255,255,0.1)", fontSize: "11px", fontFamily: "'DM Mono',monospace", letterSpacing: "2px" }}>
                    {deckMode === "custom" && customList.length > 0 ? `CUSTOM DECK · ${customList.length} RESTAURANTS` : "WAITING FOR DEAL"}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", gap: "clamp(5px,1.4vw,11px)", alignItems: "flex-end", minHeight: "185px", flexWrap: "nowrap", overflow: "hidden" }}>
                {hand.map((r, i) => (
                  <Card key={`${dealCount}-${i}-${r.name}`} r={r} idx={i} flipped={flipped[i]} selected={selected === i} isWinner={phase === "winner" && selected === i} onSelect={setSelected} onDiscard={discard} />
                ))}
              </div>
            )}
          </div>

          {/* deal buttons */}
          <div style={{ display: "flex", gap: "10px", width: "100%", maxWidth: "480px", marginBottom: "18px" }}>
            {phase === "hand" && selected !== null && (
              <button onClick={confirm} style={{ flex: 2, padding: "15px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#e8c84a,#c8a020)", color: "#0a0800", fontSize: "14px", fontWeight: "800", fontFamily: "'Syne',sans-serif", letterSpacing: "1px", cursor: "pointer", boxShadow: "0 4px 24px rgba(232,200,74,0.3)", animation: "fadeUp 0.3s ease forwards" }}>
                🏆 THAT'S THE ONE
              </button>
            )}
            <button onClick={deal} disabled={phase === "dealing"} style={{ flex: phase === "hand" && selected !== null ? 1 : 2, padding: "15px", borderRadius: "14px", border: phase === "idle" ? "none" : "1px solid rgba(255,255,255,0.07)", background: phase === "idle" ? "linear-gradient(135deg,#e8c84a,#c8a020)" : phase === "dealing" ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)", color: phase === "idle" ? "#0a0800" : phase === "dealing" ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.45)", fontSize: "14px", fontWeight: "800", fontFamily: "'Syne',sans-serif", letterSpacing: "1px", cursor: phase === "dealing" ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
              {phase === "idle" ? "🃏 DEAL HAND" : phase === "dealing" ? "Dealing..." : "🔀 NEW HAND"}
            </button>
          </div>

          {/* winner card */}
          {phase === "winner" && winner && (
            <div style={{ width: "100%", maxWidth: "480px", background: "linear-gradient(135deg,rgba(232,200,74,0.09),rgba(255,255,255,0.03))", border: "1px solid rgba(232,200,74,0.22)", borderRadius: "20px", padding: "22px", marginBottom: "14px", animation: "fadeUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "13px" }}>
                <div>
                  <div style={{ fontSize: "10px", letterSpacing: "3px", color: "rgba(232,200,74,0.65)", fontFamily: "'DM Mono',monospace", marginBottom: "5px" }}>TONIGHT'S WINNER</div>
                  <h2 style={{ fontSize: "clamp(20px,5vw,28px)", fontFamily: "'Syne',sans-serif", fontWeight: "800", color: "white", lineHeight: 1.1 }}>{winner.name}</h2>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)", marginTop: "3px" }}>📍 {winner.address}, San Francisco</div>
                </div>
                <div style={{ fontSize: "28px" }}>{VIBE_ICONS[winner.vibe] || "🍽️"}</div>
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                {[winner.cuisine, winner.neighborhood, winner.price, winner.vibe].map((tag, i) => (
                  <span key={tag} style={{ padding: "4px 11px", borderRadius: "100px", fontSize: "11px", fontWeight: "600", fontFamily: "'DM Mono',monospace", background: ["rgba(232,200,74,0.12)", "rgba(192,132,252,0.12)", "rgba(52,211,153,0.12)", "rgba(248,113,113,0.12)"][i], color: ["rgba(232,200,74,0.9)", "rgba(220,180,255,0.9)", "rgba(100,230,180,0.9)", "rgba(255,160,160,0.9)"][i], border: `1px solid ${["rgba(232,200,74,0.2)", "rgba(192,132,252,0.2)", "rgba(52,211,153,0.2)", "rgba(248,113,113,0.2)"][i]}` }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <a href={winner.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: "90px", padding: "11px", borderRadius: "12px", background: "linear-gradient(135deg,rgba(96,165,250,0.8),rgba(59,130,246,0.8))", color: "white", fontSize: "12px", fontWeight: "700", fontFamily: "'Syne',sans-serif", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", letterSpacing: "1px" }}>📍 MAPS</a>
                <a href={winner.openTableUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: "90px", padding: "11px", borderRadius: "12px", background: "linear-gradient(135deg,rgba(220,80,60,0.8),rgba(190,50,40,0.8))", color: "white", fontSize: "12px", fontWeight: "700", fontFamily: "'Syne',sans-serif", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", letterSpacing: "1px" }}>🍽️ BOOK</a>
                {winner.website && (
                  <a href={winner.website} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: "90px", padding: "11px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.55)", fontSize: "12px", fontWeight: "700", fontFamily: "'Syne',sans-serif", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", letterSpacing: "1px" }}>🌐 SITE</a>
                )}
                <button onClick={() => { if (winner && !saved.find(s => s.name === winner.name)) setSaved(p => [...p, winner]); }} disabled={!!saved.find(s => s.name === winner.name)} style={{ flex: 1, minWidth: "90px", padding: "11px", borderRadius: "12px", border: "none", background: saved.find(s => s.name === winner.name) ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg,rgba(52,211,153,0.8),rgba(16,185,129,0.8))", color: saved.find(s => s.name === winner.name) ? "rgba(255,255,255,0.22)" : "white", fontSize: "12px", fontWeight: "700", fontFamily: "'Syne',sans-serif", cursor: saved.find(s => s.name === winner.name) ? "default" : "pointer", letterSpacing: "1px" }}>
                  {saved.find(s => s.name === winner.name) ? "✓ SAVED" : "♡ SAVE"}
                </button>
                <button onClick={deal} style={{ flex: 1, minWidth: "90px", padding: "11px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)", background: "transparent", color: "rgba(255,255,255,0.38)", fontSize: "12px", fontWeight: "700", fontFamily: "'Syne',sans-serif", cursor: "pointer", letterSpacing: "1px" }}>NEW →</button>
              </div>
            </div>
          )}

          {/* saved list */}
          {saved.length > 0 && (
            <div style={{ width: "100%", maxWidth: "480px" }}>
              <button onClick={() => setShowSaved(v => !v)} style={{ width: "100%", padding: "11px 16px", borderRadius: "12px", border: "1px solid rgba(232,200,74,0.1)", background: "rgba(232,200,74,0.03)", color: "rgba(232,200,74,0.55)", fontSize: "12px", fontWeight: "600", fontFamily: "'DM Mono',monospace", cursor: "pointer", display: "flex", justifyContent: "space-between", letterSpacing: "2px" }}>
                <span>🗂 SAVED LIST ({saved.length})</span><span>{showSaved ? "▲" : "▼"}</span>
              </button>
              {showSaved && (
                <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.04)", borderTop: "none", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
                  {saved.map((r, i) => (
                    <div key={r.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "14px", fontWeight: "700", color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", marginTop: "2px", fontFamily: "'DM Mono',monospace" }}>{r.neighborhood} · {r.price} · {r.vibe}</div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginLeft: "10px" }}>
                        <a href={r.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "14px", textDecoration: "none", opacity: 0.5 }}>📍</a>
                        <a href={r.openTableUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "14px", textDecoration: "none", opacity: 0.5 }}>🍽️</a>
                        <button onClick={() => setSaved(p => p.filter(s => s.name !== r.name))} style={{ background: "none", border: "none", color: "rgba(255,80,80,0.38)", cursor: "pointer", fontSize: "15px", padding: "4px" }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
