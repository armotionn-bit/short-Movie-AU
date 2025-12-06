// === FIREBASE CONFIG ===
const firebaseConfig = {
  apiKey: "AIzaSyCrVRLZBooXjtC0gwOpk4PNMHV2i1I13Js",
  authDomain: "data-short-movie-au.firebaseapp.com",
  projectId: "data-short-movie-au",
  storageBucket: "data-short-movie-au.firebasestorage.app",
  messagingSenderId: "256339763622",
  appId: "1:256339763622:web:6346d78fe3c54ba216ef67",
  measurementId: "G-6B0QK0KF68"
};

<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-storage.js"></script>



// === LOGIN ===
function login() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, pass)
        .then(() => {
            document.getElementById("loginSection").classList.add("hidden");

            if (email === "admin@filmau.com") {
                document.getElementById("adminSection").classList.remove("hidden");
                loadLogs();
            } else {
                document.getElementById("userSection").classList.remove("hidden");
            }
        })
        .catch(err => alert("Login gagal: " + err.message));
}


// === UPLOAD BUKTI KERJA ===
function uploadWork() {

    const user = auth.currentUser;
    const task = document.getElementById("task").value;
    const desc = document.getElementById("jobDesc").value;
    const file = document.getElementById("photoFile").files[0];

    if (!task || !file) {
        return alert("Tugas + Foto wajib diisi!");
    }

    const fileRef = storage.ref("uploads/" + Date.now() + "_" + file.name);

    fileRef.put(file)
        .then(snap => snap.ref.getDownloadURL())
        .then(url => {

            db.collection("workLogs").add({
                user: user.email,
                tugas: task,
                deskripsi: desc,
                foto: url,
                waktu: new Date().toLocaleString(),
            });

            document.getElementById("userPreview").innerHTML =
                `<p><b>Upload Berhasil!</b></p>
                 <img src="${url}">`;
        });
}


// === LOAD DASHBOARD ADMIN ===
function loadLogs() {

    db.collection("workLogs")
        .orderBy("waktu", "desc")
        .onSnapshot(snapshot => {

            let html = "";

            snapshot.forEach(doc => {
                const d = doc.data();

                html += `
                    <div class="logCard">
                        <b>${d.user}</b><br>
                        <b>Tugas:</b> ${d.tugas}<br>
                        <b>Deskripsi:</b> ${d.deskripsi}<br>
                        <b>Waktu:</b> ${d.waktu}<br>
                        <img src="${d.foto}">
                    </div>
                `;
            });

            document.getElementById("logContainer").innerHTML = html;
        });
}
