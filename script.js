// Mengambil elemen dengan id "menu-icon" dan menyimpannya ke dalam variabel menuIcon
const menuIcon = document.getElementById("menu-icon");

// Mengambil elemen dengan id "menu-list" dan menyimpannya ke dalam variabel menuList
const menuList = document.getElementById("menu-list");

// Mengambil semua elemen <a> yang berada di dalam elemen <li> di dalam menu-list
// dan menyimpannya dalam variabel menuLinks sebagai NodeList
const menuLinks = document.querySelectorAll('#menu-list li a');

// Menambahkan event listener pada menuIcon yang akan dipanggil saat elemen ini diklik
menuIcon.addEventListener("click", () => {
    // Menambahkan atau menghapus class "hidden" dari menuList
    // Jika class "hidden" ada, akan dihapus; jika tidak ada, akan ditambahkan
    menuList.classList.toggle("hidden");
});

// Menutup menu saat salah satu tautan di dalam menu diklik
menuLinks.forEach(link => {
    // Menambahkan event listener pada setiap tautan di menuLinks
    link.addEventListener("click", () => {
        // Menambahkan class "hidden" ke menuList saat tautan diklik, menyembunyikan menu
        menuList.classList.add("hidden");
    });
});


// Ambil elemen modal
var modal = document.getElementById("videoModal");
var modalVideo = document.getElementById("modalVideo");
var captionText = document.getElementById("caption");

// Ambil semua video di galeri dengan selector yang lebih spesifik
var galleryVideos = document.querySelectorAll(".gallery1 .gallery-video");

// Fungsi untuk menghentikan semua video di galeri
function pauseAllGalleryVideos() {
  galleryVideos.forEach(video => {
    if (!video.paused) {
      console.log("Menghentikan video galeri:", video.src);
      video.pause();
      video.currentTime = 0;
    }
  });
}

// Tambahkan event listener ke setiap video di galeri
galleryVideos.forEach(video => {
  video.addEventListener("click", function() {
    // Hentikan semua video di galeri
    pauseAllGalleryVideos();
    
    // Buka modal
    modal.style.display = "block";
    
    // Atur sumber video di modal
    modalVideo.src = this.src;
    
    // Tangkap nilai alt dan tampilkan sebagai caption
    captionText.innerHTML = this.getAttribute('alt');
    
    // Muat ulang video di modal
    modalVideo.load();
    
    // Mulai pemutaran video di modal
    modalVideo.play();
    
    // Penting: Tambahkan event listener ke video di galeri saat modal terbuka
    galleryVideos.forEach(galleryVideo => {
      galleryVideo.addEventListener('play', function stopIfModalOpen() {
        if (modal.style.display === "block") {
          console.log("Menghentikan upaya pemutaran video saat modal terbuka");
          this.pause();
        }
      });
    });
  });
});

// Tutup modal saat tombol close ditekan
if (document.querySelector(".close")) {
  document.querySelector(".close").addEventListener("click", function() {
    modal.style.display = "none";
    
    // Hentikan pemutaran video di modal
    modalVideo.pause();
    modalVideo.currentTime = 0;
    
    // Pastikan semua video di galeri juga berhenti
    pauseAllGalleryVideos();
  });
}

// Fungsi untuk memeriksa dan menghentikan video di galeri secara berkala saat modal terbuka
function checkAndPauseVideos() {
  if (modal && modal.style.display === "block") {
    pauseAllGalleryVideos();
  }
}

