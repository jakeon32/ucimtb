/**
 * 공통 페이지 스크립트
 */
(function() {
    'use strict';

    /**
     * data-href 속성을 가진 링크들에 언어 prefix 자동 적용
     * 예: <a data-href="/transportation"> → /en/transportation 또는 /ko/transportation
     */
    function initLocaleLinks() {
        const links = document.querySelectorAll('a[data-href]');
        links.forEach(link => {
            const path = link.getAttribute('data-href');
            if (path) {
                link.href = i18n.localePath(path);
            }
        });
    }

    /**
     * 모달 열기
     * @param {string} modalId - 모달 ID (예: 'contact-us')
     */
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.documentElement.style.overflow = 'hidden'; // html 스크롤 방지
            document.body.style.overflow = 'hidden'; // body 스크롤 방지
        }
    }

    /**
     * 모달 닫기
     * @param {string} modalId - 모달 ID (예: 'contact-us')
     */
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.documentElement.style.overflow = ''; // html 스크롤 복원
            document.body.style.overflow = ''; // body 스크롤 복원
        }
    }

    /**
     * 모달 이벤트 바인딩 초기화
     */
    function initModals() {
        const modals = document.querySelectorAll('.modal');

        modals.forEach(modal => {
            const modalId = modal.id;

            // 오버레이 클릭 시 닫기
            const overlay = modal.querySelector('.modal-overlay');
            if (overlay) {
                overlay.addEventListener('click', () => closeModal(modalId));
            }

            // btn-close 클릭 시 닫기
            const btnClose = modal.querySelector('.btn-close');
            if (btnClose) {
                btnClose.addEventListener('click', () => closeModal(modalId));
            }

            // btn-cancel 클릭 시 닫기
            const btnCancel = modal.querySelector('.btn-cancel');
            if (btnCancel) {
                btnCancel.addEventListener('click', () => closeModal(modalId));
            }
        });

        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    closeModal(activeModal.id);
                }
            }
        });
    }

    // i18n 로드 완료 후 초기화
    if (window.app && window.app.waitForI18n) {
        window.app.waitForI18n(initLocaleLinks);
    } else {
        // app.js가 로드되지 않은 경우 fallback
        document.addEventListener('DOMContentLoaded', function() {
            if (window.i18n) {
                initLocaleLinks();
            }
        });
    }

    /**
     * 모바일 네비게이션 토글 초기화
     */
    function initMobileNav() {
        const btnMenu = document.querySelector('.btn-menu');
        const header = document.querySelector('header');
        const navOverlay = document.querySelector('.nav-overlay');

        if (btnMenu && header) {
            btnMenu.addEventListener('click', () => {
                header.classList.toggle('nav-active');
            });
        }

        // nav-overlay 클릭 시 닫기
        if (navOverlay && header) {
            navOverlay.addEventListener('click', () => {
                header.classList.remove('nav-active');
            });
        }
    }

    // DOM 로드 완료 후 모달 초기화
    document.addEventListener('DOMContentLoaded', initModals);

    // DOM 로드 완료 후 모바일 네비게이션 초기화
    document.addEventListener('DOMContentLoaded', initMobileNav);

    // 전역으로 노출 (필요 시 수동 호출 가능)
    window.initLocaleLinks = initLocaleLinks;
    window.openModal = openModal;
    window.closeModal = closeModal;

})();

// 이메일 유효성 검사 함수
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 숫자만 입력 허용 함수
const setupNumericInput = (inputId) => {
    const input = document.getElementById(inputId);
    if (!input) return;

    // 입력 이벤트: 숫자가 아닌 문자 제거
    input.addEventListener('input', function(e) {
        const value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value;
    });

    // 붙여넣기 이벤트: 숫자가 아닌 문자 제거
    input.addEventListener('paste', function(e) {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        const numbersOnly = paste.replace(/[^0-9]/g, '');
        e.target.value = numbersOnly;
    });

    // 키다운 이벤트: 숫자, 백스페이스, 삭제, 탭, 화살표 키만 허용
    input.addEventListener('keydown', function(e) {
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End'
        ];

        if (allowedKeys.includes(e.key)) {
            return;
        }

        // 숫자 키만 허용 (0-9)
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
        }
    });
}

