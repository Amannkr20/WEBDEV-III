# Lab Assignment 1 – Smart Utility Toolkit

**Course:** Web Dev III (Node.js & Express Backend)  
**Unit Covered:** Unit–1  

---

## ⚡ One Command to Run All Utilities


```bash
cd "/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Assignment_1" && echo "\n--- 1. CALCULATOR ---" && node calculator.js add 10 5 && echo "\n--- 2. APP (CUSTOM MODULES) ---" && node app.js && echo "\n--- 3. FILE MANAGER ---" && node fileManager.js && echo "\n--- 4. DICE GENERATOR ---" && node dice.js 3
```

---

## 📁 Files & Simple Explanation

### 1. `calculator.js` (CLI Calculator)
- Uses `process.argv` to read user inputs from terminal (`add`, `sub`, `multiply`, `divide`).
- Uses a `switch-case` statement to calculate and output `Result: <value>`.

### 2. `modules/isEven.js` & `modules/logger.js` (Custom Modules)
- `isEven.js`: Exports a simple function returning `true` if `num % 2 === 0`.
- `logger.js`: Exports simple logging functions with timestamps.

### 3. `app.js` (Module Integration)
- Uses `require()` to import `isEven` and `logger`.
- Checks numbers in an array and logs whether they are EVEN or ODD.

### 4. `server.js` (HTTP Server)
- Uses built-in `http` module listening on port `3000`.
- Handles routes:
  - `/` ➜ `"Welcome to Node Server"`
  - `/about` ➜ `"About Page"`
  - `/contact` ➜ `"Contact Page"`
  - Invalid route ➜ `"404 Error Message"`

### 5. `fileManager.js` (File Manager using `fs`)
- Demonstrates `fs.writeFile`, `fs.readFile`, `fs.appendFile`, and `fs.unlink` on `test.txt` matching assignment output.

### 6. `dice.js` (Random Dice Roller using `crypto`)
- Uses `crypto.randomInt(1, 7)` to roll dice 1–6 and logs history to `dice_history.txt`.



## Script-  

```bash
cd "/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Assignment_1" && echo "\n--- 1. CALCULATOR ---" && node calculator.js add 10 5 && echo "\n--- 2. APP (CUSTOM MODULES) ---" && node app.js && echo "\n--- 3. FILE MANAGER ---" && node fileManager.js && echo "\n--- 4. DICE GENERATOR ---" && node dice.js 3
```
