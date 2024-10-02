export default function saveAs(name: string, src: string): boolean {
    let link = document.createElement('a');

    if (link.download !== undefined) {

        link.setAttribute('href', src);
        link.setAttribute('download', name);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return true;
    }

    return false;
}