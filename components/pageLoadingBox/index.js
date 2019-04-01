// created by QianXuefeng on 2018/03/20
import c from './pageLoadingBox'
let $vm
export default {
  install(Vue, options) {
    Vue.component(c.name, c)
    if (!$vm) {
      const p = Vue.extend(c)
      $vm = new p({
        el: document.createElement('div')
      })
      document.body.appendChild($vm.$el)
    }
    if (!Vue.$pageLoadingBox) {
      const $pageLoadingBox = {
        /**
         * @param [Object,string] {duration,msg} || msg
         */
        show() {
          $vm.show()
        },
        hide() {
          $vm.hide()
        }
      }
      Vue.prototype.$pageLoadingBox = $pageLoadingBox
    }
  }
}