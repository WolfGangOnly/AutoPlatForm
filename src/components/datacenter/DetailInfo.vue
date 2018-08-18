<template>
  <div class="detailinfo">
    <el-row type="flex" class="row-titleinfo" justify="center">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
            <el-form ref="ruleformtitle" :model="ruleform" status-icon :rules="rules" label-width="100px">
              <el-form-item label="名称" prop="as_name" style="margin-bottom: 0px">
                <el-input v-model="ruleform.as_name" clearable></el-input>
              </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-baseinfo" justify="space-between">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-form ref="ruleform" :model="ruleform" status-icon :rules="rules" label-width="100px">
            <el-form-item label="数据量" prop="ad_expectcount">
              <el-input v-model.number="ruleform.ad_expectcount"  placeholder="请输入期望数据量"></el-input>
            </el-form-item>
            <el-form-item label="交易码" prop="as_trancode">
              <el-input v-model="ruleform.as_trancode"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-form ref="ruleform1" :model="ruleform" label-width="100px">
            <el-form-item label="通道" prop="as_channel">
              <el-select v-model="rulevalue" placeholder="请选择通道">
                <el-option v-for="item in ruleform.as_channel" :key="item.ac_id" :label="item.ac_name" :value="item.ac_id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="负责人" prop="as_author">
              <el-input v-model="ruleform.as_author"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-form ref="ruleform2" :model="ruleform" label-width="100px">
            <el-form-item label="插入中间表">
              <el-switch v-model="ruleform.as_insert"></el-switch>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <!-- 描述 -->
    <el-row type="flex" class="row-titleinfo" justify="center" v-show="true">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div style="margin-left: 10px;float: left;">
            <h4><i class="el-icon-tickets el-icon--left"/>描述</h4>
          </div>
         
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-msgtemplate" justify="start" style="width: 100%;padding: 10px;" v-show="true">
      <el-col :span="24">
        <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 16}" placeholder="请输入描述信息" v-model="ruleform.as_description"></el-input>

      </el-col>
    </el-row>


    <!-- 报文模板 -->
    <el-row type="flex" class="row-titleinfo" justify="center" v-show="true">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div style="margin-left: 10px;float: left;">
            <h4><i class="el-icon-tickets el-icon--left"/>报文模板</h4>
          </div>
         
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-msgtemplate" justify="start" style="width: 100%;padding: 10px;" v-show="true">
      <el-col :span="24">
        <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 16}" placeholder="请输入报文模板" v-model="ruleform.as_message"></el-input>

      </el-col>
    </el-row>

    <!-- 查询SQL -->
    <el-row type="flex" class="row-titleinfo" justify="center">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div style="margin-left: 10px;float: left;text-align: center;">
            <h4><i class="iconfont icon--peizhiSQL el-icon--left"/>数据源SQL</h4>
          </div>
          <el-button @click="addSelectDomain" icon="el-icon-plus" style="margin-top:15px;float: right;background: #ECF5FF;border-color: #ECF5FF;"></el-button>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-selectsql" justify="start" style="width: 100%;padding: 5px;">
      <el-col :span="24">
        <div class="grid-content bg-purple" style="height: 42px">
          <el-form :model="selectSqlForm" ref="selectSqlForm" label-width="95px" class="demo-dynamic">
            <el-form-item v-for="(domain, index) in selectSqlForm.domains" :label=" 'SQL' + (index + 1)" :key="domain.key" :prop=" 'domains.' + index + '.value'">
              <el-select v-model="domain.env" placeholder="请选择环境" style="float: left;margin-right: 5px">
                <el-option v-for="item in environment" :key="item.ae_id" :label="item.ae_name" :value="item.ae_id"></el-option>
              </el-select>
              <el-input  type="textarea" :autosize="{ minRows: 1.34, maxRows: 8}"  placeholder="请输入内容"  v-model="domain.selectsql" style="width: 82%"></el-input>
              <!-- <el-input v-model="domain.value" style="width: 66%"></el-input> -->
              <el-button @click.prevent="removeSelectDomain(domain)" icon="el-icon-minus" type="danger" plain style="float: right;margin-right: 5px"></el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-titleinfo" justify="center">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div style="margin-left: 10px;float: left;">
            <h4><i class="iconfont icon--peizhiSQL el-icon--left"/>查询SQL</h4>
          </div>
         <!--  <el-button @click="addDomain" icon="el-icon-plus" style="margin-top:20px;float: right;background: #ECF5FF;border-color: #ECF5FF;"></el-button> -->
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-sql" justify="start" style="width: 100%;padding: 5px;">
      <el-col :span="24">
        <div class="grid-content bg-purple" style="height: 42px">
          <el-form :model="checkSqlForm" ref="checkSqlForm" label-width="95px" class="demo-dynamic">
            <el-form-item v-for="(domain, index) in checkSqlForm.domains" :label="'SQL' + (index + 1)" :key="domain.key" :prop="'domains.' + index + '.value'">
              <el-select v-model="domain.env" placeholder="请选择环境" style="float: left;margin-right: 5px">
                <el-option v-for="item in environment" :key="item.ae_id" :label="item.ae_name" :value="item.ae_id"></el-option>
              </el-select>
              <el-input  type="textarea" :autosize="{ minRows: 1.34, maxRows: 8}"  placeholder="请输入内容"  v-model="domain.checksql" style="width: 82%"></el-input>
              <!-- <el-input v-model="domain.value" style="width: 66%"></el-input> -->
              <!-- <el-button @click.prevent="removeDomain(domain)" icon="el-icon-minus" type="danger" plain style="float: right;margin-right: 5px"></el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <!-- 执行后操作 -->
    <el-row type="flex" class="row-titleinfo" justify="center">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div style="margin-left: 10px;float: left;">
            <h4><i class="iconfont icon--peizhiSQL el-icon--left"/>执行后操作</h4>
          </div>
          <el-button @click="addHandle" icon="el-icon-plus" style="margin-top:20px;float: right;background: #ECF5FF;border-color: #ECF5FF;"></el-button>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-handle" justify="start" style="width: 100%;padding: 5px;">
      <el-col :span="24">
        <div class="grid-content bg-purple" style="height: 42px">
           <el-form :model="handleForm" ref="handleForm" label-width="95px" class="demo-dynamic">
            <el-form-item v-for="(domain, index) in handleForm.domains" :label="'操作' + (index + 1)" :key="domain.key" :prop="'domains.' + index + '.value'">
              <!-- <el-select v-model="domain.event" placeholder="请选择操作" style="float: left;margin-right: 5px">
                <el-option v-for="item in action" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select> -->
              <el-cascader expand-trigger="hover" :options="options" v-model="selectedOptions" @change="handleChange"></el-cascader>

              <el-input  type="textarea" :autosize="{ minRows: 1.34, maxRows: 8}"  placeholder="请输入内容"  v-model="domain.value" style="width: 76%"></el-input>
              <!-- <el-input v-model="domain.value" style="width: 66%"></el-input> -->
              <el-button @click.prevent="removeHandle(domain)" icon="el-icon-minus" type="danger" plain style="float: right;margin-right: 5px"></el-button>
            </el-form-item>
          </el-form>







        <!--   <el-select v-model="actionvalue" placeholder="请选择" style="width: 80%;float: right;">
            <el-option v-for="item in action" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select> -->
         
        </div>
      </el-col>
       
    <!--   <el-col :span="20">
        <el-input style="width: 66%"></el-input>
      </el-col> -->
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'Detailinfo',
  mounted: function() {
    
    this.clearSysInfo();
    this.getSysChannelInfo();
    this.getSysEnvInfo();
    this.getSysDetailInfo(this.multipleSelection);
   
  },
  props: {
    multipleSelection: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {


      action: [{
          value: '增删改',
          label: '执行SQL'
        }, {
          value: '其他',
          label: '其他'
        },],
        actionvalue: '',
      handleForm: {
        domains: [{
          event:'',
          value: '',
        }],

      },
      checkSqlForm: {
        domains: [{
          checksql: '',
          env:'',
        }],

      },
      selectSqlForm: {
        domains: [{
          selectsql: '',
          env:'',
        }],
       
      },
      //环境
      environment: [],

      //多联级
      options: [{
          value: 'caozuosql',
          label: '操作SQL',
          children: [{
            value: 'update',
            label: 'update',
            children: [{
              value: '248DB',
              label: '248DB'
            }, {
              value: 'ecif',
              label: 'ECIF'
            },]
          }, {
            value: 'insert',
            label: 'insert',
            children: [{
              value: '248DB',
              label: '248DB'
            },]
          }]
        }, ],
      selectedOptions: [],
      // form:[],
      ruleform: {
        as_name: '',
        as_trancode:'',
        as_author: '',
        ad_expectcount: '',
        as_channel: [],
        as_insert: false,
        as_message:'',
        as_description:'',
        
      },
      rulevalue: '',//通道值
      rules: {
        as_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],

        ad_expectcount: [
          { required: true, message: '请输入期望数据量', trigger: 'blur' },
          { type: 'number', message: '数据量必须为数字值' },
        ],

      },
    }
  },
  methods: {

    //联级下拉框事件
    handleChange(value) {
        console.log(value);
    },

    //清空、初始化控件
    clearSysInfo() {
        this.$refs.ruleform.resetFields();
        this.rulevalue = '';
        // //this.$refs.ruleform1.resetFields();
        // this.$refs.ruleform2.resetFields();
        // this.$refs.selectSqlForm.resetFields();
        // this.$refs.checkSqlForm.resetFields();
        // this.$refs.handleForm.resetFields();
        
    },


    //获取环境信息
    getSysEnvInfo() {
      this.$ajax({
          method: 'get',
          url: 'http://localhost:6062/autotest/searchEnvInfo',
          dataType: "json",
        })
        .then((response) => {
         
          this.environment = JSON.parse(response.data.resResult);
          console.log(this.environment);
        })
        .catch(function(error) {
          //this.loading=false;
          console.log(error);
        });
    },



    //获取通道信息
    getSysChannelInfo() {
      this.$ajax({
          method: 'get',
          url: 'http://localhost:6062/autotest/searchChannelInfo',
          dataType: "json",
        })
        .then((response) => {
         
          this.ruleform.as_channel = JSON.parse(response.data.resResult);

        })
        .catch(function(error) {
          //this.loading=false;
          console.log(error);
        });
    },
    //获取每条数据的详细信息
    getSysDetailInfo(selectdata) {

      if (selectdata.length === 0) {
        console.log("没有选中记录");
      } else {
        console.log("刷新");
        this.$ajax({
            method: 'get',
            url: 'http://localhost:6062/autotest/searchSysDetailInfo',
            dataType: "json",
            data: {
              as_no: selectdata[0].as_no,
              as_link:selectdata[0].as_link,
            }
          })
          .then((response) => {

            let resName = selectdata[0].as_name;
            let resUser = selectdata[0].as_author;

            let resCount = response.data.ad_expectcount;
            this.ruleform.as_name = resName;
            this.ruleform.as_author = resUser;
            this.ruleform.ad_expectcount = resCount;
            

          })
          .catch((error) => {
            console.log(error);
          });
      }

    },
    //保存详细信息
    saveSysDetailInfo(formName) {
      this.$refs.ruleform.validate((valid) => {
       


        if (valid) {
          //数据回传给父组件
          //this.$emit('childByValue', this.ruleform);
            this.$ajax({
              method: 'post',
              url: 'http://localhost:6062/autotest/insertSysInfo1',
              dataType: "json",
              data: {
                  as_name:this.ruleform.as_name,
                  as_trancode:this.ruleform.as_trancode,
                  ad_expectcount:this.ruleform.ad_expectcount,
                  as_author:this.ruleform.as_author,
                  as_channel:this.rulevalue,
                  as_insert:this.ruleform.as_insert,
                  as_link:false,
                  as_message:this.ruleform.as_message,
                  as_description:this.ruleform.as_description,
                  ad_selectsqls:this.selectSqlForm.domains,
                  ad_checksqls:this.checkSqlForm.domains,

              }
            })
            .then((response) => {

              this.$parent.getSysInfo();
              this.clearSysInfo();
              this.$message({
                message: 'Hi，保存成功！',
                type: 'success'
              });
              // this.form = response.data;
              // console.log(response.data);
             

            })
            .catch((error) => {
              //this.loading=false;
               this.$message({
                message: 'Hi，保存失败！',
                type: 'error'
              });
              console.log(error);
              this.clearSysInfo();
            });
        } else {
          console.log('必填项未填！');
          return false;
        }
      });

    },
    //执行后操作
    removeHandle(item) {
      var index = this.handleForm.domains.indexOf(item)
      if (index !== -1) {
        this.handleForm.domains.splice(index, 1)
      }
    },
    addHandle() {
      this.handleForm.domains.push({
        value: '',
        env:'',
        key: Date.now()
      });
    },
    //增加、删除SQL条数
    removeSelectDomain(item) {
      var index = this.selectSqlForm.domains.indexOf(item)
      if (index !== -1) {
        this.selectSqlForm.domains.splice(index, 1)
      }
    },
    addSelectDomain() {
      this.selectSqlForm.domains.push({
        value: '',
        env:'',
        key: Date.now()
      });
    },
    removeDomain(item) {
      var index = this.checkSqlForm.domains.indexOf(item)
      if (index !== -1) {
        this.checkSqlForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.checkSqlForm.domains.push({
        value: '',
        env:'',
        key: Date.now()
      });
    }
  }

}

