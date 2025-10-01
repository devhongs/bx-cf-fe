// React의 기본적인 props를 확장하려면 React.HTMLAttributes<HTMLDivElement> 등을 사용할 수 있습니다.
// 예시:
export interface BaseProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}
