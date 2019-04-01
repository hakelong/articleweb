<template>
    <iframe class='agreement' :src="toAgreementUrl" frameborder="0"></iframe>
    <!-- <div>aaaaaa</div> -->

</template>
<script>
import {hrefUrls} from '~/api/urls'
export default {
    data(){
        return {
            toAgreementUrl:hrefUrls.toAgreementUrl
        }
    },
    mounted(){
        
    }
}
</script>
<style lang="scss" scoped>
    .agreement{
        width: 100%;
        height: 100%;
    }
</style>

