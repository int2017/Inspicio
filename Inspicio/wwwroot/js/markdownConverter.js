
function convertToHTML(markdown) {

    var converter = new showdown.Converter();
    converter.setFlavor('github');

    var html = converter.makeHtml(markdown);
    return html;
}