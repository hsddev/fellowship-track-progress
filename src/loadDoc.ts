// Dependencies
import { GoogleSpreadsheet } from "google-spreadsheet";
// Json credentials file generated from console.cloud.google.com/apis
import cred from "./novemberpool-da277129be32.json";

const loadDoc = async () => {
    try {
        // Init Doc - DOC_ID: 1rGjDGXdnSly6xqhwiudxUiLViLBeXze2mZyGkllocek
        const doc = new GoogleSpreadsheet(
            "PUT_YOUR_DOC_ID"
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
