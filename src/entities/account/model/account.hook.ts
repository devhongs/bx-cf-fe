import type {
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'

import { useModal } from '@learnway/ui'
import {
  Course,
  CourseConfig,
  CourseConfigQueryParams,
  CoursesQueryParams,
  MutationHookOptions,
  PaginationResponse,
} from '../../../types'
import { mutateOptions, queryOptions } from './account.queries'

/**
 * 모든 코스 목록을 가져오는 쿼리 훅.
 * @param params - 코스 목록 조회 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchCourses = <T = Course>(
  params: CoursesQueryParams,
  options?: UseQueryOptions<PaginationResponse<T>, Error>,
): UseQueryResult<PaginationResponse<T>, Error> => {
  return useQuery({ ...queryOptions.all<T>(params), ...options })
}

/**
 * 특정 ID의 코스 정보를 가져오는 쿼리 훅.
 * @param id - 조회할 코스의 ID.
 */
export const useFetchCourse = <T = Course>(
  id: number,
  options?: UseQueryOptions<T, Error>,
): UseQueryResult<T, Error> => {
  return useQuery({ ...queryOptions.get<T>(id), ...options })
}

/**
 * 새로운 코스를 생성하는 뮤테이션 훅.
 * 성공 시 'showSaveComplete' 모달을 표시합니다.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useCreateCourse = (
  options?: MutationHookOptions<Course, Error, Course, unknown>,
): UseMutationResult<Course, Error, Course, unknown> => {
  const { showSaveComplete } = useModal()
  return useMutation({
    ...mutateOptions.create(),
    ...options,
    onSuccess: async (data, variables, context) => {
      await showSaveComplete()
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
  })
}

/**
 * 기존 코스 정보를 업데이트하는 뮤테이션 훅.
 * 성공 시 'showUpdateComplete' 모달을 표시합니다.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useUpdateCourse = (
  options?: MutationHookOptions<Course, Error, Course, unknown>,
): UseMutationResult<Course, Error, Course, unknown> => {
  const { showUpdateComplete } = useModal()
  return useMutation({
    ...mutateOptions.update(),
    ...options,
    onSuccess: async (data, variables, context) => {
      await showUpdateComplete()
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
  })
}

/**
 * 기존 코스를 삭제하는 뮤테이션 훅.
 * 성공 시 'showDeleteComplete' 모달을 표시합니다.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useDeleteCourse = (
  options?: MutationHookOptions<any, Error, number, unknown>,
): UseMutationResult<any, Error, number, unknown> => {
  // 반환 타입 any는 실제 API 응답 타입으로 명시 권장
  const { showDeleteComplete } = useModal()
  return useMutation({
    ...mutateOptions.delete(),
    ...options,
    onSuccess: async (data, variables, context) => {
      await showDeleteComplete()
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
  })
}

/**
 * 과정 수정 STEP1
 * 성공 시 'showSaveComplete' 모달을 표시합니다.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useUpdateCourseWizard1 = (
  options?: MutationHookOptions<Course, Error, Course, unknown>,
): UseMutationResult<Course, Error, Course, unknown> => {
  const { showSaveComplete } = useModal()
  return useMutation({
    ...mutateOptions.updateWizard1(),
    ...options,
    onSuccess: async (data, variables, context) => {
      await showSaveComplete()
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
  })
}

/**
 * 과정 수정 STEP2
 * 성공 시 'showSaveComplete' 모달을 표시합니다.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useUpdateCourseWizard2 = (
  options?: MutationHookOptions<Course, Error, Course, unknown>,
): UseMutationResult<Course, Error, Course, unknown> => {
  const { showSaveComplete } = useModal()
  return useMutation({
    ...mutateOptions.updateWizard2(),
    ...options,
    onSuccess: async (data, variables, context) => {
      await showSaveComplete()
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
  })
}

/**
 * 과정 수정 STEP3
 * 성공 시 'showSaveComplete' 모달을 표시합니다.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useUpdateCourseWizard3 = (
  options?: MutationHookOptions<Course, Error, Course, unknown>,
): UseMutationResult<Course, Error, Course, unknown> => {
  const { showSaveComplete } = useModal()
  return useMutation({
    ...mutateOptions.updateWizard3(),
    ...options,
    onSuccess: async (data, variables, context) => {
      await showSaveComplete()
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
  })
}

/**
 * 과정 수정 STEP4
 * 성공 시 'showSaveComplete' 모달을 표시합니다.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useUpdateCourseWizard4 = (
  options?: MutationHookOptions<Course, Error, Course, unknown>,
): UseMutationResult<Course, Error, Course, unknown> => {
  const { showSaveComplete } = useModal()
  return useMutation({
    ...mutateOptions.updateWizard4(),
    ...options,
    onSuccess: async (data, variables, context) => {
      await showSaveComplete()
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
  })
}

/**
 * 과정 수정 STEP5
 * 성공 시 'showSaveComplete' 모달을 표시합니다.
 * @param [options] - 추가 뮤테이션 설정 옵션.
 */
export const useUpdateCourseWizard5 = (
  options?: MutationHookOptions<Course, Error, Course, unknown>,
): UseMutationResult<Course, Error, Course, unknown> => {
  const { showSaveComplete } = useModal()
  return useMutation({
    ...mutateOptions.updateWizard5(),
    ...options,
    onSuccess: async (data, variables, context) => {
      await showSaveComplete()
      // 추가적인 성공 처리 로직이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
  })
}

/**
 * 과정 항목 설정 정보 조회
 * @param params - 코스 목록 조회 쿼리 파라미터.
 * @param options - 추가 쿼리 옵션.
 */
export const useFetchCourseConfig = <T = CourseConfig>(
  params: CourseConfigQueryParams,
  options?: UseQueryOptions<T, Error>,
): UseQueryResult<T, Error> => {
  return useQuery({ ...queryOptions.getCourseConfig<T>(params), ...options })
}
