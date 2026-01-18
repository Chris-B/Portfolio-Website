export const ControlLegend = () => (
    <div className="fixed left-[2%] top-[10%] z-50 w-[200px]">
        <div className="rounded-lg border border-cyan-500/30 bg-black/70 p-3 text-white backdrop-blur-md">
            <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                <div className="text-sm text-white/70 font-bold">
                    CONTROLS:
                </div>
                <div className="text-sm text-white/70">
                    <span className="font-bold text-cyan-500">Move</span>: WASD or Arrow Keys
                </div>
                <div className="text-sm text-white/70">
                    <span className="font-bold text-cyan-500">Camera Control</span>: Left Click
                </div>
                <div className="text-sm text-white/70">
                    <span className="font-bold text-cyan-500">Zoom</span>: Scroll
                </div>
                <div className="text-sm text-white/70">
                    <span className="font-bold text-cyan-500">Jump</span>: Space Bar
                </div>
                <div className="text-sm text-white/70">
                    <span className="font-bold text-cyan-500">Sprint</span>: Shift
                </div>
            </div>
        </div>
    </div>
)