// Contact Form 초기화 및 제출 처리 (main 페이지용 - 1-step)
const initContactForm = () => {
    // 2-step 폼이 있는 페이지는 별도 핸들러 사용
    if (document.querySelector('.step-indicator')) return;

    const submitBtn = document.getElementById('contact-submit');
    if (!submitBtn) return;

    // 숫자 입력 필드 설정
    setupNumericInput('contact-phone-code');
    setupNumericInput('contact-phone-number');
    setupNumericInput('contact-passengers');
    setupNumericInput('contact-luggages');
    setupNumericInput('contact-bicycles');

    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // 폼 필드 요소 가져오기
        const teamCountryField = document.getElementById('contact-team-country');
        const nameField = document.getElementById('contact-name');
        const emailField = document.getElementById('contact-email');
        const phoneCodeField = document.getElementById('contact-phone-code');
        const phoneNumberField = document.getElementById('contact-phone-number');
        const serviceTypeField = document.getElementById('contact-service-type');
        const passengersField = document.getElementById('contact-passengers');
        const luggagesField = document.getElementById('contact-luggages');
        const bicyclesField = document.getElementById('contact-bicycles');
        const messageField = document.getElementById('contact-message');

        // 폼 필드 값 가져오기
        const teamCountry = teamCountryField?.value.trim();
        const name = nameField?.value.trim();
        const email = emailField?.value.trim();
        const phoneCode = phoneCodeField?.value.trim();
        const phoneNumber = phoneNumberField?.value.trim();
        const serviceType = serviceTypeField?.value.trim();
        const passengers = passengersField?.value.trim();
        const luggages = luggagesField?.value.trim();
        const bicycles = bicyclesField?.value.trim();
        const message = messageField?.value.trim();

        // 필수 필드 검증
        if (!teamCountry) {
            alert('Please enter Team/Country.');
            teamCountryField?.focus();
            return;
        }

        if (!name) {
            alert('Please enter Name.');
            nameField?.focus();
            return;
        }

        if (!email) {
            alert('Please enter Email.');
            emailField?.focus();
            return;
        }

        // 이메일 형식 검증
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            emailField?.focus();
            return;
        }

        if (!phoneCode || !phoneNumber) {
            alert('Please enter Phone.');
            if (!phoneCode) {
                phoneCodeField?.focus();
            } else {
                phoneNumberField?.focus();
            }
            return;
        }

        if (!serviceType) {
            alert('Please select Service Type.');
            serviceTypeField?.focus();
            return;
        }

        if (!message) {
            alert('Please enter Message.');
            messageField?.focus();
            return;
        }

        // 제출 버튼 비활성화 및 로딩 상태 표시
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // API에 없는 필드들을 message에 포함
        let fullMessage = message;
        const additionalInfo = [];

        if (teamCountry) {
            additionalInfo.push(`Team/Country: ${teamCountry}`);
        }

        const phone = phoneCode ? `${phoneCode} ${phoneNumber}` : phoneNumber;
        if (phone) {
            additionalInfo.push(`Phone: ${phone}`);
        }

        if (serviceType) {
            additionalInfo.push(`Service Type: ${serviceType}`);
        }

        if (passengers) {
            additionalInfo.push(`Passengers: ${passengers}`);
        }

        if (luggages) {
            additionalInfo.push(`Luggages: ${luggages}`);
        }

        if (bicycles) {
            additionalInfo.push(`Bicycles: ${bicycles}`);
        }

        if (additionalInfo.length > 0) {
            fullMessage = `${message}\n\n--- Additional Information ---\n${additionalInfo.join('\n')}`;
        }

        // 서버에 메일 발송 요청
        const currentLang = (window.i18n && window.i18n.getLang) ? window.i18n.getLang() : 'ko';
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: fullMessage,
                lang: currentLang
            })
        })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) {
                    throw new Error(data.message || 'Network error');
                }
                return data;
            });
        })
        .then(data => {
            if (data.success) {
                alert(data.message || 'Email has been sent successfully.');
                // 폼 리셋
                teamCountryField.value = '';
                nameField.value = '';
                emailField.value = '';
                phoneCodeField.value = '';
                phoneNumberField.value = '';
                serviceTypeField.value = '';
                passengersField.value = '';
                luggagesField.value = '';
                bicyclesField.value = '';
                messageField.value = '';
                // 모달 닫기
                if (window.closeModal) {
                    window.closeModal('contact-us');
                }
            } else {
                alert(data.message || 'An error occurred while sending email. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('A network error occurred. Please try again.');
        })
        .finally(() => {
            // 제출 버튼 다시 활성화
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
    });
}

// 2-step 폼 초기화 (Transportation, FAQ 등)
const initTransportationForm = () => {
    if (!document.querySelector('.step-indicator')) return;

    const submitBtn = document.getElementById('contact-submit');
    const nextBtn = document.getElementById('contact-next');
    const backBtn = document.getElementById('contact-back');
    if (!submitBtn || !nextBtn || !backBtn) return;

    // 스텝 관리
    let currentStep = 1;
    const stepItems = document.querySelectorAll('.step-item');
    const stepLine = document.querySelector('.step-line');
    const formSteps = document.querySelectorAll('.form-step');

    function goToStep(step) {
        currentStep = step;

        // form-step 전환
        formSteps.forEach(s => s.classList.remove('active'));
        const targetStep = document.querySelector(`.form-step[data-step="${step}"]`);
        if (targetStep) targetStep.classList.add('active');

        // step-indicator 업데이트
        stepItems.forEach(item => {
            const itemStep = parseInt(item.dataset.step);
            item.classList.remove('active', 'done');
            if (itemStep === step) {
                item.classList.add('active');
            } else if (itemStep < step) {
                item.classList.add('done');
            }
        });

        // step-line 업데이트
        if (stepLine) {
            stepLine.classList.toggle('active', step > 1);
        }

        // 버튼 전환
        if (step === 1) {
            nextBtn.style.display = '';
            backBtn.style.display = 'none';
            submitBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'none';
            backBtn.style.display = '';
            submitBtn.style.display = '';
        }

        // 모달 body 스크롤 상단으로
        const modalBody = document.querySelector('#contact-us .modal-body');
        if (modalBody) modalBody.scrollTop = 0;
        const modalEl = document.getElementById('contact-us');
        if (modalEl) modalEl.scrollTop = 0;
    }

    // Step 1 필수 필드 검증
    function validateStep1() {
        const bookingType = document.getElementById('contact-booking-type')?.value || '';
        const name = document.getElementById('contact-name')?.value.trim() || '';
        const email = document.getElementById('contact-email')?.value.trim() || '';
        const phoneCode = document.getElementById('contact-phone-code')?.value.trim() || '';
        const phoneNumber = document.getElementById('contact-phone-number')?.value.trim() || '';

        if (!bookingType) {
            alert('Please select Booking Type.');
            document.getElementById('contact-booking-type')?.focus();
            return false;
        }
        if (!name) {
            alert('Please enter Name / Team Name.');
            document.getElementById('contact-name')?.focus();
            return false;
        }
        if (!email) {
            alert('Please enter Email.');
            document.getElementById('contact-email')?.focus();
            return false;
        }
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            document.getElementById('contact-email')?.focus();
            return false;
        }
        if (!phoneCode || !phoneNumber) {
            alert('Please enter Phone number with country code.');
            if (!phoneCode) {
                document.getElementById('contact-phone-code')?.focus();
            } else {
                document.getElementById('contact-phone-number')?.focus();
            }
            return false;
        }
        return true;
    }

    // Next 버튼
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (validateStep1()) {
            goToStep(2);
        }
    });

    // Back 버튼
    backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        goToStep(1);
    });

    // 숫자 입력 필드 설정
    setupNumericInput('contact-phone-code');
    setupNumericInput('contact-phone-number');
    setupNumericInput('contact-onsite-phone-code');
    setupNumericInput('contact-onsite-phone-number');
    setupNumericInput('contact-passengers');
    setupNumericInput('contact-bike-boxes');
    setupNumericInput('contact-large-equipment');
    setupNumericInput('contact-additional-cargo');

    // Onsite contact 체크박스 토글
    const onsiteCheck = document.getElementById('contact-onsite-check');
    const onsiteFields = document.getElementById('onsite-fields');
    if (onsiteCheck && onsiteFields) {
        onsiteCheck.addEventListener('change', function() {
            if (this.checked) {
                onsiteFields.style.display = '';
            } else {
                onsiteFields.style.display = 'none';
                // 입력값 초기화
                var onsiteName = document.getElementById('contact-onsite-name');
                var onsitePhoneCode = document.getElementById('contact-onsite-phone-code');
                var onsitePhoneNumber = document.getElementById('contact-onsite-phone-number');
                if (onsiteName) onsiteName.value = '';
                if (onsitePhoneCode) onsitePhoneCode.value = '';
                if (onsitePhoneNumber) onsitePhoneNumber.value = '';
            }
        });
    }

    // flatpickr 날짜 선택 초기화
    if (typeof flatpickr !== 'undefined') {
        var fpDateConfig = {
            dateFormat: 'Y-m-d',
            allowInput: false
        };
        var arrDateEl = document.getElementById('contact-arrival-date');
        var depDateEl = document.getElementById('contact-departure-date');
        if (arrDateEl) flatpickr(arrDateEl, fpDateConfig);
        if (depDateEl) flatpickr(depDateEl, fpDateConfig);
    }

    // 시간 드롭다운 옵션 생성 (30분 간격)
    function populateTimeSelect(selectEl) {
        if (!selectEl) return;
        for (var h = 0; h < 24; h++) {
            for (var m = 0; m < 60; m += 30) {
                var hh = h < 10 ? '0' + h : '' + h;
                var mm = m < 10 ? '0' + m : '' + m;
                var val = hh + ':' + mm;
                var opt = document.createElement('option');
                opt.value = val;
                opt.textContent = val;
                selectEl.appendChild(opt);
            }
        }
    }
    populateTimeSelect(document.getElementById('contact-arrival-time'));
    populateTimeSelect(document.getElementById('contact-departure-time'));

    // 숙소 "Other" 선택 시 직접입력 필드 표시
    const accommodationField = document.getElementById('contact-accommodation');
    const accommodationOtherGroup = document.getElementById('accommodation-other-group');
    if (accommodationField && accommodationOtherGroup) {
        accommodationField.addEventListener('change', function() {
            accommodationOtherGroup.style.display = this.value === 'Other' ? '' : 'none';
            if (this.value !== 'Other') {
                const otherInput = document.getElementById('contact-accommodation-other');
                if (otherInput) otherInput.value = '';
            }
        });
    }

    // 서비스별 세부 차량 옵션
    const serviceDetails = {
        'Chauffeur - Airport Transfer': [
            { label: '[Sedan] G90', value: 'Sedan G90' },
            { label: '[Minivan] Staria', value: 'Minivan Staria' },
            { label: '[Minibus] Solati', value: 'Minibus Solati' },
            { label: '[Coach] 45 Seater', value: 'Coach 45 Seater' }
        ],
        'Chauffeur - Daily Charter': [
            { label: '[Sedan] G90', value: 'Sedan G90' },
            { label: '[Minivan] Staria', value: 'Minivan Staria' },
            { label: '[Minibus] Solati', value: 'Minibus Solati' },
            { label: '[Coach] 45 Seater', value: 'Coach 45 Seater' }
        ],
        'Rental Car (Self Drive)': [
            { label: '[Sedan] Sonata', value: 'Sedan Sonata' },
            { label: '[SUV] Palisade', value: 'SUV Palisade' },
            { label: '[Minivan] Carnival', value: 'Minivan Carnival' },
            { label: '[Minivan] Staria', value: 'Minivan Staria' }
        ],
        'Transport (Equipment/Cargo)': [
            { label: '[Truck] 1 Ton', value: 'Truck 1 Ton' },
            { label: '[Truck] 2.5 Ton', value: 'Truck 2.5 Ton' },
            { label: '[Truck] 5 Ton', value: 'Truck 5 Ton' }
        ]
    };

    // 선택된 서비스 목록 및 세부값 저장
    const selectedServicesList = [];
    const serviceSelections = {};

    // 서비스 드롭다운 → 선택된 서비스 목록 관리
    const serviceSelect = document.getElementById('service-select');
    const selectedServicesContainer = document.getElementById('selected-services');

    function updateServiceDropdown() {
        if (!serviceSelect) return;
        // 플레이스홀더 변경
        const placeholder = serviceSelect.querySelector('option[value=""]');
        if (placeholder) {
            placeholder.textContent = selectedServicesList.length > 0 ? 'Add service' : 'Select a service';
        }
        // 드롭다운을 플레이스홀더로 리셋
        serviceSelect.value = '';
    }

    function renderSelectedServices() {
        if (!selectedServicesContainer) return;
        selectedServicesContainer.innerHTML = '';

        if (selectedServicesList.length === 0) {
            selectedServicesContainer.style.display = 'none';
            updateServiceDropdown();
            return;
        }

        selectedServicesContainer.style.display = 'flex';
        selectedServicesList.forEach(function(serviceName, idx) {
            var details = serviceDetails[serviceName];
            var item = document.createElement('div');
            item.className = 'selected-service-item';

            var detailHtml = '';
            if (details) {
                var savedValue = serviceSelections[idx] || '';
                detailHtml = '<select class="service-detail-select" data-index="' + idx + '">'
                    + '<option value="" disabled ' + (!savedValue ? 'selected' : '') + '>Select vehicle</option>'
                    + details.map(function(d) { return '<option value="' + d.value + '" ' + (savedValue === d.value ? 'selected' : '') + '>' + d.label + '</option>'; }).join('')
                    + '</select>';
            }

            item.innerHTML = '<div class="service-item-header"><span class="service-item-name">' + serviceName + '</span><button type="button" class="btn-remove" data-index="' + idx + '">&times;</button></div>' + detailHtml;
            selectedServicesContainer.appendChild(item);
        });

        // 세부 선택 이벤트 바인딩
        selectedServicesContainer.querySelectorAll('.service-detail-select').forEach(function(select) {
            select.addEventListener('change', function() {
                serviceSelections[parseInt(this.dataset.index)] = this.value;
            });
        });

        updateServiceDropdown();
    }

    // 서비스 드롭다운 선택 시 추가 (동일 서비스 중복 선택 허용)
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            var value = this.value;
            if (value) {
                selectedServicesList.push(value);
                renderSelectedServices();
            }
        });
    }

    // 선택된 서비스 삭제 버튼 (이벤트 위임)
    if (selectedServicesContainer) {
        selectedServicesContainer.addEventListener('click', function(e) {
            var btn = e.target.closest('.btn-remove');
            if (!btn) return;
            var idx = parseInt(btn.dataset.index);
            if (idx >= 0 && idx < selectedServicesList.length) {
                selectedServicesList.splice(idx, 1);
                // 인덱스 기반 세부선택 재정렬
                var newSelections = {};
                var i = 0;
                selectedServicesList.forEach(function(_, newIdx) {
                    var oldIdx = newIdx >= idx ? newIdx + 1 : newIdx;
                    if (serviceSelections[oldIdx] !== undefined) {
                        newSelections[newIdx] = serviceSelections[oldIdx];
                    }
                });
                Object.keys(serviceSelections).forEach(function(k) { delete serviceSelections[k]; });
                Object.keys(newSelections).forEach(function(k) { serviceSelections[k] = newSelections[k]; });
                renderSelectedServices();
            }
        });
    }

    // 모달 닫힐 때 Step 1로 초기화
    const modalEl = document.getElementById('contact-us');
    if (modalEl) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class' && !modalEl.classList.contains('active')) {
                    goToStep(1);
                }
            });
        });
        observer.observe(modalEl, { attributes: true });
    }

    // 폼 제출 처리
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // 필드 요소
        const bookingTypeField = document.getElementById('contact-booking-type');
        const nameField = document.getElementById('contact-name');
        const emailField = document.getElementById('contact-email');
        const phoneCodeField = document.getElementById('contact-phone-code');
        const phoneNumberField = document.getElementById('contact-phone-number');
        const accommodationField = document.getElementById('contact-accommodation');
        const accommodationOtherField = document.getElementById('contact-accommodation-other');
        const arrivalDateField = document.getElementById('contact-arrival-date');
        const arrivalTimeField = document.getElementById('contact-arrival-time');
        const arrivalFlightField = document.getElementById('contact-arrival-flight');
        const departureDateField = document.getElementById('contact-departure-date');
        const departureTimeField = document.getElementById('contact-departure-time');
        const departureFlightField = document.getElementById('contact-departure-flight');
        const passengersField = document.getElementById('contact-passengers');
        const bikeBoxesField = document.getElementById('contact-bike-boxes');
        const largeEquipmentField = document.getElementById('contact-large-equipment');
        const additionalCargoField = document.getElementById('contact-additional-cargo');
        const messageField = document.getElementById('contact-message');

        // 필드 값
        const bookingType = bookingTypeField?.value || '';
        const name = nameField?.value.trim() || '';
        const email = emailField?.value.trim() || '';
        const phoneCode = phoneCodeField?.value.trim() || '';
        const phoneNumber = phoneNumberField?.value.trim() || '';
        const accommodation = accommodationField?.value || '';
        const accommodationOther = accommodationOtherField?.value.trim() || '';
        const arrivalDate = arrivalDateField?.value || '';
        const arrivalTime = arrivalTimeField?.value || '';
        const arrivalFlight = arrivalFlightField?.value.trim() || '';
        const departureDate = departureDateField?.value || '';
        const departureTime = departureTimeField?.value || '';
        const departureFlight = departureFlightField?.value.trim() || '';
        const passengers = passengersField?.value.trim() || '';
        const bikeBoxes = bikeBoxesField?.value.trim() || '';
        const largeEquipment = largeEquipmentField?.value.trim() || '';
        const additionalCargo = additionalCargoField?.value.trim() || '';
        const message = messageField?.value.trim() || '';
        const selectedServices = [...selectedServicesList];

        // 제출 버튼 비활성화
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // 메시지 조립
        const info = [];
        info.push(`Booking Type: ${bookingType}`);

        const phone = `+${phoneCode} ${phoneNumber}`;
        info.push(`Phone: ${phone}`);

        // Onsite contact 정보
        const onsiteCheck = document.getElementById('contact-onsite-check');
        if (onsiteCheck && onsiteCheck.checked) {
            const onsiteName = document.getElementById('contact-onsite-name')?.value.trim() || '';
            const onsitePhoneCode = document.getElementById('contact-onsite-phone-code')?.value.trim() || '';
            const onsitePhoneNumber = document.getElementById('contact-onsite-phone-number')?.value.trim() || '';
            if (onsiteName) info.push(`Onsite Contact Name: ${onsiteName}`);
            if (onsitePhoneCode || onsitePhoneNumber) {
                const onsitePhone = onsitePhoneCode ? `+${onsitePhoneCode} ${onsitePhoneNumber}` : onsitePhoneNumber;
                info.push(`Onsite Contact Phone: ${onsitePhone}`);
            }
        }

        const finalAccommodation = accommodation === 'Other' ? accommodationOther : accommodation;
        if (finalAccommodation) info.push(`Accommodation: ${finalAccommodation}`);
        const arrivalDateTime = [arrivalDate, arrivalTime].filter(Boolean).join(' ');
        if (arrivalDateTime) info.push(`Arrival: ${arrivalDateTime}`);
        if (arrivalFlight) info.push(`Arrival Flight: ${arrivalFlight}`);
        const departureDateTime = [departureDate, departureTime].filter(Boolean).join(' ');
        if (departureDateTime) info.push(`Departure: ${departureDateTime}`);
        if (departureFlight) info.push(`Departure Flight: ${departureFlight}`);
        if (selectedServices.length > 0) {
            var serviceLines = selectedServices.map(function(s, i) {
                var detail = serviceSelections[i];
                return detail ? s + ' (' + detail + ')' : s;
            });
            info.push('Services: ' + serviceLines.join(', '));
        }
        if (passengers) info.push(`Passengers: ${passengers}`);
        if (bikeBoxes) info.push(`Bike Boxes: ${bikeBoxes}`);
        if (largeEquipment) info.push(`Suitcases: ${largeEquipment}`);
        if (additionalCargo) info.push(`Additional Cargo: ${additionalCargo}`);

        let fullMessage = message || '(No special requests)';
        if (info.length > 0) {
            fullMessage = `${fullMessage}\n\n--- Additional Information ---\n${info.join('\n')}`;
        }

        const currentLang = (window.i18n && window.i18n.getLang) ? window.i18n.getLang() : 'ko';
        fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({
                name: name,
                email: email,
                message: fullMessage,
                lang: currentLang
            })
        })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) throw new Error(data.message || 'Network error');
                return data;
            });
        })
        .then(data => {
            if (data.success) {
                alert(data.message || 'Your inquiry has been sent successfully.');
                // 폼 리셋
                bookingTypeField.value = '';
                nameField.value = '';
                emailField.value = '';
                phoneCodeField.value = '';
                phoneNumberField.value = '';
                accommodationField.value = '';
                accommodationOtherField.value = '';
                accommodationOtherGroup.style.display = 'none';
                if (arrivalDateField?._flatpickr) arrivalDateField._flatpickr.clear();
                else if (arrivalDateField) arrivalDateField.value = '';
                if (arrivalTimeField) arrivalTimeField.value = '';
                arrivalFlightField.value = '';
                if (departureDateField?._flatpickr) departureDateField._flatpickr.clear();
                else if (departureDateField) departureDateField.value = '';
                if (departureTimeField) departureTimeField.value = '';
                departureFlightField.value = '';
                selectedServicesList.length = 0;
                Object.keys(serviceSelections).forEach(k => delete serviceSelections[k]);
                renderSelectedServices();
                passengersField.value = '';
                bikeBoxesField.value = '';
                largeEquipmentField.value = '';
                additionalCargoField.value = '';
                messageField.value = '';
                // Onsite contact 리셋
                var onsiteCheckEl = document.getElementById('contact-onsite-check');
                var onsiteFieldsEl = document.getElementById('onsite-fields');
                if (onsiteCheckEl) onsiteCheckEl.checked = false;
                if (onsiteFieldsEl) onsiteFieldsEl.style.display = 'none';
                var onsiteNameEl = document.getElementById('contact-onsite-name');
                var onsitePhoneCodeEl = document.getElementById('contact-onsite-phone-code');
                var onsitePhoneNumberEl = document.getElementById('contact-onsite-phone-number');
                if (onsiteNameEl) onsiteNameEl.value = '';
                if (onsitePhoneCodeEl) onsitePhoneCodeEl.value = '';
                if (onsitePhoneNumberEl) onsitePhoneNumberEl.value = '';
                goToStep(1);
                if (window.closeModal) window.closeModal('contact-us');
            } else {
                alert(data.message || 'An error occurred while sending. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('A network error occurred. Please try again.');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
    });
}

// DOM 로드 완료 후 contact form 초기화
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initTransportationForm();
});