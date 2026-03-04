import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // get current route

  useEffect(() => {
    window.scrollTo(0, 0); // scroll to top whenever pathname changes
  }, [pathname]);

  return null;
};

export default ScrollToTop;
