import styles from "../../styles/Components.module.css";

type FooterProps = {
  copyright: string
}

export const Footer = ({ copyright}) => (
  <footer className={styles.footer}>
    <p>
      Made with{" "}
      <span role="img" aria-label="headphones">
        🎧
      </span>{" "}
      in the JAX metro
    </p>
    <p>{copyright}</p>
  </footer>
)