// Transportation 페이지 스크립트
(async function() {
    // JSON 데이터 로드
    var bp = (window.i18n && window.i18n.basePath) || '';
    const response = await fetch(bp + '/data/vehicle-service.json');
    const data = await response.json();

    const { services, vehicles } = data;

    // DOM 요소
    const tabButtonWrapper = document.querySelector('.tab-button > ul');
    const tabButtonItems = document.querySelectorAll('.tab-button li');
    const tabButtons = document.querySelectorAll('.tab-button button');
    const tabDescription = document.querySelector('.tab-description');
    const tabListWrapper = document.querySelector('.tab-list');
    const tabList = document.querySelector('.tab-list ul');
    const sctTransport = document.querySelector('.sct-transport');

    // 서비스 ID 목록 (클래스 토글용)
    const serviceIds = services.map(service => service.id);

    // 현재 활성화된 탭 인덱스
    let currentTabIndex = 0;

    // 탭 슬라이더 배경 위치 업데이트
    function updateTabSlider(index) {
        const activeItem = tabButtonItems[index];
        const itemWidth = activeItem.offsetWidth;
        const itemHeight = activeItem.offsetHeight;
        const itemLeft = activeItem.offsetLeft;
        const itemTop = activeItem.offsetTop;

        tabButtonWrapper.style.setProperty('--tab-width', `${itemWidth}px`);
        tabButtonWrapper.style.setProperty('--tab-height', `${itemHeight}px`);
        tabButtonWrapper.style.setProperty('--tab-left', `${itemLeft}px`);
        tabButtonWrapper.style.setProperty('--tab-top', `${itemTop}px`);
    }

    // 값이 "Not available"인 경우 클래스 반환
    function getValueClass(value) {
        return value === 'Not available' ? 'value alert' : 'value';
    }

    // 차량 아이템 HTML 생성
    function createVehicleItem(vehicle) {
        // Local Coordinator는 별도 템플릿
        if (vehicle.type === 'service') {
            return `
                <li data-vehicle-id="${vehicle.id}">
                    <div>
                        <div class="image">
                            <img src="${vehicle.image}" alt="">
                        </div>
                        <div class="content">
                            <p class="title">${vehicle.title}</p>
                            <div class="text">
                                <div class="spec">
                                    <p>${vehicle.description}</p>
                                </div>
                                <div class="note">
                                    <p>${vehicle.note}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            `;
        }

        // spec row 생성 헬퍼 함수
        const createSpecRow = (label, value, className = '') => {
            if (!value) return '';
            return `
                <div class="row${className ? ' ' + className : ''}">
                    <div class="label">${label}</div>
                    <div class="${getValueClass(value)}">${value}</div>
                </div>
            `;
        };

        // 일반 차량 템플릿
        return `
            <li data-vehicle-id="${vehicle.id}">
                <div>
                    <div class="image">
                        <img src="${vehicle.image}" alt="">
                    </div>
                    <div class="content">
                        <p class="title">${vehicle.title}</p>
                        <div class="text">
                            <div class="spec">
                                ${createSpecRow('Seats:', vehicle.specs.seats)}
                                ${createSpecRow('Standard Baggage:', vehicle.specs.baggage)}
                                ${createSpecRow('Bicycle Storage:', vehicle.specs.bicycle)}
                            </div>
                            <div class="note">
                                <p>${vehicle.note}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        `;
    }

    // 서비스에 따른 차량 리스트 렌더링
    function renderVehicles(serviceIndex) {
        const service = services[serviceIndex];
        const filteredVehicles = vehicles.filter(v => service.vehicles.includes(v.id));

        // 설명 업데이트
        tabDescription.innerHTML = `<p>${service.description}</p>`;

        // service 타입 여부에 따라 .tab-list에 service 클래스 토글
        const hasServiceType = filteredVehicles.some(v => v.type === 'service');
        tabListWrapper.classList.toggle('service', hasServiceType);

        // 차량 리스트 업데이트
        tabList.innerHTML = filteredVehicles.map(createVehicleItem).join('');
    }

    // sct-transport 섹션에 현재 활성화된 서비스 클래스 업데이트
    function updateServiceClass(index) {
        // 기존 서비스 클래스 모두 제거
        serviceIds.forEach(id => sctTransport.classList.remove(id));
        // 현재 서비스 클래스 추가
        sctTransport.classList.add(serviceIds[index]);
    }

    // 탭 버튼 클릭 이벤트
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // active 클래스 토글 (li에 적용)
            tabButtonItems.forEach(item => item.classList.remove('active'));
            tabButtonItems[index].classList.add('active');

            // 현재 탭 인덱스 업데이트
            currentTabIndex = index;

            // 슬라이더 배경 이동
            updateTabSlider(index);

            // sct-transport 섹션에 서비스 클래스 업데이트
            updateServiceClass(index);

            // 해당 서비스의 차량 렌더링
            renderVehicles(index);
        });
    });

    // 탭 버튼 영역 크기 변경 감지 (ResizeObserver 사용)
    const resizeObserver = new ResizeObserver(() => {
        updateTabSlider(currentTabIndex);
    });
    resizeObserver.observe(tabButtonWrapper);

    // 초기 렌더링 (ONE-WAY)
    updateTabSlider(0);
    updateServiceClass(0);
    renderVehicles(0);
})();