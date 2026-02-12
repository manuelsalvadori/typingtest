import type { Difficulty, Mode } from "../../utilities/utils";

export type ControlsProps = {
    difficulty: Difficulty;
    setDifficulty: (difficulty: Difficulty) => void;
    mode: Mode;
    setMode: (mode: Mode) => void;
    time: number;
    accuracy: number;
    wpm: number;
};

export default function Controls({
    difficulty,
    setDifficulty,
    mode,
    setMode,
    time,
    accuracy,
    wpm,
}: ControlsProps) {
    return (
        <div className="controls">
            <div className="stats">
                Time: {time}s | Accuracy: {accuracy}% | WPM: {wpm}
            </div>
            <div className="difficulty">
                <label htmlFor="difficulty">Difficulty:</label>
                <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
            <div className="mode">
                <label htmlFor="mode">Mode:</label>
                <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="timed">Timed</option>
                    <option value="words">Words</option>
                </select>
            </div>
        </div>
    );
}
