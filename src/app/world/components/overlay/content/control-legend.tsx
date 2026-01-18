/**
 * The control legend component.
 * Displays useful controls for the user.
 * 
 * @returns The control legend component.
 */
export const ControlLegend = () => (
    <div className="fixed left-[2%] top-[10%] z-50 w-[200px]">
        <div className="rounded-lg border border-primary/30 bg-background/70 p-3 text-foreground backdrop-blur-md">
            <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                <div className="text-sm text-foreground/70 font-bold">
                    CONTROLS:
                </div>
                <div className="text-sm text-foreground/70">
                    <span className="font-bold text-primary">Move</span>: WASD or Arrow Keys
                </div>
                <div className="text-sm text-foreground/70">
                    <span className="font-bold text-primary">Camera Control</span>: Left Click
                </div>
                <div className="text-sm text-foreground/70">
                    <span className="font-bold text-primary">Zoom</span>: Scroll
                </div>
                <div className="text-sm text-foreground/70">
                    <span className="font-bold text-primary">Jump</span>: Space Bar
                </div>
                <div className="text-sm text-foreground/70">
                    <span className="font-bold text-primary">Sprint</span>: Shift
                </div>
            </div>
        </div>
    </div>
)