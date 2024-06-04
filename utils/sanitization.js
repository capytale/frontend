
export const richContentToPlainText = ((src) => {
    // return src
    if (src && src.startsWith("<")) {
        // TODO : Ajouter sanitize-html.min.js et sanitizeMe.js
        // src = sanitize(src)
        src = src
            .replace(/<(?:br|\/div|\/p)>/g, "\n")
            .replace(/<.*?>/g, "");
        const textArea = document.createElement("textarea");
        textArea.innerHTML = src;
        src = textArea.value;
    }
    return src;
})