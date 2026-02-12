import Controls from "../controls/Controls";
import TypingArea from "../typing/Typing";
import styles from "./typingSession.module.css";
import { useCallback, useEffect, useState } from "react";
import type { Difficulty, Mode, Status } from "../../utilities/utils";
import useLatest from "../../hooks/useLatest";
import useTypingTimer from "../../hooks/useTypingTimer";
import data from "../../data/data.json";
import Results from "../results/Results";
import resetIcon from "@assets/images/icon-restart.svg";

type Stats = {
    errors: number;
    total: number;
};

export type TypingSessionProps = {
    difficulty: Difficulty;
    setDifficulty: (difficulty: Difficulty) => void;
    mode: Mode;
    setMode: (mode: Mode) => void;
    maxTime: number;
    onReset: () => void;
};

export default function TypingSession({
    difficulty,
    setDifficulty,
    mode,
    setMode,
    maxTime,
    onReset,
}: TypingSessionProps) {
    const [status, setStatus] = useState<Status>("idle");
    const [text] = useState(getRandomText(difficulty));
    const [stats, setStats] = useState<Stats>({ errors: 0, total: 0 });
    const [typedText, setTypedText] = useState("");

    const typedTextRef = useLatest(typedText);

    const [time] = useTypingTimer(status, mode, () => setStatus("finished"), maxTime);

    useEffect(() => {
        const handleGlobalKeydown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onReset();
                return;
            }
            if (status === "idle" && (event.key === "Enter" || event.key.length === 1))
                setStatus("active");
        };
        document.addEventListener("keydown", handleGlobalKeydown);
        return () => document.removeEventListener("keydown", handleGlobalKeydown);
    }, [status]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (status !== "active") return;

            if (event.key === "Backspace") {
                setTypedText((prev) => prev.slice(0, -1));
                return;
            }

            if (event.key.length !== 1) return;

            const currentLength = typedTextRef.current.length;
            if (currentLength >= text.length) return;

            const error = event.key !== text[currentLength] ? 1 : 0;

            setStats((prev) => ({ errors: prev.errors + error, total: prev.total + 1 }));
            setTypedText((prev) => prev + event.key);

            if (currentLength + 1 === text.length) setStatus("finished");
        },
        [text, status],
    );

    const accuracy =
        stats.total === 0 ? 100 : Math.max(0, ((stats.total - stats.errors) / stats.total) * 100);
    const wpm = time === 0 ? 0 : typedText.length / 5 / (time / 60);

    if (status === "finished") {
        return (
            <Results
                wpm={wpm}
                accuracy={accuracy}
                characterStats={{
                    correct: stats.total - stats.errors,
                    incorrect: stats.errors,
                }}
            />
        );
    }

    return (
        <>
            <Controls
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                mode={mode}
                setMode={setMode}
                time={time}
                accuracy={accuracy}
                wpm={wpm}
                timedMaxTime={maxTime}
            />
            <main className={styles.main}>
                <TypingArea text={text} typedText={typedText} handleKeyDown={handleKeyDown} />
                {status === "idle" ? (
                    <div className={styles.overlay} onClick={() => setStatus("active")}></div>
                ) : (
                    <button onClick={onReset}>
                        Restart <img src={resetIcon} alt="Reset" />
                    </button>
                )}
            </main>
        </>
    );
}

const getRandomText = (difficulty: Difficulty) => {
    const texts = data[difficulty];
    return texts[Math.floor(Math.random() * texts.length)].text;
};
