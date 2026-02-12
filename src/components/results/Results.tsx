import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { bestScoreAtom } from "../../atoms/bestScoreAtom";
import iconBest from "@assets/images/icon-new-pb.svg";
import iconCompleted from "@assets/images/icon-completed.svg";

export type ResultsProps = {
    wpm: number;
    accuracy: number;
    characterStats: { correct: number; incorrect: number };
};

export default function Results({ wpm, accuracy, characterStats }: ResultsProps) {
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
              : "Test Completed!";

    return (
        <div className="results">
            <img
                src={isNewBest && oldBest.current > 0 ? iconBest : iconCompleted}
                alt={isNewBest ? "Personal Best" : "Completed"}
            />
            <h2>{title}</h2>
            <p>Old Best Score: {oldBest.current}</p>
            <p>WPM: {Math.round(wpm)}</p>
            <p>Accuracy: {accuracy}%</p>
            <p>
                Correct: {characterStats.correct}, Incorrect: {characterStats.incorrect}
            </p>
        </div>
    );
}
