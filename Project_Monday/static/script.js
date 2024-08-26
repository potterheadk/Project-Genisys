document.addEventListener('DOMContentLoaded', function() {
    const toggleBtns = document.querySelectorAll('.toggleBtn');

    toggleBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const content = this.nextElementSibling;

            // Close all other open sub-content
            toggleBtns.forEach(function(otherBtn) {
                if (otherBtn !== btn) {
                    const otherContent = otherBtn.nextElementSibling;
                    if (otherContent.classList.contains('show')) {
                        otherContent.classList.remove('show');
                        otherContent.style.maxHeight = '0';
                    }
                }
            });

            // Toggle the clicked button's sub-content
            content.classList.toggle('show');

            // Toggle the height to enable smooth expansion/collapse
            if (content.classList.contains('show')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null; // Reset max-height for smooth collapse
            }
        });
    });
});
