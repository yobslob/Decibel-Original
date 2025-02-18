import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

const getDataUri = (file) => {
    if (!file || !file.buffer || !file.originalname) return null;
    const extnsn = path.extname(file.originalname).substring(1);
    return parser.format(extnsn, file.buffer).content;
};

export default getDataUri;