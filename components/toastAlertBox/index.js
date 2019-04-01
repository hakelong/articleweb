import c from './toastAlertBox'
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
    if (!Vue.$toastAlertBox) {
      const $toastAlertBox = {
        /**
         * @param [Object,string] {duration,msg} || msg
         */
        show(o) {
          $vm.show(o)
        },
        hide(o) {
          $vm.hide(o)
        }
      }
      Vue.prototype.$toastAlertBox = $toastAlertBox
    }
  }
}