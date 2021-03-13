const initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const root = document.getElementsByTagName("html").item(0);

root.dataset['theme'] = initialTheme;

let currentTheme = initialTheme;

const toggle = document.getElementById('theme-toggle');

const setToggleText = () => {
    if (currentTheme === 'dark') {
        toggle.innerHTML = 'Switch to light theme';
    } else {
        toggle.innerHTML = 'Switch to dark theme';
    }
};

setToggleText();

const toggleTheme = (e) => {
    e.preventDefault();
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.dataset['theme'] = currentTheme;
    setToggleText();
};

toggle.onclick = toggleTheme;
