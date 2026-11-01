document.addEventListener('DOMContentLoaded', () => {
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', () => {
            const isVisible = mobileMenu.style.display === 'flex';
            mobileMenu.style.display = isVisible ? 'none' : 'flex';
            burgerBtn.classList.toggle('active');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.style.display = 'none';
                burgerBtn.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!burgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.style.display = 'none';
                burgerBtn.classList.remove('active');
            }
        });
    }
});


window.addEventListener('load', function() {
    setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 500);
});

const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = -100, mouseY = -100;
let ringX = -100, ringY = -100;

document.addEventListener('mousemove', e => {
   mouseX = e.clientX;
   mouseY = e.clientY;
   dot.style.left = mouseX + 'px';
   dot.style.top = mouseY + 'px';
});

function animateRing() {
   ringX += (mouseX - ringX) * 0.2;
   ringY += (mouseY - ringY) * 0.2;
   ring.style.left = ringX + 'px';
   ring.style.top = ringY + 'px';
   requestAnimationFrame(animateRing);
}
animateRing();

const hoverElements = document.querySelectorAll('a, button');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const mouse = { x: null, y: null };

function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const numberOfParticles = Math.min(100, Math.floor(canvas.width / 15));
            particles = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1
                });
     }
}

        canvas.addEventListener('mousemove', e => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        const revealElements = document.querySelectorAll(".reveal");

        const observer = new IntersectionObserver((e) => {
            e.forEach(entry =>{
                if(entry.isIntersecting){
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {threshold: 0.1});
revealElements.forEach(el => observer.observe(el));

document.querySelector('.custom-file-upload').onclick = function() {
    document.getElementById('file-upload').click();
};

document.getElementById('file-upload').addEventListener('change', function(e) {
    const label = document.querySelector('.custom-file-upload');
    label.textContent = e.target.files.length ? e.target.files[0].name : 'Выбрать файл';
});

const calcBtn = document.getElementById('calcBtn');
const reviewBtn = document.getElementById('reviewBtn');
const modal = document.getElementById('calcModal');
const reviewModal = document.getElementById('reviewModal');
const closeModal = document.getElementById('closeModal');
const closeReviewModal = document.getElementById('closeModal1');
const form = document.getElementById('calcForm');
const reviewForm = document.getElementById('reviewForm');
const serviceType = document.getElementById('serviceType');

const standsFields = document.getElementById('standsFields');
const flyersFields = document.getElementById('flyersFields');
const smmFields = document.getElementById('smmFields');

calcBtn.addEventListener('click', () => {
    modal.classList.add('active');
    setTimeout(() => window.scrollTo(0, 0), 100);
    document.body.style.overflow = 'hidden';
});

reviewBtn.addEventListener('click', () => {
    reviewModal.classList.add('active');
    setTimeout(() => window.scrollTo(0, 0), 100);
    document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
});

closeReviewModal.addEventListener('click', () => {
    reviewModal.classList.remove('active');
    document.body.style.overflow = '';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

function toggleFields() {
    standsFields.classList.remove('visible');
    flyersFields.classList.remove('visible');
    smmFields.classList.remove('visible');
    const value = serviceType.value;

    if (value === 'stands') {
        standsFields.classList.add('visible');
    } else if (value === 'flyers') {
        flyersFields.classList.add('visible');
    } else if (value === 'smm') {
        smmFields.classList.add('visible');
    }
}

serviceType.addEventListener('change', toggleFields);

//Toast//
function showToast(message) {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
         toast.classList.remove('show');
     }, 3000);
}


//Отправка отзыва//
reviewForm.addEventListener('submit', async (e) =>{
    e.preventDefault();
    const privacyCheck = document.getElementById('privacyCheck1');
    if (!privacyCheck || !privacyCheck.checked) {
        showToast('Необходимо дать согласие на обработку персональных данных');
        return;
    }

    const  name = document.querySelector('input[name="nameE"]').value;
    const organization = document.querySelector('input[name="organization"]').value;
    const review = document.querySelector('textarea[name="review"]').value;
    const fileInput = document.querySelector('input[name="file"]');
    const photo = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('organization',  organization);
    formData.append('review', review);
    if (photo){
        formData.append('file', photo);
    } else{
        formData.append('file', null);
    }

    try{
        const response = await fetch('https://mediadrom-miha823.amvera.io/api/review', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            showToast("Ваш отзыв успешно отправлен!")
            if (privacyCheck) privacyCheck.checked = false;
            if (name) name.value =  '';
            if (organization)   organization.value = '';
            if (reviewModal) reviewModal.classList.remove('active');
            if (fileInput) fileInput.value = '';
            reviewForm.reset();
            document.body.style.overflow = ''
        }
        else {
            const errText = await response.text();
            showToast('Ошибка при отправке. Попробуйте позже.');
            console.error(errText);
            reviewForm.reset();

        }
    } catch (e) {
        showToast('Ошибка сети. Проверьте подключение к интернету.');
        if (privacyCheck) privacyCheck.checked = false;
        if (reviewModal) reviewModal.classList.remove('active');
        if (fileInput) fileInput.value = '';
        document.body.style.overflow = ''
        reviewForm.reset();
    }
});

//Отправка формя заявки//
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const privacyCheck = document.getElementById('privacyCheck');
    if (!privacyCheck || !privacyCheck.checked) {
        showToast('Необходимо дать согласие на обработку персональных данных');
        return;
    }

    const formData = {
        name: document.querySelector('input[name="name"]').value.trim(),
        organization: document.querySelector('input[name="org"]').value.trim(),
        contact: document.querySelector('input[name="contact"]').value.trim(),
        serviceType: serviceType.options[serviceType.selectedIndex].text,
        standFormat: document.querySelector('select[name="standFormat"]')?.value,
        standDuration: document.querySelector('input[name="standDuration"]')?.value,
        flyersCirculation: document.querySelector('input[name="flyersCirculation"]')?.value,
        flyersDuration: document.querySelector('input[name="flyersDuration"]')?.value,
        smmPosts: document.querySelector('input[name="smmPosts"]')?.value,
        smmMarking: document.querySelector('input[name="smmMarking"]')?.checked,
        smmStartDate: document.querySelector('input[name="smmStartDate"]')?.value,
        smmEndDate: document.querySelector('input[name="smmEndDate"]')?.value
    };

    try {
        const response = await fetch('https://mediadrom-miha823.amvera.io/api/calculate-cost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showToast("Ваша заявка успешно отправлена. Мы свяжемся с Вами в ближайшее время.")
            form.reset();
            privacyCheck.checked = false;
            modal.classList.remove('active');
            document.body.style.overflow = ''
        } else {
            const errText = await response.text();
            showToast('Ошибка при отправке. Попробуйте позже.');
            console.error(errText);
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Ошибка сети. Проверьте соединение.');
        modal.classList.remove('active');
        document.body.style.overflow = ''
    }
});


//Стрелка вверх (скролл)//
const arrow = document.querySelector(".arrow-container");
arrow.addEventListener('click', evt => {
    goTop();
})

function scrolledArrow() {

    const scrolled = window.pageYOffset;

    if (scrolled > 200){
        arrow.style.display  = 'flex';
    } else {
        arrow.style.display = 'none';
    }
}

function goTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.addEventListener('scroll', scrolledArrow);
scrolledArrow();

//Переход по якорям (скроллинг)///
document.addEventListener('DOMContentLoaded', ()=>{
    const scrollLinks = document.querySelectorAll('.js-scroll');
    scrollLinks.forEach(link => {
        link.addEventListener('click', e=> {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if (!targetId) return;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        })
    })
})

//Слайдер отзывов//
document.addEventListener('DOMContentLoaded', function () {

    const reviewSwiper = new Swiper('.slider-review', {
        slidesPerView: 1,
        spaceBetween: 16,
        effect: 'slide',
        pagination: {
            el: '.slider-review .swiper-pagination',
            type: 'bullets',
            clickable: true,
            dynamicBullets: true,
        },
        keyboard:{
            enabled: true,
            onlyInViewport: true,
            pageUpDown: true
        },

        navigation: {
            prevEl: '.slider-review .swiper-button-prev',
            nextEl: '.slider-review .swiper-button-next',
        },
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        },
    });
});


const serviceBtn = document.querySelectorAll('.service-btn');

serviceBtn.forEach(btn => {
    btn.addEventListener('click', function (){
        const item = this.closest('.service-item');
        const descr = item.querySelector('.service-item-descr');
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        if (!isExpanded) {
            descr.classList.add('active');
            this.textContent = 'Скрыть';
            this.setAttribute('aria-expanded', 'true');
        } else {
            descr.classList.remove('active');
            this.textContent = 'Подробнее';
            this.setAttribute('aria-expanded', 'false');
        }
    })
})

window.addEventListener('scroll', () => {
    const viewportHeight = window.innerHeight;

    document.querySelectorAll('.service-item').forEach(item => {
        const btn = item.querySelector('.service-btn');
        const descr = item.querySelector('.service-item-descr');

        const rect = item.getBoundingClientRect();

        if (rect.top < 0 && descr) {
            descr.style.maxHeight = null;
            descr.classList.remove('active');
            btn.textContent = 'Подробнее';
            btn.setAttribute('aria-expanded', 'false');
        }
    });
}, { passive: true });

