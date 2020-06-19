const openTagStartRegex = /<[p|b|i|].*? /g;
const openTagEndRegex = />\b/g;
const endTagRegex = /<\/.*>/g;
const classAttributeRegex = /class=/g;
const classValueRegex = /(".*")/g;
const nodeValueRegex = />(.*)<\//g;

const buttonEnum = {
    SIZE: {
        SMALL: 'button--base-sm',
        LARGE: 'button--base-lg'
    },
    STATE: {
        PRIMARY: 'button--primary-light',
        SECONDARY: 'button--secondary',
        DANGER: 'button--warning',
        DISABLED: 'button--disabled'
    },
    LOOK: {
        FILL: 'button--filled',
        OUTLINE: ''
    }
}

const buttonConfig = {
    size: {
        type: 'radio',
        options: [
            {
                text: 'Small',
                value: 'small'
            },
            {
                text: 'Large',
                value: 'large'
            }
        ]
    },
    state: {
        type: 'radio',
        options: [
            {
                text: 'Primary',
                value: 'primary'
            },
            {
                text: 'Secondary',
                value: 'secondary'
            },
            {
                text: 'Danger',
                value: 'danger'
            },
            {
                text: 'Disabled',
                value: 'disabled'
            }
        ]
    },
    look: {
        type: 'radio',
        options: [
            {
                text: 'Outline',
                value: 'outline'
            },
            {
                text: 'Fill',
                value: 'fill'
            }
        ]
    }
}

const configOptionsElement = document.querySelector('.configurator__options');
const configResultElement = document.querySelector('.configurator__result');
const codeAreaElement = document.querySelector('code');

const switchNavigationListState = (link) => {
    const activeListItem = document.querySelector('.navigation__list .active');
    if (activeListItem) activeListItem.classList.remove('active');

    link.parentElement.classList.add('active');
}

const getComponentConfig = (component) => {
    switch (component) {
        case 'button': return buttonConfig;
    }
}

const getComponentEnum = (component) => {
    switch (component) {
        case 'button': return buttonEnum;
    }
}

const getComponentElement = (component) => {
    switch (component) {
        case 'button':
            let element = document.createElement('button');
            element.innerText = "Action";
            return element;
    }
}

const getComponentTemplate = (component) => {
    switch (component) {
        case 'button': 
            return `<button class="">Action</button>`;
    }
}

const getComponentPrefix = (component) => {
    switch (component) {
        case 'button': return "button";
    }
}

const renderOptions = (component) => {
    const config = getComponentConfig(component);
    if (!config) return;

    try {
        const settings = Object.keys(config);
        const configFragment = new DocumentFragment();

        for (let s of settings) {
            let options = config[s].options;
            let settingWrapper = document.createElement('div');
            let settingHeader = document.createElement('p');

            settingHeader.innerText = s;
            settingHeader.classList.add('option__header');
            settingWrapper.classList.add('option__wrapper');
            settingWrapper.appendChild(settingHeader);

            for (let i in options) {
                let o = options[i];
                let label = document.createElement('label');
                let input = document.createElement('input');
                let formInput = document.createElement('div');

                label.innerText = o.text;
                label.setAttribute('for', o.value);

                input.setAttribute('type', config[s].type);
                input.setAttribute('name', s);
                input.setAttribute('value', o.value);

                if (parseInt(i) === 0) {
                    input.setAttribute('checked', true);
                }

                formInput.appendChild(input);
                formInput.appendChild(label);
                formInput.classList.add('option__field')
                settingWrapper.appendChild(formInput);
            }

            configFragment.appendChild(settingWrapper);
        }

        configOptionsElement.innerHTML = '';
        configOptionsElement.appendChild(configFragment);

        renderElement(component);
    } catch (e) {
        console.log(e);
    }
}

const renderElement = (component) => {
    let template = getComponentTemplate(component);
    if (!template) return;

    let classPrefix = getComponentPrefix(component);
    let classString = getClassString(component);

    classString = classString.replace(/\s{2,}/g, "");   // remove blocks of whitespaces
    template = template.replace(classValueRegex, `"${classPrefix} ${classString}"`)
    
    configResultElement.innerHTML = template;
    displayCodeTemplate(template);
}

const getClassString = (component) => {
    let classString = '';
    let options = [...document.querySelectorAll('input')].filter(o => o.checked === true);

    const componentEnum = getComponentEnum(component);
    if (!componentEnum) return;

    for (let o of options) {
        const name = o.getAttribute('name').toUpperCase();
        const value = o.getAttribute('value').toUpperCase();

        classString += `${componentEnum[name][value]} `;
    }

    return classString;
}

const displayCodeTemplate = (template) => {     // not global and multiline
    codeAreaElement.innerText = template;
}

const init = () => {
    document.querySelector('.navigation__list li a').click();
}

document.querySelector('.navigation__list').addEventListener('click', () => {
    event.preventDefault();

    const targetElement = event.target;
    if (targetElement.nodeName.toLowerCase() !== 'a') return;

    const component = targetElement.getAttribute('data-component');
    if (!component) return;

    switchNavigationListState(targetElement);
    renderOptions(component);
});

configOptionsElement.addEventListener('click', () => {
    let targetElement = event.target;
    if (targetElement.nodeName.toLowerCase() !== 'input') return;
    
    let selectedLink = document.querySelector('.navigation__list .active').firstElementChild;
    let component = selectedLink.getAttribute('data-component');

    renderElement(component);
})

init();
