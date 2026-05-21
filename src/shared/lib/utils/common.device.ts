import CONFIG from '@/shared/constants/siteConfig';

// _app.tsx에서 setting되는 beforeinstallprompt Event 변수
// 앱 다운로드를 위해 사용됨
let installPromptEvent: any;

/**
 * Android 기기 체크
 * @returns
 */
const checkAndroid = () => navigator.userAgent.match(/Android/i);

/**
 * IOS 기기 체크
 * @returns
 */
const checkiOS = () => navigator.userAgent.match(/iPhone|iPad|iPod/i);

/**
 * Mobile 여부 체크
 * @returns
 */
const checkMobile = () => checkAndroid() || checkiOS();

/**
 * 기기 유형 조회
 * @returns
 */
const getDeviceType = () => {
  if (checkAndroid()) {
    return CONFIG.DEVICE.ANDROID;
  }
  if (checkiOS()) {
    return CONFIG.DEVICE.IOS;
  }
  return 'any';
};

/**
 * PWA 설치 프롬프트 이벤트
 * @param value
 */
const setInstallPromptEvent = (value: any) => {
  installPromptEvent = value;
};

/**
 * 설치
 */
const doInstall = () => {
  if (checkiOS()) {
    return;
  }

  if (installPromptEvent) {
    // 설치 프롬프트 표시
    installPromptEvent.prompt();

    // 사용자의 응답 기다림
    installPromptEvent.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted');
      } else {
        console.log('User dismissed');
      }

      // 설치 프롬프트 초기화
      installPromptEvent = null;
    });
  }
};

export const $deviceUtils = {
  checkAndroid,
  checkiOS,
  checkMobile,
  getDeviceType,
  setInstallPromptEvent,
  doInstall,
};
