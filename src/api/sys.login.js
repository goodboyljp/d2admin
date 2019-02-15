import {service} from '@/plugin/axios'

export function AccountLogin (data) {
  return service({
    url: '/orders/login.do',
    method: 'post',
    data
  })
}
