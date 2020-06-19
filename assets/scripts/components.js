let classRegex = /(\bclass=)/gm;
let classValueRegex = /(".+")/gm;
let textContentRegex = />(.+)<\//gm;

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
                value: 'danger'
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

const getComponentTemplate = (component) => {
    switch (component) {
        case 'button': 
            return `<button class="button button--base-sm button--primary-dark">
                        Action
                    </button>`;
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

    let classString = getClassString();

    configResultElement.innerHTML = ''
    configResultElement.innerHTML = template;
}

const getClassString = () => {
    let options = document.querySelectorAll('input[checked=true]');
    let classString = '';

    return classString;
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
})

init();
