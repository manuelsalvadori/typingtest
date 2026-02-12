import styles from "./header.module.css";
import logoDesktop from "@assets/images/logo-large.svg";
import logoMobile from "@assets/images/logo-small.svg";
import bestIcon from "@assets/images/icon-personal-best.svg";
import { useAtomValue } from "jotai";
import { bestScoreAtom } from "../../atoms/bestScoreAtom";
import { useMediaQuery } from "react-responsive";

export default function Header() {
    const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
    const label = isDesktop ? "Personal best:" : "Best:";

    const best = useAtomValue(bestScoreAtom);
    return (
        <header className={styles.header}>
            <picture>
                <source media="(min-width: 768px)" srcSet={logoDesktop} />
                <img src={logoMobile} alt="Typing Speed Test" className="logo" />
            </picture>
            <div className={styles.bestScore}>
                <img src={bestIcon} alt="Best Score" className="iconbest" />
                <span className="best">
                    {label} {Math.round(best)} WPM
                </span>
            </div>
        </header>
    );
}
