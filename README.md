
# Harmonic Tension Experiment

This is the full project for Aušrinė Butvydaitė’s musical experiment at the Lithuanian Academy of Music and Theatre (LMTA).  
The goal is to collect and analyze listeners’ perceptions of musical tension.

This project consists of:
- **Frontend** (HTML/JavaScript/Bootstrap): Questionnaire + Experiment interface
- **Backend** (Node.js + Express): Saving and retrieving participant results in `results.json`

---

##  System Structure

```
/tension/
    index.html         ← Main webpage with all stages
    pilot_example.mp3  ← Pilot test audio
    music.mp3          ← Main experiment audio

/server/
    server.js          ← Node.js server
    results.json       ← Collected participant results (automatically generated)
```

---

##  Running the Project Locally

1. **Install [Node.js](https://nodejs.org/)** 

2. **Install required libraries**:
```bash
npm install express cors
```

3. **Start the server** from the `/server/` folder:
```bash
node server.js
```

4. **Open the experiment in browser**:
```
http://localhost:4000/tension/index.html
```

---

##  Deploying on a Server

1. **Copy the project**:
   - Clone this respository into the server

2. **Prepare the server**:
   - Install Node.js and npm 

3. **Install required packages**:
```bash
npm install express cors
```

4. **Run the server**:
```bash
node server/server.js
```
Or better run it in the background using `pm2`:
```bash
npm install -g pm2
pm2 start server/server.js --name node_server_tension
pm2 save
```

5. **Access the project**:
   - If the server listens on port 4000:
```
https://your-domain-or-ip:4000/tension/index.html
```
  - Or, configure nginx/apache to use this port on a given url

---

##  How to Update the Application

- **Frontend (HTML/JS)**:
  - Replace or edit files in `/tension/`.

- **Backend (server.js)**:
  - Edit `server/server.js` as needed.

Then **restart the server**:

If using `node` directly:
```bash
Ctrl+C
node server/server.js
```

If using `pm2`:
```bash
pm2 reload node_server_tension
```

---

##  Important 

- **Permissions**:  
  `server/results.json` should be writable:
  ```bash
  chmod 666 server/results.json
  ```

- **Port Conflicts**:  
  If port 4000 is busy, change this line inside `server.js`:
  ```javascript
  const PORT = 4000;
  ```
  (change `4000` to another free port, e.g., `5000`.)

- **Server Auto-Restart**:  
  With `pm2`, the server automatically restarts on crash or reboot.

---

##  Contact

If you have questions, please email:  
**ausrine.butvydaite@stud.lmta.lt**

---

> Built for the Bachelor's Thesis, 2025. Lithuanian Academy of Music and Theatre (LMTA).
