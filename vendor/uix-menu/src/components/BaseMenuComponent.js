import { Component } from '../../../uix/src/index.js';
import { copyButtonValue } from '../utils/clipboard.js';

export class BaseMenuComponent extends Component {

    render() {
        return this.template;
    }

    addEvents() {
        this.addEvent(this.scopeSelector, this.props.copyButtonSelector || '.copy-btn', 'click', this.handleCopyClick);
    }

    handleCopyClick(event) {
        const button = event.target.closest('.copy-btn');
        if (!button) {
            return;
        }

        copyButtonValue(button);
    }
}
