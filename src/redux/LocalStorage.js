// localStorage.js
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("transaksiState");
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("transaksiState", serializedState);
  } catch {
     ;
  }
};
