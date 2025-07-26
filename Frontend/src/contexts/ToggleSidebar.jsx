import { use, useState } from "react";
import { useContext, createContext } from "react";
const ToggleContext = createContext();
const useToggle = () => useContext(ToggleContext);

const ToggleProvider = ({ children }) => {
  const [isToggle, setIsToggle] = useState(false);
  const [isToggleBtnShow, setIsToggleBtnShow] = useState(true);

  return (
    <ToggleContext.Provider
      value={{ isToggle, setIsToggle, isToggleBtnShow, setIsToggleBtnShow }}
    >
      {children}
    </ToggleContext.Provider>
  );
};

export { ToggleProvider, useToggle };
