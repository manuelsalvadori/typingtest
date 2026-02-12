import type { Difficulty, Mode } from "../../utilities/utils";
import styles from "./controls.module.css";

export type ControlsProps = {
    difficulty: Difficulty;
    setDifficulty: (difficulty: Difficulty) => void;
    mode: Mode;
    setMode: (mode: Mode) => void;
    time: number;
    accuracy: number;
    wpm: number;
    timedMaxTime?: number;
};

export default function Controls({
    difficulty,
    setDifficulty,
    mode,
    setMode,
    time,
    accuracy,
    wpm,
    timedMaxTime = 60,
}: ControlsProps) {
    const formattedTime = mode === "timed" ? (timedMaxTime - time).toFixed(1) : time.toFixed(1);

    return (
        <menu className={styles.body}>
            <div className={styles.stats}>
                <div>
                    WPM: <span className={styles.bold}>{Math.round(wpm)}</span>
                </div>
                <div>
                    Accuracy: <span className={styles.bold}>{accuracy.toFixed(0)}%</span>
                </div>
                <div>
                    Time: <span className={styles.bold}>{formattedTime}s</span>
                </div>
            </div>
            <div className={styles.controls}>
                <div className={styles.options}>
                    <label htmlFor="difficulty">Difficulty:</label>
                    <select
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <div className={styles.options}>
                    <label htmlFor="mode">Mode:</label>
                    <select
                        id="mode"
                        value={mode}
                        onChange={(e) => setMode(e.target.value as Mode)}>
                        <option value="timed">Timed</option>
                        <option value="passage">Passage</option>
                    </select>
                </div>
            </div>
        </menu>
    );
}
