// Dependencies
import async from "async";
import getContacts from "./getContacts";
import loadDoc from "./loadDoc";
import getLevel from "./getLevel";

(async () => {
    // Load doc
    const doc = await loadDoc();
    // Select Sheet
    const classListSheet = doc.sheetsByIndex[1];

    // Load Sheet cells
    await classListSheet.loadCells();

    // Load contacts
    const contacts = await getContacts();

    // Prepare contacts
    const contactsWithResults = contacts
        .map((contact: any) => {
            const user = contact.login;
            const fullName = contact.lastname + ", " + contact.firstname;
            const image = contact.image;
            const event = contact.event;
            const amountXP = contact.xp;
            const level = getLevel(amountXP) | 0;
            const projects = contact.progresses
                .map((x: any) => {
                    {
                        const pathMatch = /^\/london\/div-01\/(.*?)$/gm.exec(
                            x.path
                        );
                        return pathMatch !== null
                            ? { title: pathMatch[1], done: x.isDone }
                            : undefined;
                    }
                })
                .filter((x: any) => !!x);
            return {
                user,
                fullName,
                projects,
                image,
                event,
                amountXP,
                level,
            };
        })
        .filter((contact: any) => contact.projects.length >= 0);

    // Sort contacts object by their lastname
    contactsWithResults.sort(function (a: any, b: any) {
        var nameA = a.fullName.toLowerCase(),
            nameB = b.fullName.toLowerCase();
        if (nameA < nameB)
            //sort string ascending
            return -1;
        if (nameA > nameB) return 1;
        return 0; //default return value (no sorting)
    });

    // Function to avoid google-spreadsheet api limit
    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // Get user column
    const classListSheetRows = await classListSheet.getRows();

    // Check and update rows
    for (var i = 0; i < contactsWithResults.length; i++) {
        // Check and update the fullname
        if (
            classListSheetRows[i]["Learner Name"] ==
            contactsWithResults[i].fullName
        ) {
            if (contactsWithResults[i].projects.length > 0) {
                // Fetch on the student projects and update the rows depend if the project is done
                for (
                    var j = 0;
                    j < contactsWithResults[i].projects.length;
                    j++
                ) {
                    // Project title
                    var title = contactsWithResults[i].projects[j].title;
                    // Project status -> TRUE/FALSE
                    var isDone = contactsWithResults[i].projects[j].done;

                    // If project status is done cell should be TRUE otherwise FALSE
                    if (
                        isDone == true &&
                        classListSheetRows[i][title] != "TRUE"
                    ) {
                        classListSheetRows[i][title] = "TRUE";
                    } else if (
                        isDone == false &&
                        classListSheetRows[i][title] != "FALSE"
                    ) {
                        classListSheetRows[i][title] = "FALSE";
                    }
                }
            }
            // Check and update the level
            if (
                classListSheetRows[i]["Level"] != contactsWithResults[i].level
            ) {
                classListSheetRows[i]["Level"] = contactsWithResults[i].level;
            }
        }

        // Save the updated row
        await classListSheetRows[i].save();

        // Stop the for loop for certain time to avoid google-spreadsheet api limits
        await sleep(i * 100);

        // Display the progress with contact info
        console.log(`${i}/${contactsWithResults.length}`);
        console.log(contactsWithResults[i]);
    }

    // Display a message after finish updating the spreadsheet
    console.log("Spreadsheet successfully updated !");
})();