// Jalankan pengecekan setiap 500ms saat modal terbuka
var checkInterval;
if (modal) {
  modal.addEventListener('DOMNodeInserted', function() {
    if (modal.style.display === "block" && !checkInterval) {
      checkInterval = setInterval(checkAndPauseVideos, 500);
    }
  });

  // Bersihkan interval saat modal ditutup
  modal.addEventListener('DOMNodeRemoved', function() {
    if (modal.style.display !== "block" && checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  });
}

// Ganti dengan ID Spreadsheet Anda
const SPREADSHEET_ID = '1o_LEmW-qbpkXQyRw-GfdyYZ2F3s9jj515ttaFyQihmE';
const API_KEY = 'AIzaSyCRdM-I2zrAaUmcTgaNFi8FAt2cAqSy1bg'; // API Key Anda

// URL untuk mengakses data dari Google Sheets
const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/B:C?key=${API_KEY}`;

document.addEventListener("DOMContentLoaded", function () {
    displayComments(); // Muat komentar saat halaman dimuat
    setInterval(displayComments, 5000); // Muat ulang komentar setiap 5 detik
});

// Fungsi untuk menampilkan komentar dengan tampilan yang lebih menarik
async function displayComments() {
    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const commentsList = document.getElementById('comments-list');
        if (!commentsList) {
            console.error('Elemen comments-list tidak ditemukan!');
            return;
        }

        commentsList.innerHTML = ''; // Bersihkan daftar komentar

        // Validasi data
        if (!data.values || data.values.length < 2) {
            commentsList.innerHTML = '<li class="no-comments">Belum ada komentar. Jadilah yang pertama!</li>';
            
            // Perbarui comment-counter menjadi (0)
            const commentsCounter = document.getElementById('comments-counter');
            if (commentsCounter) {
                commentsCounter.textContent = '(0)';
            }
            return;
        }

        // Ambil data dari kolom B (Nama) dan C (Komentar)
        const rows = data.values.slice(1); // Hilangkan header
        const maxComments = 6; // Batasi jumlah komentar yang ditampilkan
        const limitedRows = rows.slice(-maxComments); // Ambil komentar terbaru

        // Tampilkan jumlah komentar
        const commentsCounter = document.getElementById('comments-counter');
        if (commentsCounter) {
            commentsCounter.textContent = `(${limitedRows.length})`;
        }

        limitedRows.forEach(row => {
            if (row.length >= 2) { // Pastikan ada nama dan komentar
                const [name, comment] = row;

                const li = document.createElement('li');
                li.className = 'comment-item';
                li.innerHTML = `
                    <div class="comment-header">
                        <div class="comment-avatar">${name.charAt(0).toUpperCase()}</div>
                        <div class="comment-author">${name}</div>
                    </div>
                    <div class="comment-body">${comment}</div>
                `;
                commentsList.appendChild(li);
            }
        });
    } catch (error) {
        console.error('Gagal memuat komentar:', error);
        const commentsList = document.getElementById('comments-list');
        if (commentsList) {
            commentsList.innerHTML = '<li class="error-message">Gagal memuat komentar. Silakan coba lagi nanti.</li>';
        }
    }
}

// Fungsi khusus untuk menangani modal GForm
function initModalGForm() {
    console.log("Inisialisasi modal GForm...");
    
    // Dapatkan elemen-elemen modal
    const modalgform = document.getElementById('modalgform');
    const openModalGFormBtn = document.getElementById('openModalGFormBtn');
    const closeGFormBtn = document.querySelector('.closegform');
    
    console.log("Status elemen modal:", {
        modalgform: modalgform ? "ditemukan" : "tidak ditemukan",
        openModalGFormBtn: openModalGFormBtn ? "ditemukan" : "tidak ditemukan",
        closeGFormBtn: closeGFormBtn ? "ditemukan" : "tidak ditemukan"
    });
    
    // Periksa semua elemen sudah ada
    if (!modalgform || !openModalGFormBtn || !closeGFormBtn) {
        console.error("Beberapa elemen modal tidak ditemukan!");
        return false;
    }
    
    // Tambahkan event listener untuk tombol buka modal
    openModalGFormBtn.onclick = function() {
        console.log("Tombol komentar diklik");
        modalgform.style.display = 'flex';
    };
    
    // Tambahkan event listener untuk tombol tutup
    closeGFormBtn.onclick = function() {
        console.log("Tombol tutup diklik");
        modalgform.style.display = 'none';
    };
    
    // Tambahkan event listener untuk klik di luar modal
    window.onclick = function(event) {
        if (event.target === modalgform) {
            console.log("Klik di luar modal");
            modalgform.style.display = 'none';
        }
    };
    
    console.log("Event listeners untuk modal telah ditambahkan");
    return true;
}

// Jalankan inisialisasi saat DOM sudah dimuat
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM telah dimuat, menginisialisasi...");
    
    // Tampilkan komentar
    displayComments();
    
    // Inisialisasi modal GForm
    if (!initModalGForm()) {
        // Coba lagi setelah waktu singkat
        console.log("Mencoba inisialisasi modal lagi setelah 500ms");
        setTimeout(initModalGForm, 500);
    }
    
    // Atur manual untuk debugging jika diperlukan
    window.fixModal = function() {
        console.log("Eksekusi perbaikan manual modal...");
        return initModalGForm();
    };
});


