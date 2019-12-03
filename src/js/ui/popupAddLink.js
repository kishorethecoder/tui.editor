/**
 * @fileoverview Implements PopupAddLink
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import util from 'tui-code-snippet';
import $ from 'jquery';
import LayerPopup from './layerpopup';
import i18n from '../i18n';

/**
 * Class PopupAddLink
 * It implements a link Add Popup
 * @extends {LayerPopup}
 */
class PopupAddLink extends LayerPopup {
  /**
   * Creates an instance of PopupAddLink.
   * @param {LayerPopupOption} options - layer popup options
   * @memberof PopupAddLink
   */
  constructor(options) {
    const POPUP_CONTENT = `
            <label for="linkText">${i18n.get('Link text')}</label>
            <input type="text" class="te-link-text-input" />
            <label for="url">${i18n.get('URL')}</label>
            <input type="text" class="te-url-input" />
            <div class="custom-control ml-1 custom-checkbox custom-control-inline">
              <input type="checkbox" id="chknewWindow"  class="custom-control-input">
              <label class="mt-1 custom-control-label" for="chknewWindow">Open in new tab</label>
            </div>
            <div class="float-right mb-2 d-inline te-link te-button-section">
                <button type="button" class="te-ok-button">${i18n.get('OK')}</button>
                <button type="button" class="te-close-button">${i18n.get('Cancel')}</button>
            </div>
        `;
    options = util.extend({
      header: true,
      title: i18n.get('Insert link'),
      className: 'te-popup-add-link tui-editor-popup',
      content: POPUP_CONTENT
    }, options);
    super(options);
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @memberof PopupAddLink
   * @protected
   * @override
   */
  _initInstance(options) {
    super._initInstance(options);

    this._editor = options.editor;
    this._eventManager = options.editor.eventManager;
  }

  /**
   * initialize DOM, render popup
   * @memberof PopupAddLink
   * @protected
   * @override
   */
  _initDOM() {
    super._initDOM();

    const el = this.$el.get(0);
    this._inputText = el.querySelector('.te-link-text-input');
    this._inputURL = el.querySelector('.te-url-input');
    this._chknewWindow = el.querySelector('#chknewWindow');
    this._okBtn = el.querySelector('.te-link .te-ok-button');
  }

  /**
   * bind DOM events
   * @memberof PopupAddLink
   * @protected
   * @override
   */
  _initDOMEvent() {
    super._initDOMEvent();
    this.on('keyup .te-url-input', () => this.disableBtnOnEmptyValue());
    this.on('paste .te-url-input', () => this.disableBtnOnEmptyValue());
    this.on('click .te-close-button', () => this.hide());
    this.on('click .te-ok-button', () => this._addLink());
    this.on('shown', () => {
      const inputText = this._inputText;
      const inputURL = this._inputURL;
      this._okBtn.disabled = true;

      const selectedText = this._editor.getSelectedText().trim();

      inputText.value = selectedText;

      if (selectedText.length > 0 && inputURL.value.length < 1) {
        inputURL.focus();
      } else {
        inputText.focus();
        inputText.setSelectionRange(0, selectedText.length);
      }
      this.disableBtnOnEmptyValue();
    });

    this.on('hidden', () => {
      this._resetInputs();
    });
  }

  /**
   * bind editor events
   * @memberof PopupAddLink
   * @protected
   * @abstract
   */
  _initEditorEvent() {
    super._initEditorEvent();

    const eventManager = this._eventManager;
    eventManager.listen('focus', () => this.hide());
    eventManager.listen('closeAllPopup', () => this.hide());
    eventManager.listen('openPopupAddLink', () => {
      eventManager.emit('closeAllPopup');
      this.show();
    });
  }

  _addLink() {
    const {
      url,
      linkText,
      openinNewWindow
    } = this._getValue();

    this._clearValidationStyle();

    if (linkText.length < 1) {
      $(this._inputText).addClass('wrong');

      return;
    }

    this._eventManager.emit('command', 'AddLink', {
      linkText,
      url,
      openinNewWindow
    });
    this.hide();
  }

  _getValue() {
    const url = this._inputURL.value;
    const linkText = this._inputText.value;
    const openinNewWindow = this._chknewWindow.checked;

    return {
      url,
      linkText,
      openinNewWindow
    };
  }

  _clearValidationStyle() {
    $(this._inputURL).removeClass('wrong');
    $(this._inputText).removeClass('wrong');
  }

  disableBtnOnEmptyValue() {
    const inputURL = this._inputURL.value.trim();
    this._okBtn.disabled = inputURL.length === 0;
  }

  _resetInputs() {
    this._inputText.value = '';
    this._inputURL.value = '';
    this._chknewWindow.checked = false;
    this._clearValidationStyle();
  }
}

export default PopupAddLink;
