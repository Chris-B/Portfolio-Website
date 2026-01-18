import { useState, useEffect } from "react"

export const useTouchDetection = () => {
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia("(pointer: coarse)");
            setIsTouchDevice(mediaQuery.matches);

            // Listen for changes in input device type (e.g., connecting/disconnecting a mouse)
            const handleChange = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
            if (typeof mediaQuery.addEventListener === 'function') {
                mediaQuery.addEventListener("change", handleChange);
            } else if (typeof (mediaQuery as any).addListener === 'function') {
                (mediaQuery as any).addListener(handleChange);
            }

            return () => {
                if (typeof mediaQuery.removeEventListener === 'function') {
                    mediaQuery.removeEventListener("change", handleChange);
                } else if (typeof (mediaQuery as any).removeListener === 'function') {
                    (mediaQuery as any).removeListener(handleChange);
                }
            };
        }
    }, []);

    return isTouchDevice;
}