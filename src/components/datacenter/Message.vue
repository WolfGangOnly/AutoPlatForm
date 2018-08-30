<template>
  <div class="message">
    <el-row type="flex" class="row-titleinfo" justify="center">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          {{title}}
          <el-button style="" size="small" @click="changeTextType">change</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="footer">
      <div class="left">
        <div class="messageShow" style="margin: 10px;">
          <el-input :disabled="modify" v-if="xmlTextVisible" class="xmltextarea" type="textarea" v-model="textarea" resize="none"></el-input>
          <div v-else draggable="true" :key="tag" class="el-tag" @dragstart="drag($event)" v-for="tag in dynamicTags" :disable-transitions="false" style=" margin-left: 10px;margin-top: 10px; cursor:pointer;">
            {{tag}}
          </div>
        </div>
      </div>
      <div class="right">
        <div class="messageShow" style="margin: 15px;">
          <el-collapse v-model="activeName" accordion :model="formInline" @change="handleChange">
            <el-collapse-item v-for="(dataMsg, index) in formInline" :key="dataMsg.key" :prop="index" :name="index">
              <template slot="title">
                <el-input size="small" style="width:120px" @blur="handleInputConfirm(dataMsg)" placeholder="请输入标题" v-if="dataMsg.inputVisible" v-model="dataMsg.title" ref="inputTitle">
                </el-input>
                <el-tag v-else :key="dataMsg.title" :disable-transitions="true" closable @close="handleClose(dataMsg,1)">{{dataMsg.title}}</el-tag>
              </template>
              <el-form :inline="true" class="demo-form-inline">
                <div @drop="drop($event)" @dragover="allowDrop($event)">
                  <el-form-item v-for="(domain, index) in dataMsg.domains" :key="domain.key" :prop="'domains.' + index + '.value'" style="margin-bottom: 0px">
                    <el-tag :key="domain.label" closable :disable-transitions="true" @close="handleClose(domain,2)">
                      {{domain.label}}
                    </el-tag>
                    <el-input :disabled="modify" v-model="domain.desc" size="small" style="width: 100px" placeholder="备注"></el-input>
                    <el-input :disabled="modify" v-model="domain.value" size="small" style="width: 120px" placeholder="参数"></el-input>
                  </el-form-item>
                  <el-input :disabled="modify" class="input-new-tag" v-if="newinputVisible" v-model="newinputValue" ref="newTagInput" size="small" @blur="handleNewInputConfirm('newTagInput')" style="width:120px;margin-top: 5px;">
                  </el-input>
                  <el-button :disabled="modify" v-else style="margin-top: 5px;" class="button-new-tag" size="small" @click="showInput('newTagInput')">+ New Tag</el-button>
                </div>
              </el-form>
            </el-collapse-item>
          </el-collapse>
          <el-input class="input-new-tag" v-if="newinputDataVisible" v-model="newinputDataValue" ref="newDataInput" size="small" @blur="handleNewInputConfirm('newDataInput')" style="width:120px;margin-top:5px">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput('newDataInput')" style="margin-top:5px" disabled>+ New Data</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let dom = null;
