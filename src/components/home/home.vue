<template>
    <h1>home</h1>
</template>

<script>
    export default {
      created(){
        console.log(localStorage.getItem('token'))
      }
    }
</script>

<style>
    
</style>
