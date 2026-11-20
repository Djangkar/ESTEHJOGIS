/* ============================================================
   ES TEH JOGIS — main.js
   1. Nomor WhatsApp  2. Daftar menu  3. Keranjang pesanan
   ============================================================ */

/* ---------- 1. NOMOR WHATSAPP (format 62, tanpa + dan spasi) ---------- */
var WHATSAPP = "6287815916379";

/* ---------- 2. DAFTAR MENU ---------- */
/* Setiap seri: title, price, note, items[].
   Item boleh "Nama Menu" atau "Nama Menu|Label" (label opsional). */
var MENU = [
  {
    id: "tea",
    title: "Tea Series",
    price: 5000,
    note: "Teh dengan buah dan sirup pilihan",
    items: ["Es Teh Jogis Original|Paling dicari", "Es Teh Jogis Jasmine Tea|Andalan", "Es Teh Jogis Apel", "Es Teh Jogis Lemon", "Es Teh Jogis Leci|Favorit", "Es Teh Jogis Jambu",
            "Es Teh Jogis Peach", "Es Teh Jogis Blackcurrant", "Es Teh Jogis Strawberry", "Es Teh Jogis Mangga|Favorit",
            "Es Teh Jogis Kampul Solo", "Es Teh Jogis Semangka", "Es Teh Jogis Jeruk Nipis|Segar", "Es Teh Jogis Madu Kurma"]
  },
  {
    id: "milk",
    title: "Milk Series",
    price: 6000,
    note: "Creamy, manis pas, tetap segar",
    items: ["Jogis Cokelat Royal", "Jogis Cokelat Banana", "Jogis Cokelat Avocado", "Jogis Vanila Latte",
            "Jogis Cokelat Hazelnut", "Jogis Chalimantan", "Jogis Matcha Latte|Favorit", "Jogis Thai Tea|Favorit",
            "Jogis Red Velvet", "Jogis Teh Tarik", "Jogis Taro", "Jogis Cappucino"]
  }
];

function rupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

/* ---------- 3. KERANJANG ---------- */
var cart = {};
var priceByName = {};

function parseItem(raw) {
  var parts = raw.split("|");
  return { name: parts[0], tag: parts[1] || "" };
}

function totalItems() {
  return Object.keys(cart).reduce(function (sum, name) { return sum + cart[name]; }, 0);
}

function totalPrice() {
  return Object.keys(cart).reduce(function (sum, name) { return sum + cart[name] * priceByName[name]; }, 0);
}

function waHref(message) {
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message);
}

function bindWaLinks() {
  var links = document.querySelectorAll("[data-wa]");
  for (var i = 0; i < links.length; i++) {
    links[i].href = waHref(links[i].getAttribute("data-wa"));
    links[i].target = "_blank";
    links[i].rel = "noopener";
  }
}