export default {
  name: 'Message',
  mounted: function() {

    // this.xmlParser();

  },
  props: {
    multipleSelection: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      title:'',
      modify:true,
      dynamicTags: [],
      inputValue: '',
      newinputDataValue: '',
      newinputDataVisible: false,
      newinputValue: '',
      newinputVisible: false,

      xmlTextVisible: true,
      textarea: '',
      activeName: '1',

      formInline: [],
      //存放结构
      formInlineTemp: [{
        title: '',
        inputVisible: false,
        domains: []
      }, ],
      //新增需要保存的数据
      formInlineSave: [],

    }
  },
  methods: {
    changeModifyStatus(val) {
      this.modify = val;
    },
    //解析xml
    xmlParser() {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(this.textarea, "text/xml");

      var field = xmlDoc.getElementsByTagName('field');
      var tags = [];

      for (var i = 0; i < field.length; i++) {
        let newData = {
          label: '',
          desc: '',
          value: ''
        };
        newData.label = field[i].getAttribute("name");
        tags.push(newData);

      };
      return tags;
    },
    //获取数据信息
    getData(val) {
      this.title = val[0].as_name;
      this.$ajax({
          method: 'get',
          url: 'http://localhost:6062/autotest/getData',
          dataType: "json",
          params: {
            as_no: val[0].as_no,
          },
        })
        .then((response) => {
          let status = response.data.resCode;
          let msg = response.data.resMsg;

          if ('success' === status) {
            let jsonData = JSON.parse(response.data.resResult);
            let message = jsonData.message;
            let data = JSON.parse(jsonData.data);
            this.formInline = data;
            this.textarea = message;
            for (var i = 0; i < data.length; i++) {

              if (data[i].domains.length === 0) {
                data[i].domains = this.xmlParser();

              } else {}
            }


          } else {

          }
        })
        .catch((error) => {
          this.$message.error('Hi，' + error);
        });
    },
    //保存数据
    saveData(val) {

      let data = {
        as_no: val[0].as_no,
        as_messageid: val[0].as_messageid,
        message: this.textarea,
        data: this.formInline,
      };
      this.$ajax({
          method: 'post',
          url: 'http://localhost:6062/autotest/insertData',
          dataType: "json",
          data: data,
        })
        .then((response) => {
          let status = response.data.resCode;
          let msg = response.data.resMsg;
          if ('success' === status) {
            
            this.$parent.clickDataRow(val[0]);
           

          } else {
            this.$message.error('Hi，保存失败！');
          }
        })
        .catch((error) => {
          this.$message.error('Hi，' + error);
        });
    },

    //切换xml形态
    changeTextType() {
      if (this.xmlTextVisible) {
        this.xmlTextVisible = false;
      } else {
        this.xmlTextVisible = true;
      }
    },
    //拖拽效果
    drag: function(event) {
      this.newinputValue = event.target.innerText;
      dom = event.currentTarget
    },
    drop: function(event) {
      event.preventDefault();

      //event.target.appendChild(dom);
      this.handleNewInputConfirm("newTagInput");

    },
    allowDrop: function(event) {
      event.preventDefault();

    },
    //关闭标签
    handleClose(val, index) {
      if (index === 1) {
        this.formInline.splice(this.formInline.indexOf(val), 1);
      } else {
        this.formInline[this.activeName].domains.splice(this.formInline[this.activeName].domains.indexOf(val), 1);
      }

    },
    //标签可输入
    handleChange(val) {
      if (val !== '') {

        for (var i = this.formInline.length - 1; i >= 0; i--) {
          if (this.formInline[i].inputVisible) {
            this.formInline[i].inputVisible = false;
          }
        }
        this.formInline[val].inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.inputTitle[0].$refs.input.focus();
        });

      }


    },
    showInput(val) {
      if (val === 'newTagInput') {
        this.newinputVisible = true;
        this.$nextTick(_ => {
          this.$refs.newTagInput[this.activeName].$refs.input.focus();
        });
      } else {
        this.newinputDataVisible = true;
        this.$nextTick(_ => {
          this.$refs.newDataInput.$refs.input.focus();
        });
      }
    },
    handleInputConfirm(val) {
      //let inputValue1 = this.$refs.saveTagInput.value;
      // if (inputValue) {
      //   this.dynamicTags.push(inputValue);
      // }
      console.log(val);
      val.inputVisible = false;
      //val.title = 'dsad';
    },
    handleNewInputConfirm(val) {
      //新增一个参数
      if (val === 'newTagInput') {
        console.log(this.newinputValue);
        let inputValue = this.newinputValue;
        if (inputValue) {
          let newData = {
            label: inputValue,
            desc: '',
            value: ''
          }
          this.formInline[this.activeName].domains.push(newData);
        }
        this.newinputValue = '';
        this.newinputVisible = false;
      }
      //新增一组数据 
      else {
        let data = this.formInline.dataMsgs[0];
        this.formInline.dataMsgs.push(data);
        this.newinputDataVisible = false;
      }


    },
  }

}

</script>
<style scoped>
@import "../../../static/css/message.css"

</style>
<style type="text/css">
.el-textarea__inner {
  height: 222px;
}

@media screen and (max-width: 1366px) {

  .el-textarea__inner {
    height: 175px;
  }
}

</style>
