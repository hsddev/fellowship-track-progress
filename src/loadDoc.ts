// Dependencies
import { GoogleSpreadsheet } from "google-spreadsheet";
import cred from "./novemberpool-da277129be32.json";

const loadDoc = async () => {
    try {
        // Init Doc
        const doc = new GoogleSpreadsheet(
            "1rGjDGXdnSly6xqhwiudxUiLViLBeXze2mZyGkllocek"
        );

        // Auth
        await doc.useServiceAccountAuth(cred);

        // Load doc info
        await doc.loadInfo();
        return doc;
    } catch (e) {
        throw e;
    }
};

export default loadDoc;
