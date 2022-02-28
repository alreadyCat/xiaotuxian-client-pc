// 数据懒加载
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'
export const useLazyData = (target, apiFn) => {
  const result = ref([])

  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      // isIntersecting   是否在可视区域内
      if (isIntersecting) {
        // 停止观测
        stop()
        //  调用api请求数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    { // 配置选项 threshold  相交阈值   0 =>  可视区域与dom元素相交就加载
      threshold: 0
    }
  )
  return result
}

/**
 * 支付倒计时函数
 */
export const usePayTime = () => {
  // 倒计时逻辑
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()
    }
  }, 1000, false)
  onUnmounted(() => {
    pause()
  })

  // 开启定时器 countdown 倒计时时间
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }

  return {
    start,
    timeText
  }
}
