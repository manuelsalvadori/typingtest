import Controls from "../controls/Controls";
import TypingArea from "../typing/Typing";
import styles from "./typingSession.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Difficulty, Mode, Status } from "../../utilities/utils";
import useLatest from "../../hooks/useLatest";
import useTypingTimer from "../../hooks/useTypingTimer";
import data from "../../data/data.json";
import Results from "../results/Results";
import resetIcon from "@assets/images/icon-restart.svg";

export type Stats = {
    errors: number;
    total: number;
    uncorrectedErrors: number;
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
    const [stats, setStats] = useState<Stats>({ errors: 0, total: 0, uncorrectedErrors: 0 });
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
                startSession();
        };
        document.addEventListener("keydown", handleGlobalKeydown);
        return () => document.removeEventListener("keydown", handleGlobalKeydown);
    }, [status]);

    const handleKeyDown = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (status !== "active") return;

            const val = event.target.value;
            const lastChar = val.slice(-1);

            const currentLength = typedTextRef.current.length;
            if (currentLength >= text.length) return;

            if (val.length < typedTextRef.current.length) {
                if (
                    typedTextRef.current[typedTextRef.current.length - 1] !==
                    text[typedTextRef.current.length - 1]
                ) {
                    setStats((prev) => ({
                        ...prev,
                        uncorrectedErrors: prev.uncorrectedErrors - 1,
                    }));
                }
                setTypedText(val);
                return;
            }

            const error = lastChar !== text[currentLength] ? 1 : 0;

            setTypedText(val);
            setStats((prev) => ({
                errors: prev.errors + error,
                total: prev.total + 1,
                uncorrectedErrors: prev.uncorrectedErrors + error,
            }));

            if (currentLength + 1 === text.length) setStatus("finished");
        },
        [text, status],
    );

    const inputRef = useRef<HTMLInputElement>(null);

    const startSession = () => {
        inputRef.current?.focus();
        setStatus("active");
    };

    const accuracy =
        stats.total === 0 ? 100 : Math.max(0, ((stats.total - stats.errors) / stats.total) * 100);
    const wpm = time === 0 ? 0 : typedText.length / 5 / (time / 60);
    const netwpm =
        time === 0
            ? 0
            : Math.max(0, (typedText.length / 5 - stats.uncorrectedErrors) / (time / 60));

    if (status === "finished") {
        return (
            <Results
                wpm={wpm}
                netwpm={netwpm}
                accuracy={accuracy}
                characterStats={stats}
                onReset={onReset}
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
                netwpm={netwpm}
                timedMaxTime={maxTime}
            />
            <main className={styles.main}>
                <TypingArea
                    text={text}
                    typedText={typedText}
                    handleKeyDown={handleKeyDown}
                    inputRef={inputRef}
                />
                {status === "idle" ? (
                    <div className={styles.overlay} onClick={startSession}>
                        <button onClick={undefined}>Start</button>
                        <p>Or click the text to start typing</p>
                    </div>
                ) : (
                    <button onClick={onReset}>
                        Restart <img src={resetIcon} alt="Reset" />
                    </button>
                )}
                Errors: {stats.errors} Total: {stats.total} Uncorrected: {stats.uncorrectedErrors}
            </main>
        </>
    );
}

const getRandomText = (difficulty: Difficulty) => {
    const texts = data[difficulty];
    return texts[Math.floor(Math.random() * texts.length)].text;
};
