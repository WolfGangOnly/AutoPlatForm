<template>
  <div class="detailinfo">
    <el-row type="flex" class="row-firsttitleinfo" justify="center">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-form ref="ruleformtitle" :model="ruleform" status-icon :rules="rules" label-width="95px" style="margin-top: 10px">
            <!-- 给出匹配输入建议，复用原有数据 -->
            <el-form-item label="名称" prop="as_name">
              <!-- <el-input v-model="ruleform.as_name" clearable  style="margin-top: 10px;width: 1450px"></el-input> -->
              <div v-if="modify">{{ruleform.as_name}}</div>
              <el-autocomplete v-else v-model="ruleform.as_name" :fetch-suggestions="querySearch" placeholder="请输入名称" :trigger-on-focus="false" @select="handleSelect" style="margin-top: 10px;width: 80%" readonly="true"></el-autocomplete>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-baseinfo" justify="space-between">
      <el-col :span="6">
        <div>
          <el-form ref="ruleform" :disabled="modify" :model="ruleform" status-icon :rules="rules" label-width="100px">
            <el-form-item label="数据量" prop="ad_expectcount">
              <el-input v-model.number="ruleform.ad_expectcount" placeholder="请输入期望数据量"></el-input>
            </el-form-item>
            <el-form-item label="网点" prop="as_author">
              <el-input v-model="ruleform.as_organ"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-form ref="ruleform1" :disabled="modify" :model="ruleform" label-width="100px">
            <el-form-item label="通道" prop="as_channel">
              <el-select v-model="rulevalue" placeholder="请选择通道">
                <el-option v-for="item in ruleform.as_channel" :key="item.ac_id" :label="item.ac_name" :value="item.ac_id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交易码" prop="as_trancode">
              <el-input v-model="ruleform.as_trancode"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-form ref="ruleform2" :disabled="modify" :model="ruleform" label-width="100px">
            <!--  <el-form-item label="插入中间表">
              <el-switch v-model="ruleform.as_insert"></el-switch>
            </el-form-item> -->
            <el-form-item label="负责人" prop="as_author">
              <el-input v-model="ruleform.as_author" style="width: 150px"></el-input>
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
            <i class="el-icon-tickets el-icon--left" />描述
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-msgtemplate" justify="start" style="width: 100%;padding: 10px;" v-show="true">
      <el-col :span="24">
        <el-input type="textarea" :disabled="modify" :autosize="{ minRows: 6, maxRows: 10}" placeholder="请输入描述信息" v-model="ruleform.as_description"></el-input>
      </el-col>
    </el-row>
    <!-- 报文模板 -->
    <el-row type="flex" class="row-titleinfo" justify="center" v-show="true">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div style="margin-left: 10px;float: left;">
            <i class="el-icon-tickets el-icon--left" />报文模板
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-msgtemplate" justify="start" style="width: 100%;padding: 10px;" v-show="true">
      <el-col :span="24">
        <el-tooltip class="item" effect="dark" content="Tip：Hi，若新建时为只读，则该报文模板引用自你所选" placement="top-start">
        <el-input type="textarea" v-bind:readonly="isReadOnly" :disabled="modify" :autosize="{ minRows: 6, maxRows: 10}" placeholder="请输入报文模板" v-model="ruleform.as_message"></el-input>
      </el-tooltip>
      </el-col>
    </el-row>
    <!-- 查询SQL -->
    <el-row type="flex" class="row-titleinfo" justify="center">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div style="margin-left: 10px;float: left;">
            <i class="iconfont icon--peizhiSQL el-icon--left" />数据源SQL
          </div>
          <el-button @click="addSelectDomain" :disabled="modify" icon="el-icon-plus" size="mini" style="margin-top:12px;float: right;background: #ECF5FF;border-color: #ECF5FF;"></el-button>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-selectsql" justify="start" style="width: 100%;padding: 5px;">
      <el-col :span="24">
        <div>
          <el-form :model="selectSqlForm" :disabled="modify" ref="selectSqlForm" label-width="60px" class="demo-dynamic">
            <el-form-item v-for="(domain, index) in selectSqlForm.domains" :label=" 'SQL' + (index + 1)" :key="domain.key" :prop=" 'domains.' + index + '.value'">
              <el-select v-model="domain.env" placeholder="请选择环境">
                <el-option v-for="item in environment" :key="item.ae_id" :label="item.ae_name" :value="item.ae_id"></el-option>
              </el-select>
              <el-input class="sqlarea" type="textarea" :autosize="{ minRows: 1.34, maxRows: 8}" placeholder="请输入内容" v-model="domain.selectsql"></el-input>
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
            <i class="iconfont icon--peizhiSQL el-icon--left" />查询SQL
          </div>
          <!--  <el-button @click="addDomain" icon="el-icon-plus" style="margin-top:20px;float: right;background: #ECF5FF;border-color: #ECF5FF;"></el-button> -->
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-sql" justify="start" style="width: 100%;padding: 5px;">
      <el-col :span="24">
        <div>
          <el-form :model="checkSqlForm" :disabled="modify" ref="checkSqlForm" label-width="60px" class="demo-dynamic">
            <el-form-item v-for="(domain, index) in checkSqlForm.domains" :label="'SQL' + (index + 1)" :key="domain.key" :prop="'domains.' + index + '.value'">
              <el-select v-model="domain.env" placeholder="请选择环境">
                <el-option v-for="item in environment" :key="item.ae_id" :label="item.ae_name" :value="item.ae_id"></el-option>
              </el-select>
              <el-input class="sqlarea" type="textarea" :autosize="{ minRows: 1.34, maxRows: 8}" placeholder="请输入内容" v-model="domain.checksql"></el-input>
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
            <i class="iconfont icon--peizhiSQL el-icon--left" />执行后操作
          </div>
          <el-button @click="addHandle" icon="el-icon-plus" :disabled="modify" size="mini" style="margin-top:12px;float: right;background: #ECF5FF;border-color: #ECF5FF;"></el-button>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-handle" justify="start" style="width: 100%;padding: 5px;">
      <el-col :span="24">
        <div>
          <el-form :model="handleForm" :disabled="modify" ref="handleForm" label-width="60px" class="demo-dynamic">
            <el-form-item v-for="(domain, index) in handleForm.domains" :label="'操作' + (index + 1)" :key="domain.key" :prop="'domains.' + index + '.value'">
              <!-- <el-select v-model="domain.event" placeholder="请选择操作" style="float: left;margin-right: 5px">
                <el-option v-for="item in action" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select> -->
              <el-cascader expand-trigger="hover" :options="options" v-model="domain.selectedOptions" @change="handleChange"></el-cascader>
              <el-input class="sqlarea" type="textarea" :autosize="{ minRows: 1.34, maxRows: 8}" placeholder="请输入内容" v-model="domain.value"></el-input>
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
  name: 'DetailInfo',
  mounted: function() {

    this.getConfigInfo();
  },
  props: {
    multipleSelection: {
      type: Array,
      required: true,
    }
  },
  // watch:{
  //   messageEmpty:function(value,oldvalue){

  //   }
  // },

  data() {
    return {
      modify: false,
      messageEmpty:true,
      isReadOnly:false,
      dataNames: [], //名称匹配的输入建议



      // action: [{
      //   value: '增删改',
      //   label: '执行SQL'
      // }, {
      //   value: '其他',
      //   label: '其他'
      // }, ],
      // actionvalue: '',

      checkSqlForm: {
        domains: [{
          checksql: '',
          env: '',
        }],

      },
      selectSqlForm: {
        domains: [{
          selectsql: '',
          env: '',
        }],

      },
      //环境
      environment: [],

      //多联级
      options: [{
        value: 'handleSql',
        label: '操作SQL',
        children: [{
          value: 'update',
          label: 'update',
          children: []
        }, {
          value: 'insert',
          label: 'insert',
          children: []
        }]
      }, ],

      handleForm: {
        domains: [{
          selectedOptions: [],
          value: '',
        }],

      },

      // form:[],
      ruleform: {
        as_name: '',
        as_trancode: '',
        as_author: '',
        as_organ: '',
        ad_expectcount: '',
        as_channel: [],
        as_insert: false,
        as_message: '',
        as_description: '',
        as_messageid: '',
      },
      rulevalue: '', //通道值
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
    querySearch(queryString, cb) {
      var dataNames = this.dataNames;
      var results = queryString ? dataNames.filter(this.createFilter(queryString)) : dataNames;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (dataName) => {
        return (dataName.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      let select = [];
      select.push(item);
      this.getSysDetailInfo(select);
      
      this.modify = false;
      this.isReadOnly = true;

    },
    clearDataName(){
      this.dataNames = [];
    },
    loadDataName(val) {
      let data = val;
     
      for (var i = 0; i < data.length; i++) {
        let name = {
          "value" : data[i].as_name,
          "as_no" : data[i].as_no,
          "as_link":data[i].as_link,
          "as_messageid":data[i].as_messageid,
        };
        this.dataNames.push(name);

      }
    },
    //联级下拉框事件
    handleChange(value) {
      console.log(value);
      console.log(this.handleForm.domains);
    },

    //清空、初始化控件
    clearSysInfo() {
      this.$refs.ruleformtitle.resetFields();
      this.$refs.ruleform.resetFields();

      this.rulevalue = '';
      this.ruleform.as_trancode = '';
      this.ruleform.as_author = '';
      this.ruleform.as_organ = '';
      this.ruleform.as_message = '';
      this.ruleform.as_description = '';
      this.ruleform.as_messageid = '';
      this.handleForm.domains = [{
        selectedOptions: [],
        value: '',
      }];
      this.selectSqlForm.domains = [{
        selectsql: '',
        env: '',
      }];
      this.checkSqlForm.domains = [{
        checksql: '',
        env: '',
      }];
      // //this.$refs.ruleform1.resetFields();
      // this.$refs.ruleform2.resetFields();
      // this.$refs.selectSqlForm.resetFields();
      // this.$refs.checkSqlForm.resetFields();
      // this.$refs.handleForm.resetFields();

    },
    //获取配置信息：环境、操作
    getConfigInfo() {
      this.$ajax({
          method: 'get',
          url: 'http://localhost:6062/autotest/searchConfigInfo',
          dataType: "json",
        })
        .then((response) => {
          let env = JSON.parse(response.data.resEnvResult);
          let channel = JSON.parse(response.data.resChannelResult);
          for (var i = 0; i < env.length; i++) {
            let envData = {
              label: env[0].ae_name,
              value: env[0].ae_id,
            };
            this.options[0].children[0].children.push(envData);
            this.options[0].children[1].children.push(envData);
          }
          this.environment = env;
          this.ruleform.as_channel = channel;
        })
        .catch(function(error) {
          //this.loading=false;
          console.log(error);
        });
    },
    changeModifyStatus(val) {
      this.modify = val;
    },
   
    //获取每条数据的详细信息
    getSysDetailInfo(selectdata) {
      this.isReadOnly = false;
      if (selectdata.length === 0) {
        console.log("没有选中记录");
      } else {
        if (!this.modify) {
          this.modify = true;
        }
        this.$ajax({
            method: 'get',
            url: 'http://localhost:6062/autotest/searchSysDetailInfo',
            dataType: "json",
            params: {
              as_no: selectdata[0].as_no,
              as_link: selectdata[0].as_link,
            }

          })
          .then((response) => {

            let status = response.data.resCode;
            if ("success" === status) {
              this.clearSysInfo();
              let data = JSON.parse(response.data.resResult);
              this.ruleform.as_name = data[0].as_name;
              this.ruleform.as_author = data[0].as_author;
              this.ruleform.as_message = data[0].am_message;
              if (data[0].am_message === '') {
                this.$emit('childByValue', true);
              } else {
                this.$emit('childByValue', false);
              }
                
              
              this.rulevalue = data[0].as_channel === 0 ? '' : data[0].as_channel;
              this.ruleform.as_organ = data[0].as_organ;
              this.ruleform.as_trancode = data[0].as_trancode;
              this.ruleform.as_description = data[0].as_description;
              this.ruleform.as_messageid = data[0].as_messageid;
              for (var i = 0; i < data.length; i++) {
                if ("check" === data[i].ad_type) {
                  this.ruleform.ad_expectcount = data[i].ad_expectcount;
                  let sqlData = {
                    checksql: data[i].ad_sql,
                    env: data[i].ad_envno === 0 ? '' : data[i].ad_envno,
                  }
                  if (1 === this.checkSqlForm.domains.length && this.checkSqlForm.domains[0].env === "") {
                    this.checkSqlForm.domains[0] = sqlData;
                  } else {
                    this.checkSqlForm.domains.push(sqlData);
                  }

                } else if ("select" === data[i].ad_type) {
                  let sqlData = {
                    selectsql: data[i].ad_sql,
                    env: data[i].ad_envno === 0 ? '' : data[i].ad_envno,
                  }
                  if (1 === this.selectSqlForm.domains.length && this.selectSqlForm.domains[0].env === "") {
                    this.selectSqlForm.domains[0] = sqlData;
                  } else {
                    this.selectSqlForm.domains.push(sqlData);
                  }
                } else if ("update" === data[i].ad_type) {

                  let sqlData = {
                    selectedOptions: ["handleSql", "update", data[i].ad_envno === 0 ? '' : data[i].ad_envno],
                    value: data[i].ad_sql,
                  }

                  if (1 === this.handleForm.domains.length && this.handleForm.domains[0].value === "") {

                    this.handleForm.domains[0] = sqlData;
                  } else {
                    this.handleForm.domains.push(sqlData);
                  }
                } else if ("insert" === data[i].ad_type) {

                }
              }
            } else {
              this.$message.error('Hi，获取详细信息失败！');
            }

            // this.ruleform.ad_expectcount = resCount;


          })
          .catch((error) => {
            this.$message.error('Hi，' + error);
          });

      }

      
    },
    //修改详细信息
    updateSysDetailInfo(val) {
      this.$refs.ruleformtitle.validate((validtitle) => {

        if (validtitle) {
          this.$refs.ruleform.validate((valid) => {

            if (valid) {
              this.$ajax({
                  method: 'post',
                  url: 'http://localhost:6062/autotest/updateSysInfo',
                  dataType: "json",
                  data: {
                    as_no: val[0].as_no,
                    as_name: this.ruleform.as_name,
                    as_trancode: this.ruleform.as_trancode,
                    as_author: this.ruleform.as_author,
                    as_organ: this.ruleform.as_organ,
                    as_channel: this.rulevalue,
                    ad_expectcount: this.ruleform.ad_expectcount,
                    as_insert: this.ruleform.as_insert,
                    as_link: false,
                    as_message: this.ruleform.as_message,
                    as_messageid: this.ruleform.as_messageid,
                    as_description: this.ruleform.as_description,
                    ad_selectsqls: this.selectSqlForm.domains,
                    ad_checksqls: this.checkSqlForm.domains,
                    handle: this.handleForm.domains,
                  }
                })
                .then((response) => {
                  let status = response.data.resCode;
                  if ('success' === status) {
                    this.$parent.getSysInfo("update");
                  } else {
                    this.$message({
                      message: 'Hi，更新失败！',
                      type: 'error'
                    });
                  }
                  // this.form = response.data;
                  // console.log(response.data);


                })
                .catch((error) => {
                  //this.loading=false;
                  this.$message({
                    message: 'Hi，' + error,
                    type: 'error'
                  });
                  // this.clearSysInfo();
                });
            }
          });
        }
      });

    },
    //保存详细信息
    saveSysDetailInfo(formName) {
      this.$refs.ruleformtitle.validate((validtitle) => {

        if (validtitle) {
          this.$refs.ruleform.validate((valid) => {
            //数据回传给父组件
            //this.$emit('childByValue', this.ruleform);
            if (valid) {
              this.$ajax({
                  method: 'post',
                  url: 'http://localhost:6062/autotest/insertSysInfo',
                  dataType: "json",
                  data: {
                    as_name: this.ruleform.as_name,
                    as_trancode: this.ruleform.as_trancode,
                    as_author: this.ruleform.as_author,
                    as_organ: this.ruleform.as_organ,
                    as_channel: this.rulevalue,
                    ad_expectcount: this.ruleform.ad_expectcount,
                    as_insert: this.ruleform.as_insert,
                    as_link: false,
                    as_messageid: this.ruleform.as_messageid,
                    as_message: this.ruleform.as_message,
                    as_description: this.ruleform.as_description,
                    ad_selectsqls: this.selectSqlForm.domains,
                    ad_checksqls: this.checkSqlForm.domains,
                    handle: this.handleForm.domains,
                  }
                })
                .then((response) => {
                  let status = response.data.resCode;
                  if ('success' === status) {
                    this.$parent.getSysInfo("save");
                    this.clearSysInfo();

                  } else {
                    this.$message({
                      message: 'Hi，保存失败！',
                      type: 'error'
                    });
                  }
                  // this.form = response.data;
                  // console.log(response.data);


                })
                .catch((error) => {
                  //this.loading=false;
                  this.$message({
                    message: 'Hi，' + error,
                    type: 'error'
                  });
                  // this.clearSysInfo();
                });
            } else {
              return false;
            }

          });
        } else {

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
        selectedOptions: [],
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
        env: '',
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
        env: '',
        key: Date.now()
      });
    }
  }

}

</script>
<style scoped>
@import "../../../static/css/detailinfo.css"

</style>
