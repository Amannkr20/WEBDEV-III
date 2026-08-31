// File Manager using fs module

const fs = require("fs");

console.log("Sample Terminal Output:\n");

// 1. Create File
console.log("Creating File...");
fs.writeFile("test.txt", "Hello Node.js", (err) => {
  if (err) {
    console.log("Error creating file:", err);
  } else {
    console.log("File Created");

    // 2. Read File
    console.log("Reading File");
    fs.readFile("test.txt", "utf8", (err, data) => {
      if (err) {
        console.log("Error reading file:", err);
      } else {
        console.log(data);

        // 3. Update File
        console.log("File Updated");
        fs.appendFile("test.txt", "\nLearning FS Module", (err) => {
          if (err) {
            console.log("Error updating file:", err);
          } else {
            // Read file again to show updated content
            fs.readFile("test.txt", "utf8", (err, updatedData) => {
              if (err) {
                console.log(err);
              } else {
                console.log(updatedData);

                // 4. Delete File
                fs.unlink("test.txt", (err) => {
                  if (err) {
                    console.log("Error deleting file:", err);
                  } else {
                    console.log("File Deleted");
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});
