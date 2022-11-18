export const setCssVar = (name: string, value: string) => {
  document.documentElement.style.setProperty(name, value);
}

export const setCssVars = (vars: Record<string, string>) => {
  Object.entries(vars).forEach(([name, value]) => {
    setCssVar(name, value);
  });
}