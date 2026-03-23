import { useState, useEffect } from "react";

const VIBE_ICONS = {
  "Date Night":"🕯️","Special Occasion":"✨","Fun & Lively":"🎉",
  "Casual":"😌","Classic SF":"🌉","Late Night":"🌙","Brunch":"☀️",
};
const ALL_PRICES = ["$","$$","$$$","$$$$"];
const SUITS = ["♠","♥","♦","♣","★"];
const DENOMS = ["A","K","Q","J","10"];
const GOLD = "#c9a84c";

function Pill({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:"4px 11px", borderRadius:"4px", cursor:"pointer",
      border:`1px solid ${active ? color+"66" : "rgba(255,255,255,0.06)"}`,
      background: active ? `${color}15` : "transparent",
      color: active ? color : "rgba(255,255,255,0.22)",
      fontSize:"10px", fontWeight:"600", fontFamily:"'DM Mono',monospace",
      transition:"all 0.15s", whiteSpace:"nowrap", letterSpacing:"0.5px",
    }}>{label}</button>
  );
}

function PlayingCard({ r, idx, flipped, selected, isWinner, onSelect, onDiscard, totalCards }) {
  const isRed = idx === 1 || idx === 2;
  const suit = SUITS[idx % SUITS.length];
  const denom = DENOMS[idx % DENOMS.length];
  const suitColor = isRed ? "#c0392b" : "#1a1008";
  const spread = totalCards === 1 ? 0 : (idx - (totalCards - 1) / 2) * (totalCards > 3 ? 9 : 11);
  const ty = selected ? -28 : isWinner ? -18 : 0;

  return (
    <div
      onClick={() => flipped && !isWinner && onSelect(idx)}
      style={{
        width:"100%", maxWidth: totalCards === 1 ? "140px" : "112px",
        aspectRatio:"2.5/3.5", position:"relative", flexShrink:0,
        cursor: flipped && !isWinner ? "pointer" : "default",
        transform:`rotate(${spread}deg) translateY(${ty}px)`,
        transition:"transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        transformOrigin:"bottom center",
      }}
    >
      {(selected || isWinner) && (
        <div style={{ position:"absolute", inset:"-6px", borderRadius:"14px", background:`radial-gradient(ellipse, ${GOLD}55 0%, transparent 65%)`, zIndex:0, filter:"blur(10px)", pointerEvents:"none" }} />
      )}
      <div style={{
        position:"absolute", inset:0, borderRadius:"10px",
        background: flipped ? "linear-gradient(160deg,#fefcf3 0%,#f7edcf 100%)" : "linear-gradient(160deg,#1c1200 0%,#0d0800 100%)",
        border: flipped ? `1.5px solid ${selected ? GOLD : "rgba(180,140,60,0.35)"}` : "1.5px solid rgba(201,168,76,0.12)",
        boxShadow: selected
          ? `0 28px 70px rgba(0,0,0,0.9), 0 0 0 1.5px ${GOLD}`
          : isWinner ? `0 22px 55px rgba(0,0,0,0.8), 0 0 0 1px ${GOLD}77`
          : "0 12px 35px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.03)",
        overflow:"hidden", zIndex:1, transition:"all 0.3s ease",
        display:"flex", flexDirection:"column",
      }}>
        {!flipped ? (
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
            <div style={{
              position:"absolute", inset:"5px", borderRadius:"6px",
              border:"1px solid rgba(201,168,76,0.15)",
              background:`repeating-linear-gradient(45deg,rgba(201,168,76,0.04) 0px,rgba(201,168,76,0.04) 1px,transparent 1px,transparent 9px),repeating-linear-gradient(-45deg,rgba(201,168,76,0.04) 0px,rgba(201,168,76,0.04) 1px,transparent 1px,transparent 9px)`,
            }} />
            <div style={{ fontSize:"20px", opacity:0.12, zIndex:1, position:"relative" }}>🍽️</div>
            <div style={{ position:"absolute", top:"7px", left:"7px", fontSize:"9px", color:`${GOLD}22`, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic" }}>D&K</div>
            <div style={{ position:"absolute", bottom:"7px", right:"7px", fontSize:"9px", color:`${GOLD}22`, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", transform:"rotate(180deg)" }}>D&K</div>
          </div>
        ) : (
          <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"7px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"3px" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", lineHeight:1.1 }}>
                <span style={{ fontSize:"13px", fontWeight:"700", color:suitColor, fontFamily:"'Cormorant Garamond',serif" }}>{denom}</span>
                <span style={{ fontSize:"10px", color:suitColor, lineHeight:1 }}>{suit}</span>
              </div>
              <span style={{
                fontSize:"8px", fontWeight:"700", fontFamily:"'DM Mono',monospace",
                color:r.price==="$$$$"?"#991b1b":r.price==="$$$"?"#92400e":r.price==="$$"?"#166534":"#1e3a5f",
                background:r.price==="$$$$"?"rgba(153,27,27,0.08)":r.price==="$$$"?"rgba(146,64,14,0.08)":"rgba(22,101,52,0.08)",
                padding:"1px 4px", borderRadius:"3px",
              }}>{r.price}</span>
            </div>
            <div style={{ height:"1px", background:"linear-gradient(90deg,transparent,rgba(160,120,40,0.25),transparent)", margin:"2px 0 5px" }} />
            <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", gap:"2px" }}>
              <div style={{ fontSize:"clamp(8px,1.5vw,11px)", fontFamily:"'Cormorant Garamond',serif", fontWeight:"700", fontStyle:"italic", color:"#1a0f02", lineHeight:1.2 }}>
                {r.name.length > 24 ? r.name.slice(0,22)+"…" : r.name}
              </div>
              <div style={{ fontSize:"8px", color:"rgba(100,70,20,0.7)", fontFamily:"'DM Mono',monospace" }}>{r.cuisine}</div>
              <div style={{ fontSize:"7px", color:"rgba(100,70,20,0.5)", fontFamily:"'DM Mono',monospace" }}>{r.neighborhood}</div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginTop:"3px" }}>
              <span style={{ fontSize:"12px" }}>{VIBE_ICONS[r.vibe]||"🍽️"}</span>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", lineHeight:1.1, transform:"rotate(180deg)" }}>
                <span style={{ fontSize:"13px", fontWeight:"700", color:suitColor, fontFamily:"'Cormorant Garamond',serif" }}>{denom}</span>
                <span style={{ fontSize:"10px", color:suitColor }}>{suit}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {flipped && !isWinner && totalCards > 1 && (
        <button onClick={e=>{e.stopPropagation();onDiscard(idx);}} style={{
          position:"absolute", top:"-8px", right:"-6px", width:"19px", height:"19px",
          borderRadius:"50%", background:"rgba(180,30,30,0.9)", border:"1px solid rgba(255,100,100,0.3)",
          color:"white", fontSize:"9px", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:10,
        }}>✕</button>
      )}
    </div>
  );
}

function WinnerCard({ winner, onSave, onDeal, saved }) {
  const alreadySaved = saved.find(s=>s.name===winner.name);
  return (
    <div style={{
      width:"100%", maxWidth:"420px",
      background:"linear-gradient(160deg,rgba(20,14,2,0.96) 0%,rgba(10,8,2,0.98) 100%)",
      border:`1px solid ${GOLD}33`, borderRadius:"10px", padding:"20px",
      backdropFilter:"blur(24px)",
      animation:"fadeUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
      boxShadow:`0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px ${GOLD}18`,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
        <div>
          <div style={{ fontSize:"8px", letterSpacing:"4px", color:`${GOLD}44`, fontFamily:"'DM Mono',monospace", marginBottom:"5px" }}>TONIGHT'S TABLE</div>
          <h2 style={{ fontSize:"clamp(18px,4vw,26px)", fontFamily:"'Cormorant Garamond',serif", fontWeight:"700", fontStyle:"italic", color:"rgba(255,255,255,0.9)", lineHeight:1.1 }}>{winner.name}</h2>
          <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.2)", marginTop:"3px", fontFamily:"'DM Mono',monospace" }}>📍 {winner.address}</div>
        </div>
        <div style={{ fontSize:"24px", opacity:0.8 }}>{VIBE_ICONS[winner.vibe]||"🍽️"}</div>
      </div>
      <div style={{ height:"1px", background:`linear-gradient(90deg,transparent,${GOLD}22,transparent)`, margin:"10px 0" }} />
      <div style={{ display:"flex", gap:"5px", flexWrap:"wrap", marginBottom:"14px" }}>
        {[winner.cuisine, winner.neighborhood, winner.price, winner.vibe].map((tag,i) => (
          <span key={tag} style={{
            padding:"3px 9px", borderRadius:"3px", fontSize:"9px", fontFamily:"'DM Mono',monospace", letterSpacing:"0.3px",
            background:["rgba(201,168,76,0.08)","rgba(139,92,246,0.08)","rgba(16,185,129,0.08)","rgba(239,68,68,0.08)"][i],
            color:["rgba(201,168,76,0.75)","rgba(196,181,253,0.75)","rgba(52,211,153,0.75)","rgba(252,165,165,0.75)"][i],
            border:`1px solid ${["rgba(201,168,76,0.15)","rgba(139,92,246,0.15)","rgba(16,185,129,0.15)","rgba(239,68,68,0.15)"][i]}`,
          }}>{tag}</span>
        ))}
      </div>
      <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
        <a href={winner.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ flex:1, minWidth:"60px", padding:"9px 6px", borderRadius:"5px", background:"rgba(59,130,246,0.7)", color:"white", fontSize:"10px", fontWeight:"700", fontFamily:"'DM Mono',monospace", textDecoration:"none", textAlign:"center", letterSpacing:"0.5px" }}>📍 MAPS</a>
        <a href={winner.openTableUrl} target="_blank" rel="noopener noreferrer" style={{ flex:1, minWidth:"60px", padding:"9px 6px", borderRadius:"5px", background:"rgba(200,60,40,0.7)", color:"white", fontSize:"10px", fontWeight:"700", fontFamily:"'DM Mono',monospace", textDecoration:"none", textAlign:"center", letterSpacing:"0.5px" }}>🍽️ BOOK</a>
        {winner.website && <a href={winner.website} target="_blank" rel="noopener noreferrer" style={{ flex:1, minWidth:"60px", padding:"9px 6px", borderRadius:"5px", border:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.03)", color:"rgba(255,255,255,0.35)", fontSize:"10px", fontWeight:"700", fontFamily:"'DM Mono',monospace", textDecoration:"none", textAlign:"center", letterSpacing:"0.5px" }}>🌐 SITE</a>}
        <button onClick={()=>{if(!alreadySaved)onSave(winner);}} disabled={!!alreadySaved} style={{ flex:1, minWidth:"60px", padding:"9px 6px", borderRadius:"5px", border:"none", background:alreadySaved?"rgba(255,255,255,0.02)":"rgba(52,211,153,0.7)", color:alreadySaved?"rgba(255,255,255,0.18)":"white", fontSize:"10px", fontWeight:"700", fontFamily:"'DM Mono',monospace", cursor:alreadySaved?"default":"pointer", letterSpacing:"0.5px" }}>{alreadySaved?"✓ SAVED":"♡ SAVE"}</button>
        <button onClick={onDeal} style={{ flex:1, minWidth:"60px", padding:"9px 6px", borderRadius:"5px", border:`1px solid ${GOLD}20`, background:`${GOLD}07`, color:`${GOLD}66`, fontSize:"10px", fontWeight:"700", fontFamily:"'DM Mono',monospace", cursor:"pointer", letterSpacing:"0.5px" }}>NEW →</button>
      </div>
    </div>
  );
}

export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [loadState, setLoadState] = useState("loading");
  const [locks, setLocks] = useState({ cuisine:[], neighborhood:[], price:[], vibe:[] });
  const [showFilters, setShowFilters] = useState(false);
  const [deckMode, setDeckMode] = useState("random");
  const [customList, setCustomList] = useState([]);
  const [customSearch, setCustomSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualForm, setManualForm] = useState({ name:"", address:"", cuisine:"", price:"$$", vibe:"Casual" });
  const [phase, setPhase] = useState("idle");
  const [hand, setHand] = useState([]);
  const [flipped, setFlipped] = useState([false,false,false,false,false]);
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
    setSearchResults(restaurants.filter(r => r.name.toLowerCase().includes(q) && !customList.find(c=>c.name===r.name)).slice(0,6));
  }, [customSearch, restaurants, customList]);

  const toggle = (key, val) => {
    setLocks(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(v=>v!==val) : [...p[key],val] }));
    setError(false);
  };

  const allCuisines = [...new Set(restaurants.map(r=>r.cuisine))].sort().slice(0,40);
  const allNeighborhoods = [...new Set(restaurants.map(r=>r.neighborhood))].filter(n=>n!=="San Francisco").sort().slice(0,25);
  const allVibes = [...new Set(restaurants.map(r=>r.vibe))].sort();
  const totalLocks = Object.values(locks).flat().length;

  const filteredPool = restaurants.filter(r =>
    (!locks.cuisine.length || locks.cuisine.includes(r.cuisine)) &&
    (!locks.neighborhood.length || locks.neighborhood.includes(r.neighborhood)) &&
    (!locks.price.length || locks.price.includes(r.price)) &&
    (!locks.vibe.length || locks.vibe.includes(r.vibe))
  );

  const dealRandom = () => {
    if (filteredPool.length < 1) { setError(true); return; }
    setError(false);
    const available = filteredPool.filter(r => !saved.find(s=>s.name===r.name));
    const hand5 = [...available].sort(()=>Math.random()-0.5).slice(0,5);
    if (!hand5.length) { setError(true); return; }
    setHand(hand5);
    setFlipped([false,false,false,false,false]);
    setSelected(null); setWinner(null);
    setPhase("dealing"); setDealCount(c=>c+1);
    hand5.forEach((_,i) => {
      setTimeout(() => {
        setFlipped(p => { const n=[...p]; n[i]=true; return n; });
        if (i===hand5.length-1) setPhase("hand");
      }, 300+i*220);
    });
  };

  const dealCustom = () => {
    if (customList.length < 1) { setError(true); return; }
    setError(false);
    const pick = customList[Math.floor(Math.random()*customList.length)];
    setHand([pick]);
    setFlipped([false]);
    setSelected(null); setWinner(null);
    setPhase("dealing"); setDealCount(c=>c+1);
    setTimeout(() => {
      setFlipped([true]);
      setTimeout(() => { setSelected(0); setWinner(pick); setPhase("winner"); }, 700);
    }, 600);
  };

  const deal = () => deckMode === "custom" ? dealCustom() : dealRandom();

  const discard = (idx) => {
    const used = hand.map(r=>r.name);
    const fresh = filteredPool.filter(r => !used.includes(r.name) && !saved.find(s=>s.name===r.name));
    if (!fresh.length) return;
    const pick = fresh[Math.floor(Math.random()*fresh.length)];
    const newHand = [...hand]; newHand[idx] = pick;
    setHand(newHand);
    setFlipped(p => { const n=[...p]; n[idx]=false; return n; });
    setTimeout(() => setFlipped(p => { const n=[...p]; n[idx]=true; return n; }), 300);
  };

  const confirm = () => { if (selected===null) return; setWinner(hand[selected]); setPhase("winner"); };

  const submitManual = () => {
    if (!manualForm.name.trim()) return;
    const name = manualForm.name.trim();
    const newR = {
      name, address:manualForm.address.trim()||name,
      cuisine:manualForm.cuisine.trim()||"Restaurant",
      price:manualForm.price, vibe:manualForm.vibe,
      neighborhood:"San Francisco",
      mapsUrl:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name+" San Francisco")}`,
      openTableUrl:`https://www.opentable.com/s?term=${encodeURIComponent(name)}&covers=2&lang=en-US`,
      website:null,
    };
    setCustomList(p => [...p, newR]);
    setManualForm({ name:"", address:"", cuisine:"", price:"$$", vibe:"Casual" });
    setShowManualAdd(false);
  };

  const sections = [
    { key:"cuisine", label:"CUISINE", opts:allCuisines, color:"#c9a84c" },
    { key:"neighborhood", label:"NEIGHBORHOOD", opts:allNeighborhoods, color:"#a78bfa" },
    { key:"price", label:"PRICE", opts:ALL_PRICES, color:"#34d399" },
    { key:"vibe", label:"VIBE", opts:allVibes, color:"#f87171" },
  ];

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(180deg,#0f0900 0%,#080600 40%,#050400 100%)",
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"0 0 60px", fontFamily:"'DM Sans',sans-serif",
      position:"relative", overflow:"hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes dealerPulse { 0%,100%{box-shadow:0 8px 32px rgba(201,168,76,0.25),inset 0 1px 0 rgba(255,255,255,0.12)} 50%{box-shadow:0 8px 44px rgba(201,168,76,0.5),inset 0 1px 0 rgba(255,255,255,0.12)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        input::placeholder { color:rgba(255,255,255,0.15); }
        select option { background:#1a1200; color:white; }
        ::-webkit-scrollbar { width:3px; } ::-webkit-scrollbar-thumb { background:rgba(201,168,76,0.2); border-radius:2px; }
      `}</style>

      {/* felt overlay */}
      <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, zIndex:0, pointerEvents:"none", background:"radial-gradient(ellipse 85% 55% at 50% 42%,rgba(10,40,15,0.5) 0%,rgba(8,28,12,0.3) 45%,transparent 70%)" }} />

      {/* table oval */}
      <div style={{ position:"fixed", top:"12%", left:"50%", transform:"translateX(-50%)", width:"min(720px,96vw)", height:"420px", borderRadius:"50%", border:"1px solid rgba(201,168,76,0.05)", boxShadow:"inset 0 0 100px rgba(10,40,15,0.35), 0 0 150px rgba(10,40,15,0.15)", zIndex:0, pointerEvents:"none" }} />

      {/* corner accent lights */}
      <div style={{ position:"fixed", top:"-8%", left:"-3%", width:"280px", height:"280px", borderRadius:"50%", background:"radial-gradient(circle,rgba(201,168,76,0.04) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", top:"-8%", right:"-3%", width:"280px", height:"280px", borderRadius:"50%", background:"radial-gradient(circle,rgba(201,168,76,0.04) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      <div style={{ position:"relative", zIndex:1, width:"100%", display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 16px 0" }}>

        {/* header */}
        <div style={{ textAlign:"center", marginBottom:"28px" }}>
          <div style={{ fontSize:"9px", letterSpacing:"6px", color:`${GOLD}40`, fontFamily:"'DM Mono',monospace", marginBottom:"10px" }}>
            {loadState==="ready" ? `${restaurants.length} RESTAURANTS · SAN FRANCISCO` : "SAN FRANCISCO"}
          </div>
          <h1 style={{
            fontSize:"clamp(32px,7vw,58px)",
            fontFamily:"'Cormorant Garamond',serif",
            fontWeight:"700", fontStyle:"italic", lineHeight:1,
            background:`linear-gradient(135deg,#e8d5a0 0%,${GOLD} 30%,#fff8e0 55%,#b8922a 75%,#e8d5a0 100%)`,
            backgroundSize:"250% auto",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            animation:"shimmer 6s linear infinite", marginBottom:"8px", letterSpacing:"-0.5px",
          }}>Dani &amp; Kerwin</h1>
          <div style={{ fontSize:"10px", letterSpacing:"5px", color:`${GOLD}38`, fontFamily:"'DM Mono',monospace" }}>WHERE WE EATING</div>
        </div>

        {loadState==="loading" && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"14px", padding:"60px 0" }}>
            <div style={{ fontSize:"30px", animation:"pulse 1.4s ease infinite" }}>🍽️</div>
            <p style={{ color:`${GOLD}30`, fontSize:"10px", fontFamily:"'DM Mono',monospace", letterSpacing:"3px" }}>LOADING RESTAURANTS</p>
          </div>
        )}

        {loadState==="error" && (
          <div style={{ padding:"16px 20px", borderRadius:"7px", background:"rgba(120,20,20,0.2)", border:"1px solid rgba(255,80,80,0.12)", color:"rgba(255,120,120,0.65)", fontSize:"11px", fontFamily:"'DM Mono',monospace", textAlign:"center", maxWidth:"360px" }}>
            Couldn't reach the restaurant service. Refresh to try again.
          </div>
        )}

        {loadState==="ready" && (
          <>
            {/* mode toggle */}
            <div style={{ display:"flex", gap:"1px", marginBottom:"20px", background:"rgba(0,0,0,0.45)", borderRadius:"7px", padding:"3px", border:`1px solid rgba(201,168,76,0.08)` }}>
              {[{id:"random",label:"🎲 Random Deck"},{id:"custom",label:"📋 Custom Deck"}].map(m => (
                <button key={m.id} onClick={()=>{setDeckMode(m.id);setPhase("idle");setWinner(null);setHand([]);setError(false);}} style={{
                  padding:"8px 18px", borderRadius:"5px", cursor:"pointer", border:"none",
                  background:deckMode===m.id?`linear-gradient(135deg,rgba(201,168,76,0.18),rgba(201,168,76,0.08))`:"transparent",
                  color:deckMode===m.id?GOLD:"rgba(255,255,255,0.22)",
                  fontSize:"11px", fontWeight:"600", fontFamily:"'DM Mono',monospace", letterSpacing:"0.5px", transition:"all 0.2s",
                  boxShadow:deckMode===m.id?`inset 0 1px 0 rgba(255,255,255,0.07)`:"none",
                }}>{m.label}</button>
              ))}
            </div>

            {/* custom deck builder */}
            {deckMode==="custom" && (
              <div style={{ width:"100%", maxWidth:"540px", marginBottom:"18px", background:"rgba(0,0,0,0.5)", border:`1px solid rgba(201,168,76,0.08)`, borderRadius:"9px", padding:"14px", backdropFilter:"blur(12px)" }}>
                <div style={{ fontSize:"8px", letterSpacing:"4px", color:`${GOLD}40`, fontFamily:"'DM Mono',monospace", marginBottom:"11px" }}>
                  BUILD YOUR DECK{customList.length>0&&<span style={{ color:GOLD }}> · {customList.length} SPOTS</span>}
                </div>

                {customList.length>0 && (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"5px", marginBottom:"9px" }}>
                    {customList.map(r => (
                      <div key={r.name} style={{ display:"flex", alignItems:"center", gap:"5px", padding:"4px 10px 4px 11px", borderRadius:"4px", background:`${GOLD}10`, border:`1px solid ${GOLD}22` }}>
                        <span style={{ fontSize:"11px", color:GOLD, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic" }}>{r.name}</span>
                        <button onClick={()=>setCustomList(p=>p.filter(x=>x.name!==r.name))} style={{ background:"none", border:"none", color:"rgba(255,80,80,0.4)", cursor:"pointer", fontSize:"11px", padding:"0", lineHeight:1 }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}

                <input value={customSearch} onChange={e=>setCustomSearch(e.target.value)} placeholder="Search restaurants to add..." style={{ width:"100%", padding:"8px 11px", borderRadius:"5px", border:"1px solid rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.03)", color:"white", fontSize:"12px", fontFamily:"'DM Sans',sans-serif", outline:"none", marginBottom:"6px" }} />

                {searchResults.length>0 && (
                  <div style={{ background:"rgba(0,0,0,0.6)", borderRadius:"5px", overflow:"hidden", marginBottom:"7px", border:"1px solid rgba(255,255,255,0.05)" }}>
                    {searchResults.map((r,i) => (
                      <div key={r.name} onClick={()=>{setCustomList(p=>[...p,r]);setCustomSearch("");}}
                        style={{ padding:"8px 11px", cursor:"pointer", borderTop:i>0?"1px solid rgba(255,255,255,0.04)":"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}
                        onMouseEnter={e=>e.currentTarget.style.background=`${GOLD}08`}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <div>
                          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"13px", color:"rgba(255,255,255,0.75)" }}>{r.name}</div>
                          <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.22)", fontFamily:"'DM Mono',monospace", marginTop:"1px" }}>{r.cuisine} · {r.neighborhood} · {r.price}</div>
                        </div>
                        <span style={{ color:`${GOLD}50`, fontSize:"14px" }}>+</span>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={()=>setShowManualAdd(v=>!v)} style={{ width:"100%", padding:"7px", borderRadius:"4px", border:`1px dashed rgba(201,168,76,0.12)`, background:"transparent", color:`${GOLD}30`, fontSize:"9px", fontFamily:"'DM Mono',monospace", cursor:"pointer", letterSpacing:"1px" }}>
                  {showManualAdd?"▲ CANCEL":"+ NOT FINDING IT? ADD MANUALLY"}
                </button>

                {showManualAdd && (
                  <div style={{ marginTop:"9px", display:"flex", flexDirection:"column", gap:"6px", animation:"fadeUp 0.2s ease forwards" }}>
                    {[{key:"name",placeholder:"Restaurant name *"},{key:"address",placeholder:"Address (optional)"},{key:"cuisine",placeholder:"Cuisine type"}].map(f => (
                      <input key={f.key} value={manualForm[f.key]} onChange={e=>setManualForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder}
                        style={{ width:"100%", padding:"8px 11px", borderRadius:"5px", border:"1px solid rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.03)", color:"white", fontSize:"12px", fontFamily:"'DM Sans',sans-serif", outline:"none" }} />
                    ))}
                    <div style={{ display:"flex", gap:"6px" }}>
                      <select value={manualForm.price} onChange={e=>setManualForm(p=>({...p,price:e.target.value}))} style={{ flex:1, padding:"8px 9px", borderRadius:"5px", border:"1px solid rgba(255,255,255,0.06)", background:"#1a1200", color:"white", fontSize:"12px", outline:"none" }}>
                        {["$","$$","$$$","$$$$"].map(p=><option key={p} value={p}>{p}</option>)}
                      </select>
                      <select value={manualForm.vibe} onChange={e=>setManualForm(p=>({...p,vibe:e.target.value}))} style={{ flex:2, padding:"8px 9px", borderRadius:"5px", border:"1px solid rgba(255,255,255,0.06)", background:"#1a1200", color:"white", fontSize:"12px", outline:"none" }}>
                        {["Casual","Date Night","Special Occasion","Fun & Lively","Brunch","Late Night","Classic SF"].map(v=><option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <button onClick={submitManual} disabled={!manualForm.name.trim()} style={{ padding:"8px", borderRadius:"5px", border:"none", background:manualForm.name.trim()?`linear-gradient(135deg,${GOLD},#a07828)`:"rgba(255,255,255,0.04)", color:manualForm.name.trim()?"#0d0800":"rgba(255,255,255,0.18)", fontSize:"10px", fontWeight:"700", fontFamily:"'DM Mono',monospace", cursor:manualForm.name.trim()?"pointer":"not-allowed", letterSpacing:"1px" }}>+ ADD TO DECK</button>
                  </div>
                )}

                {error && deckMode==="custom" && (
                  <div style={{ marginTop:"7px", padding:"7px 11px", borderRadius:"4px", background:"rgba(255,80,80,0.06)", border:"1px solid rgba(255,80,80,0.12)", color:"rgba(255,120,120,0.65)", fontSize:"10px", fontFamily:"'DM Mono',monospace", animation:"shake 0.3s ease" }}>
                    Add at least one restaurant to your custom deck first.
                  </div>
                )}
              </div>
            )}

            {/* random filters */}
            {deckMode==="random" && (
              <div style={{ width:"100%", maxWidth:"540px", marginBottom:"18px" }}>
                <div style={{ display:"flex", gap:"6px", alignItems:"center", flexWrap:"wrap" }}>
                  <button onClick={()=>setShowFilters(v=>!v)} style={{ padding:"6px 12px", borderRadius:"4px", border:`1px solid ${totalLocks>0?`${GOLD}40`:"rgba(255,255,255,0.06)"}`, background:totalLocks>0?`${GOLD}08`:"transparent", color:totalLocks>0?GOLD:"rgba(255,255,255,0.2)", fontSize:"9px", fontWeight:"600", fontFamily:"'DM Mono',monospace", cursor:"pointer", letterSpacing:"1px" }}>
                    {showFilters?"▲":"▼"} FILTERS{totalLocks>0?` · ${totalLocks} LOCKED`:""}
                  </button>
                  {totalLocks>0 && <>
                    <button onClick={()=>{setLocks({cuisine:[],neighborhood:[],price:[],vibe:[]});setError(false);}} style={{ padding:"6px 10px", borderRadius:"4px", border:"1px solid rgba(255,80,80,0.12)", background:"rgba(255,80,80,0.04)", color:"rgba(255,100,100,0.45)", fontSize:"9px", fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>CLEAR</button>
                    <span style={{ fontSize:"9px", color:"rgba(255,255,255,0.15)", fontFamily:"'DM Mono',monospace", marginLeft:"auto" }}>{filteredPool.length} matches</span>
                  </>}
                </div>
                {showFilters && (
                  <div style={{ marginTop:"7px", background:"rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:"7px", padding:"13px", animation:"fadeUp 0.2s ease forwards", backdropFilter:"blur(12px)" }}>
                    {sections.map(s => (
                      <div key={s.key} style={{ marginBottom:"9px" }}>
                        <div style={{ fontSize:"8px", letterSpacing:"3px", color:"rgba(255,255,255,0.16)", fontFamily:"'DM Mono',monospace", marginBottom:"5px" }}>
                          {s.label}{locks[s.key].length>0&&<span style={{ color:s.color }}> (locked)</span>}
                        </div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
                          {s.opts.map(o=><Pill key={o} label={o} active={locks[s.key].includes(o)} color={s.color} onClick={()=>toggle(s.key,o)} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {error && deckMode==="random" && (
                  <div style={{ marginTop:"7px", padding:"7px 11px", borderRadius:"4px", background:"rgba(255,80,80,0.06)", border:"1px solid rgba(255,80,80,0.12)", color:"rgba(255,120,120,0.65)", fontSize:"10px", fontFamily:"'DM Mono',monospace", animation:"shake 0.3s ease" }}>
                    No restaurants match those filters. Try unlocking a few.
                  </div>
                )}
              </div>
            )}

            {/* POKER TABLE */}
            <div style={{
              width:"100%", maxWidth:"680px",
              minHeight: deckMode==="custom" ? "200px" : "260px",
              position:"relative",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              marginBottom:"22px", padding:"24px 10px 34px",
            }}>
              {/* felt */}
              <div style={{
                position:"absolute", inset:0,
                borderRadius:"200px / 90px",
                background:`radial-gradient(ellipse at 50% 40%,rgba(18,55,22,0.65) 0%,rgba(12,38,16,0.55) 50%,rgba(8,24,10,0.35) 100%)`,
                border:"1px solid rgba(201,168,76,0.06)",
                boxShadow:"inset 0 2px 70px rgba(0,0,0,0.5),inset 0 0 30px rgba(12,45,16,0.3)",
              }} />
              {/* rail */}
              <div style={{
                position:"absolute", inset:"-7px",
                borderRadius:"210px / 100px",
                border:"5px solid rgba(60,35,5,0.55)",
                boxShadow:"0 10px 50px rgba(0,0,0,0.55),inset 0 2px 0 rgba(255,255,255,0.02)",
                pointerEvents:"none", zIndex:0,
              }} />
              {/* watermark */}
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(22px,4.5vw,38px)", color:`${GOLD}07`, letterSpacing:"2px", whiteSpace:"nowrap", pointerEvents:"none", zIndex:1 }}>
                Dani &amp; Kerwin
              </div>

              <div style={{ position:"relative", zIndex:2, width:"100%", display:"flex", flexDirection:"column", alignItems:"center" }}>
                {phase==="idle" && (
                  <p style={{ color:`${GOLD}18`, fontSize:"10px", fontFamily:"'DM Mono',monospace", letterSpacing:"4px", padding:"16px 0" }}>
                    {deckMode==="custom"&&customList.length>0?`${customList.length} RESTAURANTS IN DECK`:"WAITING FOR DEAL"}
                  </p>
                )}
                {phase!=="idle" && deckMode==="random" && (
                  <div style={{ display:"flex", justifyContent:"center", gap:"clamp(5px,1.3vw,10px)", alignItems:"flex-end", width:"100%", padding:"0 6px" }}>
                    {hand.map((r,i) => (
                      <PlayingCard key={`${dealCount}-${i}-${r.name}`} r={r} idx={i} flipped={flipped[i]} selected={selected===i} isWinner={phase==="winner"&&selected===i} onSelect={setSelected} onDiscard={discard} totalCards={hand.length} />
                    ))}
                  </div>
                )}
                {phase!=="idle" && deckMode==="custom" && (
                  <div style={{ display:"flex", justifyContent:"center", padding:"8px 0 16px" }}>
                    {hand.map((r,i) => (
                      <PlayingCard key={`${dealCount}-${i}-${r.name}`} r={r} idx={2} flipped={flipped[i]} selected={false} isWinner={phase==="winner"} onSelect={()=>{}} onDiscard={()=>{}} totalCards={1} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* dealer chip + confirm */}
            <div style={{ display:"flex", gap:"12px", alignItems:"center", marginBottom:"20px", flexWrap:"wrap", justifyContent:"center" }}>
              {phase==="hand" && selected!==null && deckMode==="random" && (
                <button onClick={confirm} style={{ padding:"11px 22px", borderRadius:"5px", border:"none", background:`linear-gradient(135deg,${GOLD},#9a7220)`, color:"#0d0800", fontSize:"11px", fontWeight:"700", fontFamily:"'DM Mono',monospace", letterSpacing:"1px", cursor:"pointer", boxShadow:`0 4px 20px ${GOLD}40`, animation:"fadeUp 0.3s ease forwards" }}>
                  🏆 THAT'S THE ONE
                </button>
              )}
              <button
                onClick={deal}
                disabled={phase==="dealing"}
                style={{
                  width:"68px", height:"68px", borderRadius:"50%",
                  border:`2.5px solid ${GOLD}`,
                  background:phase==="dealing"?"rgba(0,0,0,0.6)":`radial-gradient(circle at 35% 35%,#2c2000,#1a1200)`,
                  color:phase==="dealing"?`${GOLD}22`:GOLD,
                  fontSize:"9px", fontWeight:"700", fontFamily:"'DM Mono',monospace",
                  letterSpacing:"0.5px", cursor:phase==="dealing"?"not-allowed":"pointer",
                  boxShadow:phase==="dealing"?"none":`0 8px 28px rgba(201,168,76,0.22),inset 0 1px 0 rgba(255,255,255,0.1),inset 0 -2px 0 rgba(0,0,0,0.3)`,
                  animation:phase==="idle"?"dealerPulse 2.5s ease infinite":"none",
                  transition:"all 0.2s",
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"2px",
                }}
              >
                <span style={{ fontSize:"17px" }}>{phase==="dealing"?"⏳":phase==="idle"?"🃏":"🔀"}</span>
                <span style={{ fontSize:"7px" }}>{phase==="idle"?"DEAL":phase==="dealing"?"...":"NEW"}</span>
              </button>
            </div>

            {phase==="winner" && winner && (
              <WinnerCard winner={winner} onSave={r=>{if(!saved.find(s=>s.name===r.name))setSaved(p=>[...p,r]);}} onDeal={deal} saved={saved} />
            )}

            {saved.length>0 && (
              <div style={{ width:"100%", maxWidth:"420px", marginTop:"12px" }}>
                <button onClick={()=>setShowSaved(v=>!v)} style={{ width:"100%", padding:"9px 14px", borderRadius:"5px", border:`1px solid ${GOLD}12`, background:"rgba(0,0,0,0.4)", color:`${GOLD}40`, fontSize:"9px", fontFamily:"'DM Mono',monospace", cursor:"pointer", display:"flex", justifyContent:"space-between", letterSpacing:"2px", backdropFilter:"blur(8px)" }}>
                  <span>🗂 SAVED · {saved.length}</span><span>{showSaved?"▲":"▼"}</span>
                </button>
                {showSaved && (
                  <div style={{ background:"rgba(0,0,0,0.65)", border:`1px solid ${GOLD}0d`, borderTop:"none", borderRadius:"0 0 5px 5px", overflow:"hidden", backdropFilter:"blur(16px)" }}>
                    {saved.map((r,i) => (
                      <div key={r.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", borderTop:i>0?"1px solid rgba(255,255,255,0.04)":"none" }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"14px", color:"rgba(255,255,255,0.7)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.name}</div>
                          <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.18)", marginTop:"2px", fontFamily:"'DM Mono',monospace" }}>{r.neighborhood} · {r.price} · {r.vibe}</div>
                        </div>
                        <div style={{ display:"flex", gap:"7px", alignItems:"center", marginLeft:"8px" }}>
                          <a href={r.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize:"12px", textDecoration:"none", opacity:0.3 }}>📍</a>
                          <a href={r.openTableUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize:"12px", textDecoration:"none", opacity:0.3 }}>🍽️</a>
                          <button onClick={()=>setSaved(p=>p.filter(s=>s.name!==r.name))} style={{ background:"none", border:"none", color:"rgba(255,80,80,0.28)", cursor:"pointer", fontSize:"12px", padding:"4px" }}>✕</button>
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
    </div>
  );
}
