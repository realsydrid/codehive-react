/**
 * 숫자의 소수점을 지정된 자릿수까지만 표시하고 나머지는 버림
 * @param {number} num - 포맷팅할 숫자
 * @param {number} digits - 표시할 소수점 자릿수 (기본값: 2)
 * @returns {number} 버림 처리된 숫자
 */
export const truncateDecimals = (num, digits = 2) => {
    if (num === undefined || num === null) return 0;
    return Math.floor(num * Math.pow(10, digits)) / Math.pow(10, digits);
};

/**
 * 숫자에 천 단위 구분기호를 추가하고 소수점을 지정된 자릿수까지 표시
 * @param {number} num - 포맷팅할 숫자
 * @param {number} digits - 표시할 소수점 자릿수 (기본값: 2)
 * @param {string} locale - 사용할 로케일 (기본값: 'ko-KR')
 * @returns {string} 포맷팅된 문자열
 */
export const formatDecimalsWithCommas = (num, digits = 2, locale = 'ko-KR') => {
    if (num === undefined || num === null) return '0';


    const truncated = truncateDecimals(num, digits);


    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: digits
    }).format(truncated);
};

/**
 * 퍼센트표시
 * @param {number} value
 * @param {number} digits
 * @returns {string} "%"
 */
export const formatPercentWithDecimals = (value, digits = 2) => {
    if (value === undefined || value === null) return '0%';

    const percentage = value * 100;
    return `${truncateDecimals(percentage, digits)}%`;
};

/**
 * 숫자를 백만 단위로 변환하고 천 단위 구분기호 추가
 * 예: 1234567 -> 1, 9876543 -> 9
 * @param {number} num - 포맷팅할 숫자
 * @param {number} digits - 소수점 이하 자릿수 (기본값: 0)
 * @param {string} locale - 사용할 로케일 (기본값: 'ko-KR')
 * @returns {string} 백만 단위로 변환되고 쉼표가 포함된 문자열
 */
export const formatMillionsWithCommas = (num, digits = 0, locale = 'ko-KR') => {
    if (num === undefined || num === null) return '0';


    const inMillions = num / 1000000;


    const truncated = truncateDecimals(inMillions, digits);

    // 백만 단위 이상인 경우
    if (Math.abs(num) >= 1000000) {
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: digits
        }).format(truncated);
    }

    // 백만 미만인 경우 일반 숫자 포맷 사용
    return formatDecimalsWithCommas(num, digits, locale);
};

/**
 * 숫자를 지정된 소수점 자리수로 포맷팅합니다.
 *
 * @param {number|string} value - 포맷할 숫자 값
 * @param {number} fixedDigits - 소수점 이하 몇 자리까지 표시할지 (기본값: 2)
 * @param {boolean} padZeros - true이면 부족한 소수점을 0으로 채움 (예: 0.1 → 0.100)
 * @returns {string} - 포맷팅된 문자열
 */
export const formatDecimal = (value, fixedDigits = 2, padZeros = false) => {
    // 숫자가 아니면 예외 처리
    if (isNaN(value)) return '-';

    // 문자열로 들어온 숫자도 변환
    const number = Number(value);

    if (padZeros) {
        // 고정 소수점 자리수로 변환 (0 채움): toFixed는 문자열 반환
        return number.toFixed(fixedDigits);
    } else {
        // 지정한 자리까지 반올림 후, 불필요한 0은 제거된 숫자 문자열 반환
        const factor = Math.pow(10, fixedDigits);          // 10^자릿수
        const rounded = Math.round(number * factor) / factor;
        return rounded.toString();                          // 예: 0.1
    }
}