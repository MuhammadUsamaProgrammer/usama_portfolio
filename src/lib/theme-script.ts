export const THEME_STORAGE_KEY = "theme";

/**
 * Runs in <head> before first paint: applies the saved theme, or the OS
 * preference when nothing is saved, so the page never flashes the wrong theme.
 */
export const themeInitScript = `(function(){var d=document.documentElement,t;try{t=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.dataset.theme=t;d.style.colorScheme=t})();`;
