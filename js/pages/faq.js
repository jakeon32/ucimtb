/**
 * FAQ 페이지 스크립트
 * 카테고리 토글 + 아코디언 동작 처리
 */
(function() {
    'use strict';

    function initFaqAccordion() {
        // Category toggle (sections start collapsed)
        var categories = document.querySelectorAll('.faq-category');
        categories.forEach(function(cat) {
            var title = cat.querySelector('.faq-category-title');
            if (!title) return;

            title.addEventListener('click', function() {
                cat.classList.toggle('active');
            });
        });

        // Individual FAQ item toggle
        var faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(function(item) {
            var question = item.querySelector('.faq-question');
            if (!question) return;

            question.addEventListener('click', function() {
                item.classList.toggle('active');
            });
        });
    }

    document.addEventListener('DOMContentLoaded', initFaqAccordion);
})();
