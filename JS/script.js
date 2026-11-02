
/* =========================================================
   MB LOGISTIX - COMPLETE SHARED JAVASCRIPT
   Navigation, animations, services, gallery, forms,
   slideshow, quotation calculator and utilities.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const EMAIL_ADDRESS = "dispatch@mblogistix.co.za";

    /* =====================================================
       1. MOBILE NAVIGATION
       ===================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("#primary-navigation");

    function closeNavigation() {
        if (!menuToggle || !navigation) return;

        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        });

        navigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeNavigation);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeNavigation();
        });

        document.addEventListener("click", event => {
            if (
                navigation.classList.contains("open") &&
                !navigation.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeNavigation();
            }
        });
    }

    /* =====================================================
       2. SCROLL REVEAL ANIMATIONS
       ===================================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(
                            "is-visible",
                            "visible"
                        );

                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add("is-visible", "visible");
        });
    }

    /* =====================================================
       3. SERVICES: SEARCH, FILTER, SORT AND RESET
       ===================================================== */

    const serviceGrid = document.querySelector("#serviceGrid");
    const serviceSearch = document.querySelector("#serviceSearch");
    const serviceCategory = document.querySelector("#serviceCategory");
    const serviceSort = document.querySelector("#serviceSort");
    const resetServices = document.querySelector("#resetServices");
    const serviceCount = document.querySelector("#serviceCount");
    const noServices = document.querySelector("#noServices");

    const services = [
        {
            name: "Road Freight",
            category: "road",
            image: "images/4.jpg",
            description: "Road transportation solutions for local and regional cargo."
        },
        {
            name: "Sea Freight",
            category: "sea",
            image: "images/8.jpg",
            description: "Sea freight options for suitable international cargo movements."
        },
        {
            name: "Air Freight",
            category: "air",
            image: "images/9.jpg",
            description: "Air cargo options for time-sensitive shipments."
        },
        {
            name: "Customs Clearance",
            category: "customs",
            image: "images/15.jpg",
            description: "Assistance with customs documentation and clearance processes."
        },
        {
            name: "Warehousing",
            category: "warehousing",
            image: "images/3.jpg",
            description: "Storage and cargo handling solutions based on your requirements."
        },
        {
            name: "Last-Mile Delivery",
            category: "delivery",
            image: "images/2.jpg",
            description: "Delivery solutions to help move goods to their final destination."
        }
    ];

    function renderServices() {
        if (!serviceGrid) return;

        const searchTerm = serviceSearch
            ? serviceSearch.value.trim().toLowerCase()
            : "";

        const selectedCategory = serviceCategory
            ? serviceCategory.value
            : "all";

        const sortOrder = serviceSort ? serviceSort.value : "az";

        let filteredServices = services.filter(service => {
            const matchesSearch =
                service.name.toLowerCase().includes(searchTerm) ||
                service.description.toLowerCase().includes(searchTerm) ||
                service.category.toLowerCase().includes(searchTerm);

            const matchesCategory =
                selectedCategory === "all" ||
                service.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        filteredServices.sort((a, b) => {
            return sortOrder === "za"
                ? b.name.localeCompare(a.name)
                : a.name.localeCompare(b.name);
        });

        serviceGrid.replaceChildren();

        filteredServices.forEach(service => {
            const article = document.createElement("article");
            article.className = "service-card";

            const image = document.createElement("img");
            image.src = service.image;
            image.alt = `${service.name} offered by MB LOGISTIX`;
            image.loading = "lazy";

            image.addEventListener("error", () => {
                image.alt = `${service.name} image unavailable`;
                image.classList.add("image-unavailable");
            });

            const heading = document.createElement("h3");
            heading.textContent = service.name;

            const description = document.createElement("p");
            description.textContent = service.description;

            const link = document.createElement("a");
            link.className = "btn";
            link.href = "enquiry.html";
            link.textContent = "Enquire Now";

            link.setAttribute(
                "aria-label",
                `Enquire about ${service.name}`
            );

            link.addEventListener("click", () => {
                try {
                    sessionStorage.setItem(
                        "mbLogistixSelectedService",
                        service.name
                    );
                } catch (error) {
                    // Manual service selection remains available.
                }
            });

            article.append(image, heading, description, link);
            serviceGrid.appendChild(article);
        });

        if (serviceCount) {
            serviceCount.textContent =
                `${filteredServices.length} service` +
                (filteredServices.length === 1 ? "" : "s") +
                " found";
        }

        if (noServices) {
            noServices.hidden = filteredServices.length !== 0;
        }
    }

    if (serviceGrid) {
        renderServices();

        serviceSearch?.addEventListener("input", renderServices);
        serviceCategory?.addEventListener("change", renderServices);
        serviceSort?.addEventListener("change", renderServices);

        resetServices?.addEventListener("click", () => {
            if (serviceSearch) serviceSearch.value = "";
            if (serviceCategory) serviceCategory.value = "all";
            if (serviceSort) serviceSort.value = "az";

            renderServices();
            serviceSearch?.focus();
        });
    }

    /* =====================================================
       4. GALLERY LIGHTBOX
       ===================================================== */

    const lightbox = document.querySelector("#galleryLightbox");
    const lightboxImage = document.querySelector("#lightboxImage");
    const lightboxCaption = document.querySelector("#lightboxCaption");
    const lightboxCounter = document.querySelector("#lightboxCounter");

    const galleryButtons = Array.from(
        document.querySelectorAll(".gallery-trigger")
    );

    const closeLightboxButton = document.querySelector(
        "#closeLightbox, #lightboxClose, .lightbox-close, [data-lightbox-close]"
    );

    const previousImageButton = document.querySelector(
        "#previousImage, #lightboxPrevious, .lightbox-prev, [data-lightbox-prev]"
    );

    const nextImageButton = document.querySelector(
        "#nextImage, #lightboxNext, .lightbox-next, [data-lightbox-next]"
    );

    let currentGalleryIndex = 0;
    let lastGalleryTrigger = null;

    function getGalleryData(button) {
        const image = button.querySelector("img");
        const caption = button.querySelector("figcaption");

        return {
            src: image ? image.currentSrc || image.src : "",
            alt: image ? image.alt : "Gallery image",
            caption: caption
                ? caption.textContent.trim()
                : image
                    ? image.alt
                    : "MB LOGISTIX gallery"
        };
    }

    function showGalleryImage(index) {
        if (!galleryButtons.length || !lightboxImage) return;

        currentGalleryIndex =
            (index + galleryButtons.length) % galleryButtons.length;

        const data = getGalleryData(
            galleryButtons[currentGalleryIndex]
        );

        lightboxImage.src = data.src;
        lightboxImage.alt = data.alt;

        if (lightboxCaption) {
            lightboxCaption.textContent = data.caption;
        }

        if (lightboxCounter) {
            lightboxCounter.textContent =
                `${currentGalleryIndex + 1} of ${galleryButtons.length}`;
        }
    }

    function openLightbox(index, trigger) {
        if (!lightbox || !lightboxImage) return;

        lastGalleryTrigger = trigger || document.activeElement;
        showGalleryImage(index);

        if (typeof lightbox.showModal === "function") {
            if (!lightbox.open) lightbox.showModal();
        } else {
            lightbox.classList.add("is-open");
            lightbox.setAttribute("aria-hidden", "false");
        }

        closeLightboxButton?.focus();
    }

    function closeLightbox() {
        if (!lightbox) return;

        if (typeof lightbox.close === "function" && lightbox.open) {
            lightbox.close();
        } else {
            lightbox.classList.remove("is-open");
            lightbox.setAttribute("aria-hidden", "true");
        }

        lastGalleryTrigger?.focus();
    }

    galleryButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            openLightbox(index, button);
        });
    });

    closeLightboxButton?.addEventListener("click", closeLightbox);

    previousImageButton?.addEventListener("click", () => {
        showGalleryImage(currentGalleryIndex - 1);
    });

    nextImageButton?.addEventListener("click", () => {
        showGalleryImage(currentGalleryIndex + 1);
    });

    if (lightbox) {
        lightbox.addEventListener("click", event => {
            if (event.target === lightbox) closeLightbox();
        });

        lightbox.addEventListener("close", () => {
            lastGalleryTrigger?.focus();
        });
    }

    document.addEventListener("keydown", event => {
        if (!lightbox) return;

        const isOpen =
            lightbox.open || lightbox.classList.contains("is-open");

        if (!isOpen) return;

        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowLeft") {
            showGalleryImage(currentGalleryIndex - 1);
        } else if (event.key === "ArrowRight") {
            showGalleryImage(currentGalleryIndex + 1);
        }
    });

    /* =====================================================
       5. SHARED FORM MESSAGE HELPERS
       ===================================================== */

    function showFormMessage(element, message, isError = false) {
        if (!element) return;

        element.textContent = message;
        element.hidden = false;
        element.classList.add("form-message-visible");
        element.classList.toggle("error", isError);
        element.classList.toggle("success", !isError);
        element.setAttribute("role", isError ? "alert" : "status");
    }

    function clearFormMessage(element) {
        if (!element) return;

        element.textContent = "";
        element.hidden = true;

        element.classList.remove(
            "form-message-visible",
            "error",
            "success"
        );
    }

    function encodeEmailBody(fields) {
        return fields
            .map(([label, value]) => {
                // Prevent entered text from creating misleading extra headers.
                const safeValue = String(value || "Not provided")
                    .replace(/[\r\n]+/g, " ");

                return `${label}: ${safeValue}`;
            })
            .join("\n");
    }

    function openEmailDraft(subject, fields, statusElement) {
        const body = encodeEmailBody(fields);

        const mailtoLink =
            `mailto:${EMAIL_ADDRESS}` +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;

        showFormMessage(
            statusElement,
            "Your email application is opening. Review your message and press Send to submit it."
        );

        window.location.href = mailtoLink;
    }

    /* =====================================================
       6. CONTACT FORM
       ===================================================== */

    const contactForm = document.querySelector("#contactForm");
    const contactError = document.querySelector("#contactError");
    const contactStatus = document.querySelector("#formMessage");

    if (contactForm) {
        contactForm.addEventListener("submit", event => {
            event.preventDefault();

            clearFormMessage(contactError);
            clearFormMessage(contactStatus);

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();

                showFormMessage(
                    contactError,
                    "Please complete all required fields correctly.",
                    true
                );

                return;
            }

            const getValue = id =>
                contactForm.querySelector(`#${id}`)?.value.trim() || "";

            const fullName = getValue("fullName");
            const contactNumber = getValue("contactNumber");
            const email = getValue("email");
            const messageType = getValue("messageType");
            const message = getValue("message");

            openEmailDraft(
                `MB LOGISTIX Contact: ${messageType}`,
                [
                    ["Full name", fullName],
                    ["Contact number", contactNumber],
                    ["Email address", email],
                    ["Message type", messageType],
                    ["Message", message]
                ],
                contactStatus
            );
        });
    }

    /* =====================================================
       7. ENQUIRY FORM
       ===================================================== */

    const enquiryForm = document.querySelector("#enquiryForm");
    const enquiryError = document.querySelector("#enquiryError");
    const enquiryStatus = document.querySelector("#enquiryMessage");

    const enquiryService = document.querySelector("#enquiryService");
    const deliveryDate = document.querySelector("#deliveryDate");

    if (deliveryDate) {
        const today = new Date();

        deliveryDate.min = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");
    }

    if (enquiryService) {
        try {
            const selectedService = sessionStorage.getItem(
                "mbLogistixSelectedService"
            );

            if (
                selectedService &&
                Array.from(enquiryService.options).some(
                    option => option.value === selectedService
                )
            ) {
                enquiryService.value = selectedService;

                sessionStorage.removeItem(
                    "mbLogistixSelectedService"
                );
            }
        } catch (error) {
            // Service can be selected manually.
        }
    }

    if (enquiryForm) {
        enquiryForm.addEventListener("submit", event => {
            event.preventDefault();

            clearFormMessage(enquiryError);
            clearFormMessage(enquiryStatus);

            if (!enquiryForm.checkValidity()) {
                enquiryForm.reportValidity();

                showFormMessage(
                    enquiryError,
                    "Please complete the required enquiry fields correctly.",
                    true
                );

                return;
            }

            const getValue = id =>
                enquiryForm.querySelector(`#${id}`)?.value.trim() || "";

            openEmailDraft(
                `MB LOGISTIX Enquiry: ${getValue("enquiryService")}`,
                [
                    ["Customer name", getValue("enquiryName")],
                    ["Customer email", getValue("enquiryEmail")],
                    ["Contact number", getValue("enquiryPhone")],
                    ["Service requested", getValue("enquiryService")],
                    ["Collection address", getValue("collectionAddress")],
                    ["Delivery address", getValue("deliveryAddress")],
                    ["Cargo description", getValue("cargoDescription")],
                    ["Cargo weight (kg)", getValue("cargoWeight")],
                    ["Cargo dimensions", getValue("cargoDimensions")],
                    ["Preferred date", getValue("deliveryDate")],
                    ["Special requirements", getValue("specialRequirements")]
                ],
                enquiryStatus
            );
        });
    }

    /* =====================================================
       8. IMAGE SLIDESHOW
       ===================================================== */

    const slideImage = document.querySelector("#slideImage");
    const previousSlideButton = document.querySelector("#previousBtn");
    const nextSlideButton = document.querySelector("#nextBtn");
    const slideshow = document.querySelector(".slideshow");

    const slides = [
        { src: "images/4.jpg", alt: "MB LOGISTIX road freight" },
        { src: "images/8.jpg", alt: "MB LOGISTIX sea freight" },
        { src: "images/9.jpg", alt: "MB LOGISTIX air freight" },
        { src: "images/15.jpg", alt: "MB LOGISTIX logistics operations" },
        { src: "images/3.jpg", alt: "MB LOGISTIX warehousing" },
        { src: "images/2.jpg", alt: "MB LOGISTIX delivery services" },
        { src: "images/23.jpg", alt: "MB LOGISTIX transport gallery" },
        { src: "images/17.jpg", alt: "MB LOGISTIX cargo operations" },
        { src: "images/13.jpg", alt: "MB LOGISTIX logistics gallery" },
        { src: "images/6.jpg", alt: "MB LOGISTIX transport services" },
        { src: "images/11.jpg", alt: "MB LOGISTIX cargo handling" },
        { src: "images/12.jpg", alt: "MB LOGISTIX freight services" },
        { src: "images/18.jpg", alt: "MB LOGISTIX logistics fleet" },
        { src: "images/21.jpg", alt: "MB LOGISTIX transport operations" },
        { src: "images/25.jpg", alt: "MB LOGISTIX image gallery" }
    ];

    let currentSlide = 0;
    let slideshowTimer = null;

    function showSlide(index) {
        if (!slideImage) return;

        currentSlide = (index + slides.length) % slides.length;

        slideImage.src = slides[currentSlide].src;
        slideImage.alt = slides[currentSlide].alt;
    }

    function stopSlideshow() {
        if (slideshowTimer) {
            clearInterval(slideshowTimer);
            slideshowTimer = null;
        }
    }

    function startSlideshow() {
        stopSlideshow();

        if (
            !slideImage ||
            !previousSlideButton ||
            !nextSlideButton ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) return;

        slideshowTimer = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 4000);
    }

    if (slideImage && previousSlideButton && nextSlideButton) {
        showSlide(0);

        previousSlideButton.addEventListener("click", () => {
            showSlide(currentSlide - 1);
        });

        nextSlideButton.addEventListener("click", () => {
            showSlide(currentSlide + 1);
        });

        slideshow?.addEventListener("mouseenter", stopSlideshow);
        slideshow?.addEventListener("mouseleave", startSlideshow);
        slideshow?.addEventListener("focusin", stopSlideshow);

        slideshow?.addEventListener("focusout", event => {
            if (!slideshow.contains(event.relatedTarget)) {
                startSlideshow();
            }
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopSlideshow();
            } else {
                startSlideshow();
            }
        });

        startSlideshow();
    }

    /* =====================================================
       9. QUOTATION ESTIMATOR
       Illustrative calculation, not an official quote.
       ===================================================== */

    const quoteForm = document.querySelector("#quoteForm");
    const distanceInput = document.querySelector("#distance");
    const cargoInput = document.querySelector("#cargo");
    const vehicleInput = document.querySelector("#vehicle");
    const quoteAmount = document.querySelector("#quoteAmount");
    const quoteDisclaimer = document.querySelector("#quoteDisclaimer");

    if (
        quoteForm &&
        distanceInput &&
        cargoInput &&
        vehicleInput &&
        quoteAmount
    ) {
        quoteForm.addEventListener("submit", event => {
            event.preventDefault();

            const distance = Number(distanceInput.value);
            const cargoRate = Number(cargoInput.value);
            const vehicleRate = Number(vehicleInput.value);

            if (
                !quoteForm.checkValidity() ||
                !Number.isFinite(distance) ||
                !Number.isFinite(cargoRate) ||
                !Number.isFinite(vehicleRate) ||
                distance <= 0 ||
                cargoRate <= 0 ||
                vehicleRate <= 0
            ) {
                quoteForm.reportValidity();

                quoteAmount.textContent =
                    "Please enter valid quotation details.";

                return;
            }

            // Example rate only. Replace with approved company rates.
            const estimate = distance * 12 * cargoRate * vehicleRate;

            quoteAmount.textContent = new Intl.NumberFormat("en-ZA", {
                style: "currency",
                currency: "ZAR",
                maximumFractionDigits: 2
            }).format(estimate);

            if (quoteDisclaimer) {
                quoteDisclaimer.textContent =
                    "Illustrative estimate only. This is not an official quote. " +
                    "Final prices depend on cargo, route, availability and other requirements.";
            }
        });
    }

    /* =====================================================
       10. BACK TO TOP BUTTON
       ===================================================== */

    const topButton = document.querySelector("#topButton");

    if (topButton) {
        function updateTopButton() {
            topButton.hidden = window.scrollY < 300;
        }

        window.addEventListener("scroll", updateTopButton, {
            passive: true
        });

        topButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth"
            });
        });

        updateTopButton();
    }

    /* =====================================================
       11. AUTOMATIC COPYRIGHT YEAR
       ===================================================== */

    const yearElement = document.querySelector("#year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    /* =====================================================
       12. FORM INPUT CLEANUP
       ===================================================== */

    document.querySelectorAll("form").forEach(form => {
        form.querySelectorAll("input, textarea, select").forEach(field => {
            field.addEventListener("input", () => {
                if (field.validity.valid) {
                    field.removeAttribute("aria-invalid");
                }
            });
        });
    });

    /* =====================================================
       13. LEAFLET MAP - OPTIONAL
       Only activates if #mbLogistixMap exists.
       Google Maps iframe does not need this section.
       ===================================================== */

    const mapElement = document.querySelector("#mbLogistixMap");

    if (mapElement) {
        if (typeof L === "undefined") {
            console.error("Leaflet failed to load.");

            mapElement.textContent =
                "Map unavailable. Please check your internet connection.";

            mapElement.setAttribute("role", "status");
        } else {
            const johannesburg = [-26.2041, 28.0473];

            const map = L.map(mapElement).setView(johannesburg, 12);

            L.tileLayer(
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    maxZoom: 19,
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>'
                }
            ).addTo(map);

            L.marker(johannesburg)
                .addTo(map)
                .bindPopup(
                    "<strong>MB LOGISTIX</strong><br>Johannesburg, South Africa"
                )
                .openPopup();

            requestAnimationFrame(() => {
                map.invalidateSize();
            });
        }
    }

    /* =====================================================
       14. WEBSITE INITIALISATION COMPLETE
       ===================================================== */

    console.log("MB LOGISTIX website JavaScript loaded successfully.");

});
