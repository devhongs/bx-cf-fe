import { BwgContext } from '@bwg-ds/core'
// next/dynamic을 사용하지 않으므로 해당 import를 제거합니다.
import { useContext } from 'react'
import { v4 } from 'uuid'

import useSetModal from '../model/modal/useSetModal'

import { $deviceUtils } from '@/shared/lib/utils/common.device'
import { $i18nUtils } from '@/shared/lib/utils/common.i18n'
import { $storageUtils } from '@/shared/lib/utils/common.storage'

function useModal() {
  const { coreData } = useContext(BwgContext)
  const { pushModalList, popModalList } = useSetModal()

  /**
   * 메시지 alert
   * @param {object} params
   */
  const alert = (params: any = {}) =>
    new Promise((resolve, reject) => {
      const messageInfo = {
        screenId: 'MessageAlert',
        instance: 'components/common/MessageAlert',
        params: {
          title: params.title || $i18nUtils.trans('K009#ok'),
          ...params,
        },
      }
      openPopup(messageInfo).then(() => {
        resolve(null)
      })
    })

  /**
   * 메시지 confirm
   * @param {object} params
   */
  const confirm = (params: any = {}) =>
    new Promise((resolve, reject) => {
      const messageInfo = {
        screenId: 'MessageConfirm',
        instance: 'components/common/MessageConfirm',
        params: {
          title: params.title || $i18nUtils.trans('K009#ok'),
          ...params,
        },
      }
      openPopup(messageInfo).then((result) => {
        resolve(result)
      })
    })

  /**
   * 메시지 valid
   * @param {object} params
   */
  const valid = (params: any = {}) =>
    new Promise((resolve, reject) => {
      const messageInfo = {
        screenId: 'MessageValid',
        instance: 'components/common/MessageValid',
        params,
      }
      openPopup(messageInfo).then((result) => {
        resolve(result)
      })
    })

  /**
   * 메시지 error
   * @param {object} params
   */
  const error = (params: any = {}) =>
    new Promise((resolve, reject) => {
      const messageInfo = {
        screenId: 'MessageError',
        instance: 'components/common/MessageError',
        params,
      }
      openPopup(messageInfo).then((result) => {
        resolve(result)
      })
    })

  /**
   * Android / IOS install open
   * @param {object} params
   */
  const openInstallPopup = (params: any = {}) =>
    new Promise((resolve, reject) => {
      let messageInfo = {}

      if ($deviceUtils.checkiOS()) {
        messageInfo = {
          screenId: 'InstallIOS',
          instance: 'components/layout/InstallIOS',
          params,
        }
        openPopup(messageInfo).then((result) => {
          resolve(result)
        })
      } else {
        // Web, Android
        messageInfo = {
          screenId: 'InstallAOS',
          instance: 'components/layout/InstallAOS',
          params,
        }
        openPopup(messageInfo).then((result) => {
          resolve(result)
        })
      }
    })

  /**
   * 팝업오픈
   * @param {object} params
   */
  // TODO: params 타입 정의
  const openPopup = (params: any) =>
    new Promise((resolve, reject) => {
      if (typeof window !== 'undefined') {
        // console.log("params :: ", params)
        const activeEl = document.activeElement as HTMLElement // 포커스된 element
        activeEl.blur()
        const settings = {
          ...params,
          modalUUID: v4(),
          activeEl,
          resolve,
        }

        // 뒤로가기를 위한 state 추가
        window.history.pushState(null, '', `?modalUUID=${settings.modalUUID}`)
        $storageUtils.session(coreData.modalSettings.closeStatusKey, null)
        $storageUtils.session('popScrnId', params.screenId)
        pushModalList(settings)
      }
    })

  /**
   * 팝업닫기
   * @param modalInfo
   * @param params
   */
  const closePopup = (
    modalInfo: any,
    params: any = {},
    isAreadyHistoryBack = false,
  ) => {
    // 닫기 시 추가된 history state 제거
    // Browser Back Button일 경우는 이미 history가 popstate 된 상태이므로 조건에 해당하지 않는다.
    // 그러므로 modal에서 직접 closePopup을 호출하는 경우만 분기 안으로 진입한다.
    if (window.location.search.indexOf('modalUUID') > -1) {
      $storageUtils.session(coreData.modalSettings.closeStatusKey, 'Y')
      if (!isAreadyHistoryBack) {
        window.history.back()
      }
    }

    // fade out 효과를 주기 위해 time out 처리
    // 이중팝업 Case로 인한 Timeout 제거
    // setTimeout(() => {
    popModalList(params)
    // }, 200)
    modalInfo?.resolve(params)
    if (modalInfo?.activeEl.name !== 'keyWord') {
      modalInfo?.activeEl.focus() // 원래 active 된 element에 포커스를 준다.
    }
    $storageUtils.session('popScrnId', null) // TODO: 팝업이 여러개인 경우 처리 필요
  }

  /**
   * 팝업닫기
   * @param {string} screenId
   */
  const closePopupOnPage = (modalInfo: any, params: any = {}) => {
    // fade out 효과를 주기 위해 time out 처리
    // 이중팝업 Case로 인한 Timeout 제거
    // setTimeout(() => {
    popModalList(params)
    // }, 200)
    $storageUtils.session('popScrnId', null) // TODO: 팝업이 여러개인 경우 처리 필요
  }

  /**
   * 메뉴검색팝업
   * @param params
   */
  const commonMenuSearch = (params: any = {}) =>
    new Promise((resolve, reject) => {
      const popupInfo = {
        screenId: 'UGCPGSCMP001',
        instance: 'pages/popup/scm/UGCPGSCMP001',
        params,
      }
      openPopup(popupInfo).then((result: any) => {
        resolve(result)
      })
    })

  /**
   * 단축키정보팝업
   * @param params
   */
  const commonShortCut = (params: any = {}) =>
    new Promise((resolve, reject) => {
      const popupInfo = {
        screenId: 'UGCPGSCMP001',
        instance: 'pages/popup/scm/UGCPGSCMP001',
        params,
      }
      openPopup(popupInfo).then((result: any) => {
        resolve(result)
      })
    })

  return {
    alert,
    confirm,
    valid,
    error,
    openInstallPopup,
    openPopup,
    closePopup,
    closePopupOnPage,
    commonMenuSearch,
    commonShortCut,
  }
}

export default useModal
