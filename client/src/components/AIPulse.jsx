function AIPulse({
  size = "md",
  label = "Vayqor AI Core",
}) {
  const sizes = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-40 h-40",
    xl: "w-56 h-56",
  };

  return (
    <div className="relative flex flex-col items-center justify-center">

      <div className={`relative ${sizes[size]} flex items-center justify-center`}>

        {/* outer glow */}
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-[45px] animate-pulse" />

        {/* rotating rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-300/40 animate-spin [animation-duration:7s]" />
        <div className="absolute inset-3 rounded-full border border-blue-500/40 animate-spin [animation-duration:10s] [animation-direction:reverse]" />
        <div className="absolute inset-6 rounded-full border border-purple-400/30 animate-spin [animation-duration:14s]" />

        {/* segmented tron ring */}
        <div className="absolute inset-1 rounded-full border-t-2 border-cyan-300 border-r-2 border-r-transparent border-b-2 border-b-blue-500 border-l-2 border-l-transparent animate-spin [animation-duration:4s]" />

        <div className="absolute inset-5 rounded-full border-t-2 border-purple-400 border-r-2 border-r-transparent border-b-2 border-b-cyan-400 border-l-2 border-l-transparent animate-spin [animation-duration:6s] [animation-direction:reverse]" />

        {/* core */}
        <div className="absolute inset-10 rounded-full bg-gradient-to-br from-cyan-300 via-blue-500 to-purple-700 shadow-[0_0_60px_rgba(34,211,238,0.85)]" />

        <div className="absolute inset-14 rounded-full bg-white/40 blur-md" />

        {/* center dot */}
        <div className="absolute w-5 h-5 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,1)]" />

        {/* scanning lines */}
        <div className="absolute w-full h-[1px] bg-cyan-300/50 animate-pulse" />
        <div className="absolute h-full w-[1px] bg-blue-300/40 animate-pulse" />

        {/* orbit dots */}
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_15px_rgba(34,211,238,1)] animate-ping" />
        <div className="absolute bottom-4 right-5 w-2 h-2 bg-purple-300 rounded-full shadow-[0_0_15px_rgba(216,180,254,1)] animate-pulse" />
        <div className="absolute left-4 bottom-10 w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_15px_rgba(147,197,253,1)] animate-ping" />

      </div>

      <p className="mt-5 text-xs uppercase tracking-[0.35em] text-cyan-300 font-bold">
        {label}
      </p>

    </div>
  );
}

export default AIPulse;