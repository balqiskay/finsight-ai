import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-KK6J1E6GBQ");
};

export const trackPageView = (path) => {
  ReactGA.send({
    hitType: "pageview",
    page: path,
  });
};