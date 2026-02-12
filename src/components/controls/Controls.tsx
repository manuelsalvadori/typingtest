import type { Difficulty, Mode } from "../../utilities/utils";

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
        <div className="controls">
            <div className="stats">
                Time: {formattedTime}s | Accuracy: {accuracy.toFixed(0)}% | WPM: {Math.round(wpm)}
            </div>
            <div className="difficulty">
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
            <div className="mode">
                <label htmlFor="mode">Mode:</label>
                <select id="mode" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
                    <option value="timed">Timed</option>
                    <option value="passage">Passage</option>
                </select>
            </div>
        </div>
    );
}
