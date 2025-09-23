import { httpService } from '@learnway/shared';
import { LMSApiPrefix } from '@learnway/config';
import {
  Course,
  CourseListItem,
  CourseConfig,
  CourseConfigQueryParams,
  CoursesQueryParams,
  PaginationResponse,
} from '../../../types';

/**
 * 과정 관련 API 요청을 처리하는 서비스 클래스.
 */
export default class CourseService {
  /**
   * 과정 목록을 조회합니다.
   * @param [params] - 조회 파라미터 (선택 사항).
   * @returns 과정 목록 페이지네이션 응답 Promise.
   */
  static async fetchAll<T = CourseListItem>(
    params?: CoursesQueryParams,
  ): Promise<PaginationResponse<T>> {
    return httpService.get<PaginationResponse<T>>(`${LMSApiPrefix()}/courses`, params);
  }

  /**
   * 특정 ID의 과정을 조회합니다.
   * @param id - 조회할 과정 ID.
   * @returns 과정 상세 정보 Promise.
   */
  static async fetch<T = Course>(id: number): Promise<T> {
    return httpService.get<T>(`${LMSApiPrefix()}/course/${id}`);
  }

  /**
   * 새로운 과정을 생성합니다.
   * @param payload - 생성할 과정 정보.
   * @returns 생성된 과정 정보 Promise.
   */
  static async create(payload: Course): Promise<Course> {
    return httpService.post<Course>(`${LMSApiPrefix()}/course/wizard/new`, payload);
  }

  /**
   * 기존 과정을 수정합니다.
   * @param payload - 수정할 과정 정보 (ID 포함 필수).
   * @returns 수정된 과정 정보 Promise.
   */
  static update(payload: Course): Promise<Course> {
    return httpService.put<Course>(`${LMSApiPrefix()}/course/${payload.courseId}`, payload);
  }

  /**
   * 과정 삭제합니다.
   * @param id - 삭제할 과정 ID.
   * @returns 삭제 결과 Promise. (any 대신 실제 응답 타입 명시 권장)
   */
  static delete(id: number): Promise<any> {
    return httpService.delete<any>(`${LMSApiPrefix()}/course/${id}`);
  }

  /**
   * 기존 과정을 수정합니다. step1
   * @param payload - 수정할 과정 정보 (ID 포함 필수).
   * @returns 수정된 과정 정보 Promise.
   */
  static updateWizard1(payload: Course): Promise<Course> {
    return httpService.put<Course>(`${LMSApiPrefix()}/course/wizard1/${payload.courseId}`, payload);
  }

  /**
   * 기존 과정을 수정합니다. step2
   * @param payload - 수정할 과정 정보 (ID 포함 필수).
   * @returns 수정된 과정 정보 Promise.
   */
  static updateWizard2(payload: Course): Promise<Course> {
    return httpService.put<Course>(`${LMSApiPrefix()}/course/wizard2/${payload.courseId}`, payload);
  }

  /**
   * 기존 과정을 수정합니다. step3
   * @param payload - 수정할 과정 정보 (ID 포함 필수).
   * @returns 수정된 과정 정보 Promise.
   */
  static updateWizard3(payload: Course): Promise<Course> {
    return httpService.put<Course>(`${LMSApiPrefix()}/course/wizard3/${payload.courseId}`, payload);
  }

  /**
   * 기존 과정을 수정합니다. step4
   * @param payload - 수정할 과정 정보 (ID 포함 필수).
   * @returns 수정된 과정 정보 Promise.
   */
  static updateWizard4(payload: Course): Promise<Course> {
    return httpService.put<Course>(`${LMSApiPrefix()}/course/wizard4/${payload.courseId}`, payload);
  }

  /**
   * 기존 과정을 수정합니다. step5
   * @param payload - 수정할 과정 정보 (ID 포함 필수).
   * @returns 수정된 과정 정보 Promise.
   */
  static updateWizard5(payload: Course): Promise<Course> {
    return httpService.put<Course>(`${LMSApiPrefix()}/course/wizard5/${payload.courseId}`, payload);
  }

  /**
   * 과정 항목 설정 정보
   * @param [params] - 조회 파라미터 (선택 사항).
   * @returns 과정 목록 페이지네이션 응답 Promise.
   */
  static async fetchCourseConfig<T = CourseConfig>(
    queryParams: CourseConfigQueryParams,
  ): Promise<T> {
    return httpService.get<T>(`${LMSApiPrefix()}/course/config`, queryParams);
  }
}
