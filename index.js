class DefaultComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' }); 

    this.component = document.createElement('span');
    this.component.setAttribute('class', 'main');

    this.css = '';

    this.__style = document.createElement('style');
    this.__style.textContent = '';

    this.shadowRoot.appendChild(this.__style);
    this.shadowRoot.appendChild(this.component);
  }

  attributeChangedCallback() {
    this.display();
  }

  render() {
    return null;
  }

  display() {
    this.__style.textContent = this.css;

    while(this.component.children.length > 0){
      this.component.removeChild(this.component.childNodes[0]);
    }

    this.component.appendChild(this.render());
  }

  sanitizeName(name) {
    let parts = name.split('-');

    return [parts.shift(), ...parts.map(n => n[0].toUpperCase() + n.slice(1))].join('');
  }

  setUpAccessors() {
    let attrs = this.getAttributeNames();

    attrs.forEach(name => {
        Object.defineProperty(this, this.sanitizeName(name), {
          set: (value) => this.setAttribute(name, value),
          get: _ => this.getAttribute(name),
        })
    })
  }

  connectedCallback() {
    this.setUpAccessors();
    this.display();
  }
}

class CounterComponent extends DefaultComponent {
  static observedAttributes = ['current-counter'];

  constructor() {
    super();

    this.css = `
      .main {
        display: block;
      }
      .counter {
        display: block;
        margin-left: 0.5rem;
      }
      button {
        margin: 5px;
      }
    `;
  }                 

  handleUpClick() {
    this.currentCounter++;
  }
  handleDownClick() {
    this.currentCounter--;
  }

  render() {
    const wrapper = document.createElement('div');

    const textElem = document.createElement('span');
    textElem.setAttribute('class', 'counter');
    const text = this.getAttribute('data-text');
    textElem.textContent = text.replace('$', this.currentCounter);
    wrapper.appendChild(textElem);

    const buttonUp = document.createElement('button');
    buttonUp.textContent = 'Up';
    buttonUp.addEventListener('click', this.handleUpClick.bind(this));
    wrapper.appendChild(buttonUp);

    const buttonDown = document.createElement('button');
    buttonDown.textContent = 'Down';
    buttonDown.addEventListener('click', this.handleDownClick.bind(this));
    wrapper.appendChild(buttonDown);

    return wrapper;
  }
}

customElements.define('counter-component', CounterComponent);
