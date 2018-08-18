<template>
  <div id="app">
    <el-container>
      <el-aside width="320px">
        <LeftNav></LeftNav>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import LeftNav from '@/components/datacenter/LeftNav'
export default {
  name: 'App',
  components: {
    LeftNav
  }
}

</script>
<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #000000;
  height: 100%;
}

.el-main {
  padding: 0px;
}


</style>
