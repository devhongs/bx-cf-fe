// export const authGuard2 = async ({ context }: any) => {
//   const { accessToken, refreshToken, setAccessToken } = context.auth.tokens

//   if (await AuthService.checkAccessToken(accessToken)) return

//   const newAccessToken = await AuthService.checkRefreshToken(refreshToken)
//   if (newAccessToken) {
//     setAccessToken(newAccessToken)
//     return
//   }

//   throw redirect({ to: '/login' })
// }
