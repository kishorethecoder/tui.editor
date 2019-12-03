/**
* @fileoverview Implments AddImage markdown command
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/
import CommandManager from '../commandManager';
import ImportManager from '../importManager';

const {decodeURIGraceful, encodeMarkdownCharacters, escapeMarkdownCharacters} = ImportManager;

/**
 * AddImage
 * Add Image markdown syntax to markdown Editor
 * @extends Command
 * @module markdownCommands/AddImage
 * @ignore
 */
const AddImage = CommandManager.command('markdown', /** @lends AddImage */ {
  name: 'AddImage',
  /**
   * Command Handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   * @param {object} data data for image
   */
  exec(mde, data) {
    const cm = mde.getEditor();
    const doc = cm.getDoc();

    const range = mde.getCurrentRange();

    const from = {
      line: range.from.line,
      ch: range.from.ch
    };

    const to = {
      line: range.to.line,
      ch: range.to.ch
    };

    let altText = data.altText;
    let imageUrl = data.videoUrl || data.imageUrl;
    altText = decodeURIGraceful(altText);
    altText = escapeMarkdownCharacters(altText);
    imageUrl = encodeMarkdownCharacters(imageUrl);

    let replaceText = '';
    if (data.videoUrl) {
      replaceText = `![${altText}](${imageUrl}){height="480" width="640"}`;
    } else {
      replaceText = `![${altText}](${imageUrl}){height="" width=""}`;
    }

    if (from.ch > 0) {
      replaceText = `\n\n${replaceText}`;
    }
    const isNextLineEmpty = (cm.getLine(to.line + 1) || '').trim().length === 0;
    if (!isNextLineEmpty) {
      replaceText += '\n\n';
    }
    doc.replaceRange(replaceText, from, to, '+addImage');

    cm.focus();
  }
});

export default AddImage;
