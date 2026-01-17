export interface IResponse<T = undefined> {
  message: string
  isSuccess: boolean
  data?: T
}
