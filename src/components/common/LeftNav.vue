<template>
  <div class="left-nav" id="left-nav">
    <div class="userinfo">
      <img src="@/assets/logo.jpg"></img>
    </div>
    <!-- <hr class="hr1" />  -->
    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group> -->
    <el-menu :default-active="$route.path" router class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :="isCollapse">
      <el-menu-item index="/">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/AutoMain">
        <i class="el-icon-document"></i>
        <span slot="title">测试数据中心</span>
      </el-menu-item>
      <!--  <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-document"></i>
          <span slot="title">数据管理</span>
        </template> -->
      <!--  <el-menu-item-group> -->
      <!-- <span slot="title">分组一</span> -->
      <!-- <el-menu-item index="2-1">数据管理页</el-menu-item>
          <el-menu-item index="2-2">历史结果页</el-menu-item> -->
      <!-- </el-menu-item-group> -->
      <!-- <el-menu-item-group title="分组2"> -->
      <!-- <el-menu-item index="2-3">选项3</el-menu-item> -->
      <!-- </el-menu-item-group> -->
      <!--  <el-submenu index="2-4">
          <span slot="title">选项4</span>
          <el-menu-item index="2-4-1">选项1</el-menu-item>
        </el-submenu> -->
      <!-- </el-submenu> -->
      <!-- <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item> -->
    </el-menu>
    <div class="runinfo">
      <div class="runinfotitle">
        执行任务
      </div>
      <div class="runinfomain">
        <div class="progerss" style="padding: 5px;height: 10px">
          <li style="float: left;margin-top: 3px">{{progerssName}}</li>
          <el-progress :text-inside="true" :stroke-width="18" :percentage="precent" status="status" v-if="show" style="float: right;width: 66%;margin-top: 3px"></el-progress>
        </div>
        <!--    <li>执行任务二 <el-progress :text-inside="true" :stroke-width="18" :percentage="0"></el-progress></li>
          <li>执行任务三<el-progress :text-inside="true" :stroke-width="18" :percentage="0" color="rgba(142, 113, 199, 0.7)"></el-progress></li>
          <li>执行任务四<el-progress :text-inside="true" :stroke-width="18" :percentage="0" status="success"></el-progress></li>
          <li>执行任务五<el-progress :text-inside="true" :stroke-width="18" :percentage="0" status="exception"></el-progress></li> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  mounted: function() {
   
    this.$root.bus.$on('singlerun', value => {
      this.addRunInfo(value);
    });
  },
  beforeDestroy() {
    this.$root.bus.$off('singlerun');
    
  },
  data() {
    return {
      isCollapse: false,
      precent: 0,
      show: false,
      progerssName: "空闲",
      status:"",
    };
  },
  methods: {
    //增加执行进度
    addRunInfo(runSysNo) {
       console.log(runSysNo);
      this.progerssName = runSysNo;
      this.show = true;
      let i = 0;
      let clock = window.setInterval(() => {
        if (i === 96) {
          this.precent = i;
        } else {
          this.precent = i++ ;
        }
        
        //  this.$ajax({
        //   method: 'post',
        //   url: 'http://localhost:9090/AutoTest/sysInfo/querySysRunStatus',
        //   dataType: "json",
        //   data: {
            
        //   }
        // })
        // .then((response) => {
        //   this.precent = response.data;
          
        // })
        // .catch(function(error) {
        //   //this.loading=false;
        //   console.log(error);
        // });
       
      },50)
      this.$ajax({
          method: 'post',
          url: 'http://localhost:9090/AutoTest/sysInfo/querySysRun',
          dataType: "json",
          data: {
              as_no:runSysNo,
          }
        })
        .then((response) => {

          this.status = "success";
          window.clearInterval(clock);
          this.progerssName =  "空闲";
         
          this.precent = 0;
          this.show = false;
          console.log(response.data);
        })
        .catch(function(error) {
          //this.loading=false;
          console.log(error);
        });

    },

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }

}

</script>
<style scoped>

@import "../../../static/css/leftnav.css"

</style>
