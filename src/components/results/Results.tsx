export type ResultsProps = {
    wpm: number;
    accuracy: number;
    characterStats: { correct: number; incorrect: number };
};

export default function Results({ wpm, accuracy, characterStats }: ResultsProps) {
    return (
        <div className="results">
            <h2>Results</h2>
            <p>WPM: {wpm}</p>
            <p>Accuracy: {accuracy}%</p>
            <p>
                Correct: {characterStats.correct}, Incorrect: {characterStats.incorrect}
            </p>
        </div>
    );
}
