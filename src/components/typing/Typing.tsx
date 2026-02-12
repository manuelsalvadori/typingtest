import { useEffect } from "react";
import styles from "./typing.module.css";

type TypingProps = {
    text: string;
    typedText: string;
    handleKeyDown: (event: KeyboardEvent) => void;
};

export default function TypingArea({ text, typedText, handleKeyDown }: TypingProps) {
    useEffect(() => {
        const controller = new AbortController();
        document.addEventListener("keydown", (event) => handleKeyDown(event), {
            signal: controller.signal,
        });

        return () => {
            controller.abort();
        };
    }, [handleKeyDown]);

    const handleStyle = (index: number) => {
        if (index === typedText.length) {
            return styles.cursor;
        }

        if (typedText[index] === text[index]) {
            return styles.correct;
        }

        if (typedText[index] !== text[index] && index < typedText.length) {
            return styles.incorrect;
        }
    };

    return (
        <div className={styles.body}>
            <p>
                {Array.from(text).map((char, index) => (
                    <span key={index} className={handleStyle(index)}>
                        {char}
                    </span>
                ))}
            </p>
        </div>
    );
}
