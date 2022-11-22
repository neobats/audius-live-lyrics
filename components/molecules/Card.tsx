import classNames from "classnames";
import React from "react";
import styles from "../../styles/Components.module.css";

type CardProps = {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export const Card = ({ children, ...props }: CardProps) => (
  <article>
    <div className={classNames(
      styles.card,
      props.className,
    )} {...props}>
      {children}
    </div>
  </article>
)