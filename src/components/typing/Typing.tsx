import styles from "./typing.module.css";

type TypingProps = {
    text: string;
    typedText: string;
    handleKeyDown: (event: React.ChangeEvent<HTMLInputElement>) => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
};

export default function TypingArea({ text, typedText, handleKeyDown, inputRef }: TypingProps) {
    // useEffect(() => {
    //     const controller = new AbortController();
    //     document.addEventListener("keydown", (event) => handleKeyDown(event), {
    //         signal: controller.signal,
    //     });

    //     return () => {
    //         controller.abort();
    //     };
    // }, [handleKeyDown]);

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
            <input
                ref={inputRef}
                type="text"
                className={styles.hiddenInput}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                inputMode="text"
                onChange={handleKeyDown}
            />
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
