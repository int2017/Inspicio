
function convertToHTML(markdown) {

    var converter = new showdown.Converter();
    var html = converter.makeHtml(markdown);

    return html;
}