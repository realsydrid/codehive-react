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
 * 숫자를 백만 단위로 변환하고 천 단위 구분기호를 추가합니다.
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