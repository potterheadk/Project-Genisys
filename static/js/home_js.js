document.addEventListener('DOMContentLoaded', function() {
        // Slideshow functionality
        let slideIndex = 0;
        const slides = document.getElementsByClassName("slide");
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
    
        function showSlide(n) {
            if (n >= slides.length) slideIndex = 0;
            if (n < 0) slideIndex = slides.length - 1;
    
            for (let i = 0; i < slides.length; i++) {
                slides[i].classList.remove("active");
            }
            slides[slideIndex].classList.add("active");
        }
    
        function nextSlide() {
            showSlide(++slideIndex);
        }
    
        function prevSlide() {
            showSlide(--slideIndex);
        }
    
        // Show the first slide immediately
        showSlide(0);
    
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    
        // Start auto-advance slideshow after a delay
        setTimeout(() => {
            setInterval(nextSlide, 5000);
        }, 5000); // Wait 5 seconds before starting the auto-change
    

    // Navigation menu toggle for mobile
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Reveal animations for sections
    const revealElements = document.querySelectorAll('.about, .features, .contact');

    function reveal() {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add("animate");
            }
        }
    }

    window.addEventListener("scroll", reveal);
    reveal(); // Call once to check for elements already in view on page load

    // Typing effect for hero section
    const heroTitle = document.querySelector('.slide-content h2');
    const heroText = heroTitle.textContent;
    heroTitle.textContent = '';

    let i = 0;
    function typeWriter() {
        if (i < heroText.length) {
            heroTitle.textContent += heroText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    typeWriter();

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    window.addEventListener('scroll', () => {
        
        heroSection.style.backgroundPositionY = scrollPosition * 0.7 + 'px';
    });

    // Form submission with validation
    const form = document.querySelector('form[name="contact-form"]');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            // Here you would typically send the form data to a server
            alert('Form submitted successfully!');
            form.reset();
        }
    });

    function validateForm() {
        const name = form.querySelector('input[name="Name"]');
        const email = form.querySelector('input[name="Email"]');
        const message = form.querySelector('textarea[name="Message"]');

        if (name.value.trim() === '') {
            alert('Please enter your name');
            return false;
        }

        if (email.value.trim() === '' || !isValidEmail(email.value)) {
            alert('Please enter a valid email address');
            return false;
        }

        if (message.value.trim() === '') {
            alert('Please enter your message');
            return false;
        }

        return true;
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});

