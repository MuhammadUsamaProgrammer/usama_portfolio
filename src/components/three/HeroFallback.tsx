/**
 * Static CSS rendition of the 3D sculpture. Shown while WebGL loads,
 * when WebGL is unavailable, and as the server-rendered first paint.
 */
export function HeroFallback() {
  const pane =
    "absolute h-[62%] w-[30%] rounded-[1.4rem] border border-white/80 " +
    "bg-[linear-gradient(150deg,rgba(255,255,255,0.85),rgba(232,239,255,0.45)_55%,rgba(255,255,255,0.7))] " +
    "shadow-[0_30px_60px_-30px_rgba(23,23,23,0.25),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-sm " +
    "dark:border-white/15 dark:bg-[linear-gradient(150deg,rgba(255,255,255,0.16),rgba(120,150,230,0.07)_55%,rgba(255,255,255,0.08))] " +
    "dark:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)]";

  return (
    <div className="absolute inset-0 [perspective:1200px]">
      <div className="absolute inset-0 [transform-style:preserve-3d] [transform:rotateX(8deg)_rotateY(-24deg)]">
        <div className={`${pane} left-[20%] top-[14%] animate-float-slow [--r:-4deg]`} />
        <div
          className={`${pane} left-[35%] top-[19%] animate-float-slow [--r:0deg] [animation-delay:-2s]`}
        />
        <div
          className={`${pane} left-[50%] top-[24%] animate-float-slow [--r:4deg] [animation-delay:-4s]`}
        />
      </div>
      {/* Kept outside the rotated plane so it stays perfectly round. */}
      <div className="absolute left-[53%] top-[30%] aspect-square w-[10%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#8fb6ff,#3478F6_55%,#1f5fd6)] shadow-[0_16px_30px_-12px_rgba(52,120,246,0.55)]" />
    </div>
  );
}