function renderMenu() {
  var holder = document.getElementById("menu-panels");
  var tabs = document.getElementById("menu-tabs");
  if (!holder || !tabs) return;

  MENU.forEach(function (group, index) {
    group.items.forEach(function (raw) {
      var item = parseItem(raw);
      priceByName[item.name] = item.name.indexOf("Es Teh Jogis Original") === 0 || item.name.indexOf("Es Teh Jogis Jasmine Tea") === 0
        ? 3000
        : group.price;
    });

    var rows = group.items.map(function (raw) {
      var item = parseItem(raw);
      var tag = item.tag ? '<span class="tag">' + item.tag + "</span>" : "";
      var price = priceByName[item.name] || group.price;
      return '<li class="menu-item">' +
        '<div class="menu-item-main"><div class="menu-item-row">' +
          '<span class="name">' + item.name + "</span>" + tag +
          '<span class="dots"></span>' +
          '<span class="price">' + rupiah(price) + "</span>" +
        "</div></div>" +
        '<button class="add-btn" type="button" data-add="' + item.name + '" aria-label="Tambah ' + item.name + '">+</button>' +
        "</li>";
    }).join("");

    holder.insertAdjacentHTML("beforeend",
      '<div class="menu-panel" id="panel-' + group.id + '">' +
        '<div class="menu-group-head"><div><h3>' + group.title + "</h3>" +
        '<p class="note">' + group.note + "</p></div>" +
        '<span class="menu-price-tag">' + rupiah(group.price) + " / cup</span></div>" +
        '<ul class="menu-list">' + rows + "</ul>" +
      "</div>"
    );

    tabs.insertAdjacentHTML("beforeend",
      '<button class="menu-tab" type="button" data-tab="' + group.id + '">' +
      group.title + " (" + group.items.length + ")" + "</button>"
    );
  });

  var allCount = MENU.reduce(function (count, group) { return count + group.items.length; }, 0);
  holder.insertAdjacentHTML("afterbegin",
    '<div class="menu-panel is-active" id="panel-all">' +
      '<div class="menu-group-head"><div><h3>Semua Menu</h3><p class="note">Pilihan lengkap Es Teh Jogis</p></div>' +
      '<span class="menu-price-tag">Mulai Rp 3.000</span></div>' +
      '<ul class="menu-list">' +
        MENU.map(function (group) {
          return group.items.map(function (raw) {
            var item = parseItem(raw);
            var price = priceByName[item.name] || group.price;
            return '<li class="menu-item">' +
              '<div class="menu-item-main"><div class="menu-item-row"><span class="name">' + item.name + '</span>' +
              '<span class="dots"></span><span class="price">' + rupiah(price) + '</span></div></div>' +
              '<button class="add-btn" type="button" data-add="' + item.name + '" aria-label="Tambah ' + item.name + '">+</button></li>';
          }).join("");
        }).join("") +
      '</ul></div>'
  );
  tabs.insertAdjacentHTML("afterbegin",
    '<button class="menu-tab is-active" type="button" data-tab="all">Semua Menu (' + allCount + ')</button>'
  );

  tabs.addEventListener("click", function (event) {
    var button = event.target.closest("[data-tab]");
    if (!button) return;
    var id = button.getAttribute("data-tab");
    var allTabs = tabs.querySelectorAll(".menu-tab");
    for (var i = 0; i < allTabs.length; i++) allTabs[i].classList.remove("is-active");
    button.classList.add("is-active");
    var panels = holder.querySelectorAll(".menu-panel");
    for (var j = 0; j < panels.length; j++) {
      panels[j].classList.toggle("is-active", panels[j].id === "panel-" + id);
    }
  });

  holder.addEventListener("click", function (event) {
    var button = event.target.closest("[data-add]");
    if (!button) return;
    var name = button.getAttribute("data-add");
    cart[name] = (cart[name] || 0) + 1;
    renderCart();
  });
}

function renderCart() {
  var bar = document.getElementById("cart");
  if (!bar) return;

  var count = totalItems();
  if (!count) {
    bar.classList.remove("is-open");
    return;
  }

  var names = Object.keys(cart);
  var lines = names.map(function (name) {
    return "- " + cart[name] + "x " + name + " = " + rupiah(cart[name] * priceByName[name]);
  }).join("\n");

  var summary = names.map(function (name) { return cart[name] + "x " + name; }).join(" · ");
  var message = "Halo Es Teh JOGIS, saya mau pesan:\n" + lines + "\n\nTotal: " + rupiah(totalPrice()) + "\nTerima kasih.";

  bar.classList.add("is-open");
  document.getElementById("cart-label").textContent = "Pesanan · " + count + " cup";
  document.getElementById("cart-total").textContent = rupiah(totalPrice());
  document.getElementById("cart-detail").textContent = summary;
  document.getElementById("cart-send").href = waHref(message);
}

