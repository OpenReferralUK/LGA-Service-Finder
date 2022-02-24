export const basic = {
    scheme: 'basic',
    author: 'wow',
    base00: 'transparent',
    base01: '#073642',
    base02: '#586e75',
    base03: '#657b83',
    base04: '#839496',
    base05: '#93a1a1',
    base06: '#eee8d5',
    base07: '#000000',
    base08: '#dc322f',
    base09: '#cb4b16',
    base0A: '#b58900',
    base0B: '#859900',
    base0C: '#2aa198',
    base0D: '#92278f',
    base0E: '#6c71c4',
    base0F: '#d33682',
};

export const solarized = {
    scheme: 'solarized',
    author: 'ethan schoonover (http://ethanschoonover.com/solarized)',
    base00: '#002b36',
    base01: '#073642',
    base02: '#586e75',
    base03: '#657b83',
    base04: '#839496',
    base05: '#93a1a1',
    base06: '#eee8d5',
    base07: '#fdf6e3',
    base08: '#dc322f',
    base09: '#cb4b16',
    base0A: '#b58900',
    base0B: '#859900',
    base0C: '#2aa198',
    base0D: '#268bd2',
    base0E: '#6c71c4',
    base0F: '#d33682',
};

export const outputTheme = (theme: any) => {
    Object.keys(theme).map(key => {
        const div = document.createElement('div');
        const icon = document.createElement('div');
        icon.setAttribute('style', `width: 20px; height: 20px; border: solid 1px black; background-color: ${theme[key]}; display: inline-block; margin-right: 6px;`);
        const label = document.createElement('span');
        label.innerHTML = key;
        div.appendChild(icon);
        div.appendChild(label);
        document.body.appendChild(div);
    });
};