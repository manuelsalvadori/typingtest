import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, mock, beforeEach } from "bun:test";
import { Provider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import Results from "./Results";
import { bestScoreAtom } from "../../atoms/bestScoreAtom";

// Mock delle props
const mockStats = {
    total: 100,
    errors: 5,
    uncorrectedErrors: 2,
};

const defaultProps = {
    wpm: 60,
    netwpm: 58,
    accuracy: 95.5,
    characterStats: mockStats,
    onReset: mock(), // Funzione mock di Bun
};

// Helper per inizializzare l'atomo nei test
const HydrateAtoms = ({ initialValues, children }: any) => {
    useHydrateAtoms(initialValues);
    return children;
};

const TestWrapper = ({ children, initialBest = 0 }: any) => (
    <Provider>
        <HydrateAtoms initialValues={[[bestScoreAtom, initialBest]]}>{children}</HydrateAtoms>
    </Provider>
);

describe("Componente Results", () => {
    beforeEach(() => {
        defaultProps.onReset.mockClear();
    });

    test("Renderizza correttamente tutte le statistiche", () => {
        render(
            <TestWrapper>
                <Results {...defaultProps} />
            </TestWrapper>,
        );

        expect(screen.getByText("60")).toBeInTheDocument(); // WPM
        expect(screen.getByText("58")).toBeInTheDocument(); // Net WPM
        expect(screen.getByText("95.50%")).toBeInTheDocument(); // Accuracy
        expect(screen.getByText("100")).toBeInTheDocument(); // Total Characters
        expect(screen.getByText("5")).toBeInTheDocument(); // Errors
        expect(screen.getByText("3")).toBeInTheDocument(); // Corrected Errors (5 - 2)
    });

    test("Mostra 'Baseline Established' se è la prima partita (bestScore = 0)", () => {
        render(
            <TestWrapper initialBest={0}>
                <Results {...defaultProps} />
            </TestWrapper>,
        );

        expect(screen.getByText(/Baseline Established!/i)).toBeInTheDocument();
    });

    test("Mostra 'New Personal Best' se il WPM supera il record precedente", () => {
        // Record precedente: 50, WPM attuale: 60
        render(
            <TestWrapper initialBest={50}>
                <Results {...defaultProps} wpm={60} />
            </TestWrapper>,
        );

        expect(screen.getByText(/New Personal Best!/i)).toBeInTheDocument();
        expect(screen.getByAltText(/Personal Best/i)).toBeInTheDocument();
        expect(screen.getByAltText(/Celebration/i)).toBeInTheDocument(); // Confetti
    });

    test("Mostra 'Test Complete' se il WPM NON supera il record precedente", () => {
        // Record precedente: 80, WPM attuale: 60
        render(
            <TestWrapper initialBest={80}>
                <Results {...defaultProps} wpm={60} />
            </TestWrapper>,
        );

        expect(screen.getByText(/Test Complete!/i)).toBeInTheDocument();
        expect(screen.getByText(/Solid run. Keep pushing/i)).toBeInTheDocument();
        expect(screen.getAllByAltText(/Stars/i)).toHaveLength(2);
    });

    test("Chiama onReset quando viene cliccato il pulsante", () => {
        render(
            <TestWrapper>
                <Results {...defaultProps} />
            </TestWrapper>,
        );

        const button = screen.getByRole("button", { name: /Go again/i });
        fireEvent.click(button);

        expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
    });
});
