import { useCallback, useEffect, useState } from "react";
import styles from "./App.module.css";
import Typing from "./components/typing/Typing";
import useLatest from "./hooks/useLatest";
import type { Difficulty, Mode, Status } from "./utilities/utils";
import data from "./data/data.json";
import Controls from "./components/controls/Controls";

function App() {
    const [status, setStatus] = useState<Status>("idle");
    const [mode, setMode] = useState<Mode>("timed");
    const [difficulty, setDifficulty] = useState<Difficulty>("easy");

    const [text, setText] = useState(getRandomText(difficulty));

    const reset = useCallback(() => {
        const newText = getRandomText(difficulty);
        setText(newText);
        setTypedText("");
        setStatus("idle");
    }, [difficulty]);

    useEffect(() => {
        reset();
    }, [difficulty, mode]);

    const [typedText, setTypedText] = useState("");
    const typedTextRef = useLatest(typedText);

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Backspace") {
            setTypedText((prev) => prev.slice(0, -1));
            return;
        }

        if (event.key.length !== 1) return;
        if (typedTextRef.current.length === text.length) return;

        setTypedText((prev) => prev + event.key);
    };

    return (
        <div className={styles.root}>
            <header>
                <h1>Typing Speed Test</h1>
            </header>
            {status === "finished" ? (
                <div>Finished!</div>
            ) : (
                <>
                    <menu>
                        <Controls
                            difficulty={difficulty}
                            setDifficulty={setDifficulty}
                            mode={mode}
                            setMode={setMode}
                            time={0}
                            accuracy={0}
                            wpm={0}
                        />
                    </menu>
                    <main className={styles.main}>
                        <Typing text={text} typedText={typedText} handleKeyDown={handleKeyDown} />
                        {status === "idle" ? (
                            <div
                                className={styles.overlay}
                                onClick={() => setStatus("active")}></div>
                        ) : (
                            <button onClick={reset}>Reset</button>
                        )}
                    </main>
                </>
            )}
        </div>
    );
}

export default App;

const getRandomText = (difficulty: Difficulty) => {
    const texts = data[difficulty];
    return texts[Math.floor(Math.random() * texts.length)].text;
};
