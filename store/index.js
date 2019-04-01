import axios from 'axios'
export const state=()=>{
    return {
        bankListShowSwitch:'',
        textConfigText:'',
        textConfigTitle:'',
        pkEncryptSwitch:''
    }
}
export const mutations={
    toggleBankListShow:(state,value)=>{
        state.bankListShowSwitch=value
    },
    setTextConfigText:(state,value)=>{
        state.textConfigText=value
    },
    setTextConfigTitle(state,value){
        state.textConfigTitle=value
    },
    setPkEncryptSwitch(state,value){
        state.pkEncryptSwitch=value
    },

}
export const actions={
    nuxtServerInit ({commit},ctx){
        commit('toggleBankListShow','1')
        commit('setTextConfigText','texttext')
        commit('setTextConfigTitle','titletitle')
        commit('setPkEncryptSwitch','0')
    }
}