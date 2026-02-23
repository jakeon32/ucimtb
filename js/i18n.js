/**
 * 다국어 지원 모듈 (i18n)
 * JSON 언어팩 파일을 로드하여 번역 기능을 제공합니다.
 */

(function() {
    'use strict';

    // GitHub Pages 등 서브경로 배포를 위한 basePath 자동 감지
    function getBasePath() {
        var path = window.location.pathname;
        var match = path.match(/^(.*?)\/(ko|en)\//);
        if (match) return match[1]; // e.g., '' for localhost, '/ucimtb' for GitHub Pages
        return '';
    }

    // 현재 언어 감지 (URL에서 추출: /ko/... 또는 /en/...)
    function getCurrentLang() {
        var path = window.location.pathname;
        var match = path.match(/\/(ko|en)\//);
        return match ? match[1] : 'en'; // 기본값: 영어
    }

    // 언어팩 데이터 저장
    let translations = {};
    let currentLang = getCurrentLang();
    let basePath = getBasePath();
    let isLoaded = false;

    /**
     * 언어팩 JSON 파일 로드
     * @param {string} lang - 언어 코드 (ko, en)
     * @returns {Promise} 언어팩 데이터
     */
    function loadTranslations(lang) {
        return fetch(`${basePath}/lang/${lang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load language pack: ${lang}`);
                }
                return response.json();
            })
            .then(data => {
                translations = data;
                isLoaded = true;
                return data;
            })
            .catch(error => {
                console.error('Error loading translations:', error);
                // 기본 언어팩(영어) 시도
                if (lang !== 'en') {
                    return loadTranslations('en');
                }
                translations = {};
                isLoaded = true;
                return {};
            });
    }

    /**
     * 번역 함수
     * @param {string} key - 번역 키 (점으로 구분된 경로, 예: 'alert.success')
     * @param {string} defaultValue - 기본값 (키가 없을 경우)
     * @returns {string} 번역된 텍스트
     */
    function t(key, defaultValue = null) {
        if (!isLoaded) {
            console.warn('Translations not loaded yet. Key:', key);
            return defaultValue || key;
        }

        const keys = key.split('.');
        let value = translations;

        for (let k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue !== null ? defaultValue : key;
            }
        }

        return typeof value === 'string' ? value : (defaultValue || key);
    }

    /**
     * 현재 언어 변경
     * @param {string} lang - 언어 코드
     * @returns {Promise} 언어팩 로드 완료 Promise
     */
    function setLang(lang) {
        currentLang = lang;
        isLoaded = false;
        return loadTranslations(lang);
    }

    /**
     * 현재 언어 가져오기
     * @returns {string} 현재 언어 코드
     */
    function getLang() {
        return currentLang;
    }

    /**
     * 언어 prefix가 포함된 내부 링크 경로 생성
     * @param {string} path - 원본 경로 (예: '/transportation')
     * @returns {string} 언어가 포함된 경로 (예: '/en/transportation')
     */
    function localePath(path) {
        // 이미 언어 prefix가 있으면 basePath 추가 후 반환
        if (/^\/(ko|en)\//.test(path)) {
            return basePath + path;
        }
        // 외부 링크(http://, https://)는 그대로 반환
        if (/^https?:\/\//.test(path)) {
            return path;
        }
        // 경로가 /로 시작하지 않으면 추가
        const normalizedPath = path.startsWith('/') ? path : '/' + path;
        return `${basePath}/${currentLang}${normalizedPath}`;
    }

    /**
     * 얼럿 표시 (번역된 메시지 사용)
     * @param {string} key - 번역 키
     * @param {string} type - 얼럿 타입 (success, error, warning, info)
     */
    function showAlert(key, type = 'info') {
        const message = t(key);
        const alertTypes = {
            success: { icon: '', color: '#28a745' },
            error: { icon: '', color: '#dc3545' },
            warning: { icon: '', color: '#ffc107' },
            info: { icon: '', color: '#17a2b8' }
        };

        const alertConfig = alertTypes[type] || alertTypes.info;

        // 브라우저 기본 alert 사용 (나중에 커스텀 얼럿으로 교체 가능)
        alert(`${alertConfig.icon} ${message}`);
    }

    /**
     * 확인 다이얼로그 (번역된 메시지 사용)
     * @param {string} key - 번역 키
     * @returns {boolean} 사용자 확인 여부
     */
    function confirm(key) {
        const message = t(key);
        return window.confirm(message);
    }

    /**
     * 초기화: 언어팩 로드
     */
    function init() {
        return loadTranslations(currentLang);
    }

    // 전역 객체로 노출
    window.i18n = {
        t: t,
        setLang: setLang,
        getLang: getLang,
        localePath: localePath,
        basePath: basePath,
        showAlert: showAlert,
        confirm: confirm,
        init: init,
        loadTranslations: loadTranslations,
        get isLoaded() {
            return isLoaded;
        }
    };

    // DOM 로드 완료 시 자동 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();