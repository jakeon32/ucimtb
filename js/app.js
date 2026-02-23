/**
 * 애플리케이션 메인 JavaScript 파일
 * i18n 모듈을 사용한 다국어 지원 예시
 */

(function() {
    'use strict';

    /**
     * i18n 모듈이 로드될 때까지 대기하는 공통 유틸리티 함수
     * @param {Function} callback - i18n 로드 완료 후 실행할 콜백 함수
     */
    function waitForI18n(callback) {
        if (window.i18n && window.i18n.isLoaded) {
            callback();
        } else if (window.i18n) {
            // i18n이 있지만 아직 로드 중인 경우
            setTimeout(() => waitForI18n(callback), 100);
        } else {
            // i18n이 아직 없는 경우
            setTimeout(() => waitForI18n(callback), 100);
        }
    }

    /**
     * 페이지 초기화 헬퍼 함수
     * DOMContentLoaded와 i18n 로드를 모두 기다린 후 콜백 실행
     * @param {Function} initCallback - 초기화 콜백 함수
     */
    function initPage(initCallback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                waitForI18n(initCallback);
            });
        } else {
            waitForI18n(initCallback);
        }
    }

    // 페이지 로드 완료 후 초기화
    initPage(function() {
        initApp();
    });

    function initApp() {
        console.log('App initialized with language:', i18n.getLang());

    }

    // 전역으로 노출할 함수들
    window.app = {
        init: initApp,
        showSuccess: function() {
            i18n.showAlert('alert.success', 'success');
        },
        showError: function() {
            i18n.showAlert('alert.error', 'error');
        },
        waitForI18n: waitForI18n,
        initPage: initPage
    };

})();