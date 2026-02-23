/**
 * FAQ 페이지 스크립트
 * 아코디언 동작 처리
 */
(function() {
    'use strict';

    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(function(item) {
            const question = item.querySelector('.faq-question');
            if (!question) return;

            question.addEventListener('click', function() {
                item.classList.toggle('active');
            });
        });
    }

    document.addEventListener('DOMContentLoaded', initFaqAccordion);
})();