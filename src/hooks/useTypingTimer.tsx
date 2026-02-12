import { useEffect, useState } from "react";
import type { Mode, Status } from "../utilities/utils";

export default function useTypingTimer(
    status: Status,
    mode: Mode,
    onFinish: () => void,
    maxTime: number,
) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (status !== "active") return;

        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            setTime(elapsed);

            if (mode === "timed" && elapsed >= maxTime) {
                onFinish();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [status, mode]);

    return [time, setTime] as const;
}