document.addEventListener("DOMContentLoaded", function () {
  bindWaLinks();
  renderMenu();
  renderCart();

  var slides = document.querySelectorAll(".hero-slide");
  if (slides.length > 1) {
    var activeSlide = 0;
    var heroMedia = document.querySelector(".hero-card-media");
    var heroPrev = document.querySelector(".hero-arrow--prev");
    var heroNext = document.querySelector(".hero-arrow--next");
    function showHero(index) {
      var previousSlide = activeSlide;
      slides[previousSlide].classList.remove("is-active");
      slides[previousSlide].classList.add("is-before");
      activeSlide = (index + slides.length) % slides.length;
      slides[activeSlide].classList.remove("is-before");
      slides[activeSlide].classList.add("is-active");
      fitHeroSlide(activeSlide);
      setTimeout(function () {
        slides[previousSlide].classList.remove("is-before");
      }, 900);
    }
    function fitHeroSlide(index) {
      var slide = slides[index];
      if (!slide || !heroMedia) return;
      var applyRatio = function () {
        var ratio = slide.naturalWidth && slide.naturalHeight
          ? slide.naturalWidth / slide.naturalHeight
          : 4 / 5;
        heroMedia.style.aspectRatio = ratio.toFixed(3) + " / 1";
      };
      if (slide.complete) applyRatio();
      else slide.addEventListener("load", applyRatio, { once: true });
    }
    fitHeroSlide(0);
    if (heroPrev) heroPrev.addEventListener("click", function () { showHero(activeSlide - 1); });
    if (heroNext) heroNext.addEventListener("click", function () { showHero(activeSlide + 1); });
    setInterval(function () { showHero(activeSlide + 1); }, 4500);
  }

  var galleryTrack = document.querySelector(".gallery-track");
  var gallerySlides = document.querySelectorAll(".gallery-slide");
  var galleryDots = document.querySelector(".gallery-dots");
  var galleryPrev = document.querySelector(".gallery-arrow--prev");
  var galleryNext = document.querySelector(".gallery-arrow--next");
  if (galleryTrack && gallerySlides.length && galleryDots) {
    var galleryIndex = 0;
    var galleryViewport = document.querySelector(".gallery-viewport");

    function fitGallerySlide(index) {
      var slide = gallerySlides[index];
      var image = slide && slide.querySelector("img");
      var shot = slide && slide.querySelector(".shot");
      if (!image || !shot) return;
      var applyRatio = function () {
        // Keep the viewport and border at 3:2 so every full image has a stable frame.
      };
      if (image.complete) applyRatio();
      else image.addEventListener("load", applyRatio, { once: true });
    }
    fitGallerySlide(0);

    gallerySlides.forEach(function (slide, index) {
      var image = slide.querySelector("img");
      var shot = slide.querySelector(".shot");
      var fitShot = function () {
        // Image proportions are preserved by object-fit: contain inside the fixed 3:2 frame.
      };
      if (image.complete) fitShot();
      else image.addEventListener("load", fitShot, { once: true });

      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery-dot" + (index === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Lihat foto galeri " + (index + 1));
      dot.addEventListener("click", function () {
        showGallery(index);
      });
      galleryDots.appendChild(dot);
    });

    function showGallery(index) {
      galleryIndex = (index + gallerySlides.length) % gallerySlides.length;
      galleryTrack.style.transform = "translateX(-" + galleryIndex * 100 + "%)";
      fitGallerySlide(galleryIndex);
      galleryDots.querySelectorAll(".gallery-dot").forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === galleryIndex);
      });
    }

    if (galleryPrev) galleryPrev.addEventListener("click", function () { showGallery(galleryIndex - 1); });
    if (galleryNext) galleryNext.addEventListener("click", function () { showGallery(galleryIndex + 1); });
    setInterval(function () { showGallery(galleryIndex + 1); }, 5200);
  }

  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var revealItems = document.querySelectorAll(".section, .card, .gallery figure, .step");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (item) {
      item.classList.add("reveal");
      observer.observe(item);
    });
  }

  var clear = document.getElementById("cart-clear");
  if (clear) {
    clear.addEventListener("click", function () {
      cart = {};
      renderCart();
    });
  }
});
