import { useState } from "react";
import styles from "./App.module.css";
import type { Difficulty, Mode } from "./utilities/utils";
import TypingSession from "./components/typingSession/TypingSession";

const TIMED_MAX_TIME = 60;

function App() {
    const [mode, setMode] = useState<Mode>("timed");
    const [difficulty, setDifficulty] = useState<Difficulty>("easy");
    const [resetKey, setResetKey] = useState(0);

    const reset = () => {
        setResetKey((prev) => prev + 1);
    };

    return (
        <div className={styles.root}>
            <header>
                <h1>Typing Speed Test</h1>
            </header>
            <TypingSession
                key={`${resetKey}-${difficulty}-${mode}`} // Force remount on reset, difficulty or mode change
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                mode={mode}
                setMode={setMode}
                maxTime={TIMED_MAX_TIME}
                onReset={reset}
            />
        </div>
    );
}

export default App;
