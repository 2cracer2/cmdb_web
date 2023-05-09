<template>
  
</template>

<script>
import { activateUser } from '@/api/user'

export default {
    data() {
        return {
            code: ''
        }
    },
    mounted() {
        this.code = this.$route.query.code;
        console.log(this.code)
        activateUser(this.code).then(response => {
            console.log(response)
            this.$router.push('/login')
        })
    },
}
</script>

<style>

</style>