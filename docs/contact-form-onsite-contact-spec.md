# Contact Us Form — Onsite Contact Field 추가 기획서

**기능**: Contact Us 모달 폼에 현장 담당자 연락처 선택 입력 추가
**UI 표시 언어**: 영문
**대상 화면**: Step 1 — Basic Information
**작성일**: 2026-03

---

## 배경

예약자와 현장에 실제로 나와 있는 담당자가 다른 경우가 있어, 현장 담당자 연락처를 별도로 수집할 수 있는 입력 영역이 필요합니다. 두 역할이 동일한 사용자의 폼 경험은 그대로 유지하면서, 필요한 경우에만 추가 입력을 받는 구조로 설계합니다.

---

## 설계 결정 — Option A: Checkbox Toggle (Progressive Disclosure)

체크박스를 선택하면 현장 담당자 입력 필드가 아래로 펼쳐지는 방식입니다. 예약자와 현장 담당자가 동일한 대다수 사용자는 체크박스를 건드리지 않고 그냥 넘어갑니다.

**선택 이유**

- 기본 폼을 최대한 간결하게 유지할 수 있음
- 체크박스 레이블이 의도를 명확하게 전달함 (조건 명시)
- 힉의 법칙 — 기본 상태에서 입력 항목 수를 최소화해 사용자 결정 속도 향상
- 현장 담당자가 다른 케이스가 전체의 30% 미만인 경우 가장 적합

---

## UI 설계

### 배치 위치

Phone 필드 행과 Accommodation 필드 사이에 수평 구분선을 위아래로 두고 삽입합니다.

```
[ Email * ]          [ Phone (incl. country code) * ]

────────────────────────────────────────────────────

☐  Onsite contact differs from the booker

────────────────────────────────────────────────────

[ Accommodation ]
```

### Checkbox 레이블

```
☐  Onsite contact differs from the booker
```

- 폰트 크기: 13px
- 기본 상태: 미선택(unchecked)
- 레이블 전체 영역 클릭 가능 (접근성 대응)

### 펼쳐진 상태 (체크 시)

체크박스를 선택하면 아래 섹션이 애니메이션과 함께 펼쳐집니다.

```
☑  Onsite contact differs from the booker

  Onsite Contact Name          (optional)
  [ e.g., John Smith                    ]

  Onsite Contact Phone         (optional)
  [ + Code ]  [ e.g., 1012345678        ]

  Person available at the venue on the day of service.
```

**필드 상세**

| 필드 | 레이블 | Placeholder | 필수 여부 | 비고 |
|---|---|---|---|---|
| 이름 | Onsite Contact Name | e.g., John Smith | 선택 | 자유 입력 |
| 국가 코드 | — | + Code | 선택 | 예약자 Phone과 동일 패턴 |
| 전화번호 | Onsite Contact Phone | e.g., 1012345678 | 선택 | 국가 코드와 쌍으로 구성 |

### Helper Text (전화번호 필드 하단, 펼쳐진 상태에서만 노출)

```
Person available at the venue on the day of service.
```

- 폰트 크기: 11px
- 색상: muted / tertiary text 컬러 적용

### 접힌 상태 (체크 해제 시)

필드와 helper text가 위로 올라가며 숨겨집니다. 입력된 값은 초기화됩니다.

---

## 인터랙션 동작

| 상태 | 트리거 | 결과 |
|---|---|---|
| 기본 | 페이지 진입 | Checkbox 미선택, 필드 숨김 |
| 펼침 | 사용자가 Checkbox 선택 | 필드 아래로 펼쳐짐 (max-height transition) |
| 접힘 | 사용자가 Checkbox 해제 | 필드 접힘, 입력값 초기화 |
| 유효성 검사 | Next 버튼 클릭 | Checkbox 미선택 시 Onsite 필드 검사 제외, 필수 오류 없음 |

---

## Step 1 전체 필드 순서

1. Booking Type · Name / Team Name
2. Email · Phone
3. `────` 구분선
4. **☐ Onsite contact differs from the booker** ← 신규 추가
5. `────` 구분선
6. Accommodation
7. Arrival Date · Arrival Time
8. Arrival Flight No.
9. Departure Date · Departure Time
10. Departure Flight No.
11. Cancel · Next

---

## 데이터 처리 메모

- `onsite_contact_name` — string, nullable
- `onsite_contact_country_code` — string, nullable
- `onsite_contact_phone` — string, nullable
- Checkbox 미선택 시 세 필드 모두 `null`로 전송
- 서버 측 필수값 검사 없음 (선택 필드)

---

## 접근성

- Checkbox에 `<label>` 연결 — 전체 행 클릭 가능
- 펼쳐진 필드는 키보드 Tab 순서에 포함 (DOM 순서 기준)
- 각 입력 필드에 명시적 `<label>` 사용 — placeholder만으로 레이블 대체하지 않음
- 접힌 상태의 필드는 Tab 순서에서 제외 (`display: none` 또는 `visibility: hidden` 처리)

---

## 이번 범위에서 제외

- 현장 담당자 복수 등록 (이번 버전은 1명만 지원)
- 현장 담당자 Email 필드 (전화번호만 수집)
- 별도 Step 또는 Modal로 분리하는 방식
