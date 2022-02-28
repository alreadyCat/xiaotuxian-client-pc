import defaultImg from '@/assets/images/200.png'
// import xtxSkeleton from '@/components/library/xtx-skeleton'
// import xtxCarousel from '@/components/library/xtx-carousel'
// import xtxMore from '@/components/library/xtx-more'
// import xtxBread from '@/views/category/components/xtx-bread'
// import xtxBreadItem from '@/components/library/xtx-bread-item'
import Message from '@/components/library/Message'
import Confirm from './Confirm'
const importFn = require.context('./', false, /\.vue$/)

// 挂载全局的属性，能够通过组件实例调用的属性   this.$message
//  app.config.globalProperties.$message = Message// 原型函数
export default {
  install (app) {
    // app.component(xtxSkeleton.name, xtxSkeleton)
    // app.component(xtxCarousel.name, xtxCarousel)
    // app.component(xtxMore.name, xtxMore)
    // app.component(xtxBread.name, xtxBread)
    // app.component(xtxBreadItem.name, xtxBreadItem)
    importFn.keys().forEach(path => {
      // 导入组件
      const component = importFn(path).default
      // 注册组件
      app.component(component.name, component)
      app.config.globalProperties.$message = Message
      app.config.globalProperties.$confirm = Confirm
    })
    defineDirective(app)
  }
}

// 指令
const defineDirective = (app) => {
  // 图片懒加载指令
  app.directive('lazyload', {
    mounted (el, binding) {
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 图片进入视口停止监听
          observer.unobserve(el)

          // 图片加载失败出发onerror时间，加载默认图片
          el.onerror = () => {
            el.src = defaultImg
          }

          // 在img上挂上绑定的src属性
          el.src = binding.value
        }
      }, {
        threshold: 0.01
      })
      observer.observe(el)
    }
  })
}
