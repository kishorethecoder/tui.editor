/**
 * @fileoverview Implements PopupAddImage
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import util from 'tui-code-snippet';

import LayerPopup from './layerpopup';
import i18n from '../i18n';

const CLASS_IMAGE_URL_INPUT = 'te-image-url-input';
const CLASS_ALT_TEXT_INPUT = 'te-alt-text-input';
const CLASS_OK_BUTTON = 'te-ok-button';
const CLASS_CLOSE_BUTTON = 'te-close-button';

/**
 * Class PopupAddImage
 * It implements a Image Add Popup
 * @extends {LayerPopup}
 */
class PopupAddImage extends LayerPopup {
  /**
   * Creates an instance of PopupAddImage.
   * @param {LayerPopupOption} options - layer popup option
   * @memberof PopupAddImage
   */
  constructor(options) {
    const POPUP_CONTENT = `
                <label for="">${i18n.get('Image URL')} <span style="color:red">*</span></label>
                <input type="text" class="${CLASS_IMAGE_URL_INPUT}" />
            <label for="url">${i18n.get('Description')}</label>
            <input type="text" class="${CLASS_ALT_TEXT_INPUT}" />
            <div class="te-button-section">
                <button type="button" class="${CLASS_OK_BUTTON}">${i18n.get('OK')}</button>
                <button type="button" class="${CLASS_CLOSE_BUTTON}">${i18n.get('Cancel')}</button>
            </div>
        `;
    options = util.extend({
      header: true,
      title: i18n.get('Insert image'),
      className: 'te-popup-add-image tui-editor-popup',
      content: POPUP_CONTENT
    }, options);
    super(options);
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @memberof PopupAddImage
   * @protected
   * @override
   */
  _initInstance(options) {
    super._initInstance(options);

    this.eventManager = options.eventManager;
  }

  /**
   * initialize DOM, render popup
   * @memberof PopupAddImage
   * @protected
   * @override
   */
  _initDOM() {
    super._initDOM();

    const $popup = this.$el;

    this._$imageUrlInput = $popup.find(`.${CLASS_IMAGE_URL_INPUT}`);
    this._$altTextInput = $popup.find(`.${CLASS_ALT_TEXT_INPUT}`);
    this._okBtn = $popup.find(`.${CLASS_OK_BUTTON}`);
  }

  /**
   * bind DOM events
   * @memberof PopupAddImage
   * @protected
   * @override
   */
  _initDOMEvent() {
    super._initDOMEvent();

    this.on('shown', () => {
      this._$imageUrlInput.focus();
      this._okBtn.attr('disabled', true);
    });
    this.on('hidden', () => this._resetInputs());
    this.on(`keyup .${CLASS_IMAGE_URL_INPUT}`, () => this.disableBtnOnEmptyValue());
    this.on(`click .${CLASS_CLOSE_BUTTON}`, () => this.hide());
    this.on(`click .${CLASS_OK_BUTTON}`, () => {
      const imageUrl = this._$imageUrlInput.val();
      const altText = this._$altTextInput.val();
      this._applyImage(imageUrl, altText);
      this.hide();
    });
  }

  /**
   * bind editor events
   * @memberof PopupAddImage
   * @protected
   * @abstract
   */
  _initEditorEvent() {
    super._initEditorEvent();

    this.eventManager.listen('focus', () => this.hide());
    this.eventManager.listen('closeAllPopup', () => this.hide());

    this.eventManager.listen('openPopupAddImage', () => {
      this.eventManager.emit('closeAllPopup');
      this.show();
    });
  }

  _applyImage(imageUrl, altText) {
    this.eventManager.emit('command', 'AddImage', {
      imageUrl,
      altText: altText || 'image'
    });
    this.hide();
  }

  _resetInputs() {
    this.$el.find('input').val('');
  }

  disableBtnOnEmptyValue() {
    const inputURL = this._$imageUrlInput.val().trim();
    if (inputURL.length === 0) {
      this._okBtn.attr('disabled', true);
    } else {
      this._okBtn.removeAttr('disabled');
    }
  }
}

export default PopupAddImage;
