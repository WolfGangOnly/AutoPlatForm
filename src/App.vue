<template>
  <div id="app">
    <el-container>
      <el-aside id="aside">
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
import LeftNav from '@/components/common/LeftNav'
export default {
  name: 'App',
  components: {
    LeftNav
  },
  mounted: function() {
   
  },
  methods: {
   
  },
}

</script>
<style scoped>
@import "../static/css/app.css"
</style>
