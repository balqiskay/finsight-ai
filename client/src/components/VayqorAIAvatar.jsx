import { Bot } from "lucide-react";

function VayqorAIAvatar({
  size = "md",
  status = "Online",
}) {
  const sizes = {
    sm: {
      wrapper: "w-14 h-14",
      icon: 26,
    },
    md: {
      wrapper: "w-20 h-20",
      icon: 36,
    },
    lg: {
      wrapper: "w-28 h-28",
      icon: 48,
    },
  };

  const currentSize =
    sizes[size] || sizes.md;

  return (
    <div className="flex flex-col items-center">

      <div className="relative">

        <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl animate-pulse" />

        <div
          className={`${currentSize.wrapper} relative rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_45px_rgba(59,130,246,0.45)] border border-white/20`}
        >
          <Bot
            size={currentSize.icon}
            className="text-white"
          />

          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-4 border-zinc-950 shadow-[0_0_15px_rgba(74,222,128,0.9)]" />
        </div>

      </div>

      <p className="mt-4 text-white font-bold">
        Vayqor AI
      </p>

      <p className="text-xs text-zinc-500">
        {status}
      </p>

    </div>
  );
}

export default VayqorAIAvatar;