</script>
<style>
.row-baseinfo {
  padding: 5px 0;
  /*background-color: #f9fafc;*/
  min-height: 200px;
  width: 100%;
  margin: auto;
}



.iconfont {
  font-size: 1em;
}


.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
  background: #409EFF;
  border-color: #409EFF;
  color: #fff
}

.el-button--info.is-plain:active {
  background: #409EFF;
  border-color: #409EFF;
  color: #fff;
  outline: 0;
}

.el-button-group {
  margin-top: 9px;
  margin-left: 50px;
  float: left;
}

.el-select {
  width: 130px;
}

.el-input {
  width: 100%;
}

.input-with-select {
  /*background-color: #fff;*/
  margin-top: 9px;
  /*padding: 10px;*/
}

.el-input-group__prepend {
  /*background-color: #fff;*/
  /*margin-top: 9px;*/
  /*padding: 10px;*/
}

.AutoMain {
  height: 100%;
  width: 100%;
}

.el-row {
  margin-bottom: 0px;
  &:last-child {
    margin-bottom: 0;
  }
}

.row-header {
  padding: 0px 0;
  background-color: #f9fafc;
  min-height: 13.4%;
}

.row-footer {
  padding: 0px 0;
  background-color: #f9fafc;
  min-height: 11%;
}

.row-titleinfo {
  padding: 10px 0;
  /*background-color: #f9fafc;*/
  height: 80px;
  width: 99%;
  margin: auto;
}

.el-col {
  border-radius: 6px;
}

.bg-purple-dark {
  background: #ECF5FF;
}

.grid-content {
  border-radius: 6px;
  min-height: 100%;
}

.mainheader {
  float: left;
  width: 100%;
  /*background-color: #B7B7B7;*/
  overflow: auto;
  /*border-bottom: solid 1px #e6e6e6;*/
}

.mainfooter {
  float: left;
  width: 100%;
  /*background-color: #B7B7B7;*/
  overflow: auto;
}

.detail {
  width: 100%;
  height: 89%;
  float: left;
  /*background-color: #B7B7B7;*/
  overflow: auto;
}

</style>
