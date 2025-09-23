import CourseService from '../api/course';
import {
  Course,
  CourseConfig,
  CourseConfigQueryParams,
  CoursesQueryParams,
  PaginationResponse,
} from '../../../types';
import { UseQueryOptions } from '@tanstack/react-query';

export const queryKeys = {
  all: ['courses'] as const,
  get: (id: number) => ['course', id] as const,
  getCourseConfig: (queryParams: CourseConfigQueryParams) =>
    ['course', 'config', queryParams] as const,
};

export const queryOptions = {
  // 과정 목록 조회
  all: <T = Course>(params: CoursesQueryParams): UseQueryOptions<PaginationResponse<T>> => ({
    queryKey: queryKeys.all,
    queryFn: async (): Promise<PaginationResponse<T>> => CourseService.fetchAll(params),
  }),
  // 과정 상세 조회
  get: <T = Course>(id: number): UseQueryOptions<T> => ({
    queryKey: queryKeys.get(id),
    queryFn: () => CourseService.fetch(id),
  }),
  // 과정 항목 설정 정보 조회
  getCourseConfig: <T = CourseConfig>(queryParams: CourseConfigQueryParams) => ({
    queryKey: queryKeys.getCourseConfig(queryParams),
    queryFn: () => CourseService.fetchCourseConfig<T>(queryParams),
  }),
};

export const mutateOptions = {
  // 과정 생성
  create: () => ({
    mutationFn: (payload: Course) => CourseService.create(payload),
  }),
  // 과정 수정
  update: () => ({
    mutationFn: (payload: Course) => CourseService.update(payload),
  }),
  // 과정 삭제
  delete: () => ({
    mutationFn: (id: number) => CourseService.delete(id),
  }),
  // 과정 수정 step1
  updateWizard1: () => ({
    mutationFn: (payload: Course) => CourseService.updateWizard1(payload),
  }),
  // 과정 수정 step2
  updateWizard2: () => ({
    mutationFn: (payload: Course) => CourseService.updateWizard2(payload),
  }),
  // 과정 수정 step3
  updateWizard3: () => ({
    mutationFn: (payload: Course) => CourseService.updateWizard3(payload),
  }),
  // 과정 수정 step4
  updateWizard4: () => ({
    mutationFn: (payload: Course) => CourseService.updateWizard4(payload),
  }),
  // 과정 수정 step5
  updateWizard5: () => ({
    mutationFn: (payload: Course) => CourseService.updateWizard5(payload),
  }),
};
