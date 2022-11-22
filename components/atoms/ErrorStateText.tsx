import styles from "../../styles/Atoms.module.css";
type ErrorStateTextProps = {
  children?: React.ReactNode;
  errorTitle?: string;
  text: string;
}
export const ErrorStateText = ({
  errorTitle = "Error",
  text,
}: ErrorStateTextProps) => (
  <article>
    <h1>{errorTitle}</h1>
    <p className={styles.errorStateText}>
      {text}
    </p>
  </article>
)