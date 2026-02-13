import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { bestScoreAtom } from "../../atoms/bestScoreAtom";
import iconBest from "@assets/images/icon-new-pb.svg";
import iconCompleted from "@assets/images/icon-completed.svg";
import styles from "./results.module.css";
import resetIcon from "@assets/images/icon-restart.svg";
import confetti from "@assets/images/pattern-confetti.svg";
import star1 from "@assets/images/pattern-star-1.svg";
import star2 from "@assets/images/pattern-star-2.svg";

export type ResultsProps = {
    wpm: number;
    accuracy: number;
    characterStats: { correct: number; incorrect: number };
    onReset: () => void;
};

export default function Results({ wpm, accuracy, characterStats, onReset }: ResultsProps) {
    const [bestScore, setBestScore] = useAtom(bestScoreAtom);
    const oldBest = useRef(bestScore);

    useEffect(() => {
        setBestScore((currentBest) => Math.max(currentBest, wpm));
    }, [wpm, setBestScore]);

    const isNewBest = wpm > oldBest.current;
    const title =
        oldBest.current === 0
            ? "Baseline Established!"
            : isNewBest
              ? "New Personal Best!"
              : "Test Complete!";
    const subtitle =
        oldBest.current === 0
            ? "You've set the bar. Now the real challenge begins - time to beat it."
            : isNewBest
              ? "You're getting faster. That was incredible typing."
              : "Solid run. Keep pushing to beat your high score.";

    return (
        <div className={styles.results}>
            <img
                src={isNewBest && oldBest.current > 0 ? iconBest : iconCompleted}
                alt={isNewBest ? "Personal Best" : "Completed"}
            />
            <div className={styles.titleContainer}>
                <h2>{title}</h2>
                <p className={styles.subtitle}>{subtitle}</p>
            </div>
            <div className={styles.cards}>
                <ResultCard label="WPM:" value={Math.round(wpm).toString()} />
                <ResultCard label="Accuracy:" value={`${accuracy.toFixed(2)}%`} />
                <ResultCard
                    label="Characters:"
                    value={`${characterStats.correct}/${characterStats.incorrect}`}
                />
            </div>
            <button onClick={onReset}>
                Go again <img src={resetIcon} alt="Reset" />
            </button>
            {isNewBest && oldBest.current > 0 ? (
                <img className={styles.confetti} src={confetti} alt="Celebration" />
            ) : (
                <div className={styles.stars}>
                    <img src={star2} alt="Stars" />
                    <img src={star1} alt="Stars" />
                </div>
            )}
        </div>
    );
}

function ResultCard({ label, value }: { label: string; value: string }) {
    return (
        <div className={styles.resultCard}>
            <p className={styles.subtitle}>{label}</p>
            <h3>{value}</h3>
        </div>
    );
}
