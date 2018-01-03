const BEFORE_ENCODING = `encoding="`;

export default function(xmlstr){
    const encodingStartIndex = xmlstr.indexOf(BEFORE_ENCODING) + BEFORE_ENCODING.length;
    const encodingEndIndex = xmlstr.indexOf('"', encodingStartIndex);
    return xmlstr.slice(encodingStartIndex, encodingEndIndex);
}