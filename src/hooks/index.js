// 数据懒加载
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
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
