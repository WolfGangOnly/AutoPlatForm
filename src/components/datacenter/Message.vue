<template>
  <div class="message">
    <el-row type="flex" class="row-titleinfo" justify="center">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          xxx数据的报文模板
          <el-button style="" size="small" @click="changeTextType">boom</el-button>
        </div>

      </el-col>
    </el-row>
    <div class="left" style="width: 628px;height: 390px;float: left;overflow:auto;">
      <div class="messageShow" style="margin: 10px;">
        <el-input v-if="xmlTextVisible" type="textarea" :autosize="{ minRows: 17, maxRows: 17}" v-model="textarea3" resize="none"></el-input>
        <div v-else draggable="true" :key="tag" class="el-tag" @dragstart="drag($event)" v-for="tag in dynamicTags" :disable-transitions="false" style=" margin-left: 10px;margin-top: 10px; cursor:pointer;">
          {{tag}}     
        </div>
      </div>
    </div>
    <div class="right" style="width: 960px;height: 380px; float: right; overflow:auto;">
      <div class="messageShow" style="margin: 15px;">
        <el-collapse v-model="activeName" accordion :model="formInline" @change="handleChange">
          <el-collapse-item v-for="(dataMsg, index) in formInline" :key="dataMsg.key" :prop="index" :name="index">
            <template slot="title">
              <el-input size="small" style="width:120px" @blur="handleInputConfirm(dataMsg)" placeholder="请输入标题" v-if="dataMsg.inputVisible" v-model="dataMsg.title" ref="inputTitle">
              </el-input>
              <el-tag v-else :key="dataMsg.title" :disable-transitions="true" closable @close="handleClose(dataMsg,1)">{{dataMsg.title}}</el-tag>
            </template>
            <el-form :inline="true" class="demo-form-inline">
              <div  @drop="drop($event)" @dragover="allowDrop($event)">
                 <el-form-item v-for="(domain, index) in dataMsg.domains" :key="domain.key" :prop="'domains.' + index + '.value'" style="margin-bottom: 0px">
                <el-tag :key="domain.label" closable :disable-transitions="true" @close="handleClose(domain,2)">
                  {{domain.label}}
                </el-tag>
                <el-input v-model="domain.desc" size="small" style="width: 100px" placeholder="备注"></el-input>
                <el-input v-model="domain.value" size="small" style="width: 120px" placeholder="参数"></el-input>
              </el-form-item>
               <el-input class="input-new-tag" v-if="newinputVisible" v-model="newinputValue" ref="newTagInput" size="small" @blur="handleNewInputConfirm('newTagInput')" style="width:120px;margin-top: 5px;">
              </el-input>
              <el-button v-else style="margin-top: 5px;" class="button-new-tag" size="small" @click="showInput('newTagInput')">+ New Tag</el-button>
              </div>
             
             
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <el-input class="input-new-tag" v-if="newinputDataVisible" v-model="newinputDataValue" ref="newDataInput" size="small" @blur="handleNewInputConfirm('newDataInput')" style="width:120px;margin-top:5px">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput('newDataInput')" style="margin-top:5px">+ New Data</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  let dom = null;
export default {
  name: 'Message',
  ready: function() {},
  mounted: function() {



  },
  props: {

  },
  data() {
    return {
      dynamicTags: ['标签1','标签2','标签3','标签4','标签5','标签6','标签7','标签8','标签9','标签10','标签11','标签12','标签13','标签14','标签15','标签16','标签17','标签18','标签19',],
      inputValue: '',
      newinputDataValue: '',
      newinputDataVisible: false,
      newinputValue: '',
      newinputVisible: false,

      xmlTextVisible:true,
      textarea3: '<?xml version="1.0" encoding="UTF-8"?><shiporder><orderperson>George Bush</orderperson><shipto><name>Johndams</name><address>Oxford Street</address><city>London</city><country>UK</country><name1>123456</name1><name2>12345678</name2></shipto><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder>',
      activeName: '1',

      formInline: [{
        title: '数据1',
        inputVisible: false,
        domains: [{
          label: '//node1//node2',
          desc: '',
          value: ''
        }, {
          label: '//node1//node2//',
          desc: '',
          value: ''
        }, {
          label: '//node1//node2//node3//node4//node5//node6',
          desc: '',
          value: ''
        }, {
          label: '参数4',
          desc: '',
          value: ''
        }]
      }, {
        title: '数据2',
        inputVisible: false,
        domains: [{
          label: '//node1//node2',
          desc: '金额',
          value: ''
        }, {
          label: '//node1//node2//',
          desc: '',
          value: ''
        }, {
          label: '//node1//node2//node3//node4//node5//node6',
          desc: '',
          value: ''
        }, {
          label: '参数4',
          desc: '',
          value: ''
        }]
      }],
      //存放结构
      formInlineTemp: [],
      
    }
  },
  methods: {
    //切换xml形态
    changeTextType() {
      if (this.xmlTextVisible) {
        this.xmlTextVisible = false;
      } else {
        this.xmlTextVisible = true;
      }
    },
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
    handleClose(val, index) {
      if (index === 1) {
        this.formInline.splice(this.formInline.indexOf(val), 1);
      } else {
        this.formInline[this.activeName].domains.splice(this.formInline[this.activeName].domains.indexOf(val), 1);
      }

    },
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
<style>
.row-titleinfo {
  padding: 10px 0;
  /*background-color: #f9fafc;*/
  height: 80px;
  width: 99%;
  margin: auto;
}

.bg-purple-dark {
  background: #ECF5FF;
}

.grid-content {
  border-radius: 6px;
  min-height: 100%;
}

</style>
