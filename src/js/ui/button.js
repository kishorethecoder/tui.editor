/**
 * @fileoverview Implements UI Button
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import ToolbarItem from './toolbarItem';
import tooltip from './tooltip';

/**
 * Class Button UI
 * @extends {ToolbarItem}
 * @deprecated
 */
class Button extends ToolbarItem {
  /**
   * item name
   * @memberof Button
   * @type {String}
   * @static
   */
  static name = 'button';

  /**
   * Creates an instance of Button.
   * @param {object} options - button options
   *  @param {string} options.className - button class name
   *  @param {string} options.command - command name to execute on click
   *  @param {Array<string>} options.params - params for the command
   *  @param {string} options.event - event name to trigger on click
   *  @param {string} options.text - text on button
   *  @param {string} options.tooltip - text on tooltip
   *  @param {string} options.style - button style
   *  @param {string} options.state - button state
   * @memberof Button
   */
  constructor(options = {
    tagName: 'button',
    name: Button.name
  }) {
    super({
      name: options.name,
      tagName: 'button',
      className: `${options.className}`,
      rootElement: options.$el
    });

    this._setOptions(options);

    this._render();
    this.on('click', this._onClick.bind(this));
    if (options.tooltip) {
      this.on('mouseover', this._onOver.bind(this));
      this.on('mouseout', this._onOut.bind(this));
    }
  }

  /**
   * set tooltip text
   * @param {string} text - tooltip text to show
   * @memberof button
   */
  setTooltip(text) {
    this._tooltip = text;
  }

  _setOptions(options) {
    this._command = options.command;
    this._event = options.event;
    this._text = options.text;
    this._tooltip = options.tooltip;
    this._params = options.params;
    this._style = options.style;
    this._state = options.state;
  }

  _render() {
    this.$el.text(this._text);
    this.$el.attr('type', 'button');

    if (this._style) {
      this.$el.attr('style', this._style);
    }
  }

  _onClick() {
    if (!this.isEnabled()) {
      return;
    }

    if (this._command) {
      if (this._params) {
        this.trigger('command', [this._command, this._params]);
      } else {
        this.trigger('command', this._command);
      }
    } else if (this._event) {
      this.trigger('event', this._event);
    }

    this.trigger('clicked');
  }

  _onOver() {
    if (!this.isEnabled()) {
      return;
    }

    tooltip.show(this.$el, this._tooltip);
  }

  _onOut() {
    tooltip.hide();
  }

  /**
   * enable button
   * @memberof Button
   */
  enable() {
    this.$el.attr('disabled', false);
  }

  /**
   * disable button
   * @memberof Button
   */
  disable() {
    this.$el.attr('disabled', true);
  }

  /**
   * check whether this button is enabled
   * @returns {Boolean} - true for enabled
   * @memberof Button
   */
  isEnabled() {
    return !(this.$el.attr('disabled'));
  }
}

export default Button;
