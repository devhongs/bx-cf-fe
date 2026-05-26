import type { ApiListResponse, ApiResponse } from '@/shared/api/types';
import { API_URL } from '@/shared/constants';
import { HttpJsonService } from '@/shared/lib/ajax/http.json.service';

import type { Product, ProductQueryParams } from '../model/product.type';

/**
 * 메뉴 관련 API 요청을 처리하는 서비스 클래스.
 */
export class ProductService {
  /**
   * 메뉴 목록을 조회합니다.
   * @param [params] - 조회 파라미터 (선택 사항). ㄴ
   * @returns 메뉴 목록 페이지네이션 응답 Promise.
   */
  static async fetchAll<T = Product>(
    params?: ProductQueryParams,
  ): Promise<ApiListResponse<T>> {
    // return httpService.get<ApiResponse<T>>(`${API_URL}menus`, params)
    return HttpJsonService.fetchAll<T>(`${API_URL}/products`, params);
  }

  /**
   * 특정 No의 메뉴을 조회합니다.
   * @param accountNo - 조회할 메뉴 No.
   * @returns 메뉴 상세 정보 Promise.
   */
  static async fetch<T = Product>(id: number): Promise<ApiResponse<T>> {
    // return httpService.get<T>(`${API_URL}//alarm/${accountNo}`)
    return HttpJsonService.fetch<T>(`${API_URL}/products/?id=${id}`);
  }

  /**
   * 새로운 메뉴을 생성합니다.
   * @param payload - 생성할 메뉴 정보.
   * @returns 생성된 메뉴 정보 Promise.
   */
  static async create(payload: Product): Promise<Product> {
    // return httpService.post<Alarm>(`${API_URL}//alarm`, payload)
    return HttpJsonService.post<any>(
      `${API_URL}/products/${payload.id}`,
      payload,
    );
  }

  /**
   * 메뉴 삭제합니다.
   * @param id - 삭제할 메뉴 ID.
   * @returns 삭제 결과 Promise. (any 대신 실제 응답 타입 명시 권장)
   */
  static delete(id: number): Promise<any> {
    // return HttpJsonService.delete<T>(`${API_URL}/menus/${id}`)
    return HttpJsonService.delete<any>(`${API_URL}/menus/${id}?_dependent=id`);
  }
}
