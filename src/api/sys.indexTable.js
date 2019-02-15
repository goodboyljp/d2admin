import {service} from '@/plugin/axios'

//表格数据
export const IndexTable  = (data) => {
  return service({
    url: '/orders/selectStoreOrder.do',
    method: 'post',
    data
  })
}

//订单详情
export const orderDetails  = (data) => {
  return service({
    url: '/orders/selectOrderDetails.do',
    method: 'post',
    data
  })
}

//打印订单
export const orderPrint  = (data) => {
  return service({
    // url: '/orders/selectOrderDetails.do',
    method: 'post',
    data
  })
}

//订单校验
export const orderCheck  = (data) => {
  return service({
    url: '/orders/selectOrderNoStatus.do',
    method: 'post',
    data
  })
}
//订单已完成
export const updateOrderStatus  = (data) => {
  return service({
    url: '/orders/updateOrderStatus.do',
    method: 'post',
    data
  })
}
