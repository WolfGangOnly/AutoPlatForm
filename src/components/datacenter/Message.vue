<template>
  <div class="message">
    <el-row type="flex" class="row-titleinfo" justify="center">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          xxx数据的报文模板
        </div>
      </el-col>
    </el-row>
    <div class="left" style="width: 38%;float: left;">
      <div class="messageShow" style="margin: 10px">
        <el-input type="textarea" :autosize="{ minRows: 17, maxRows: 17}" v-model="textarea3" resize="none"></el-input>
      </div>
    </div>
    <div class="right" style="width: 60%;height: 80%; float: right; overflow:auto;">
      <div class="messageShow" style="margin: 15px;">
        <el-collapse v-model="activeNames" @change="handleChange" accordion :model="formInline">
          <el-collapse-item v-for="(dataMsg, index) in formInline.dataMsgs" :key="dataMsg.key" :prop="'dataMsg.' + index + '.title'">
            <template slot="title">
              <el-input style="width: 200px" placeholder="请输入标题" class="input-new-tag" v-if="dataMsg.inputVisible" v-model="dataMsg.title" ref="saveTagInput" @keyup.enter.native="handleInputConfirm(dataMsg)" @blur="handleInputConfirm(dataMsg)" enable>
              </el-input>
              <el-button v-else class="button-new-tag" @click="showInput(dataMsg)" style="width: 200px">{{dataMsg.title}}</el-button>
              <el-button type="danger" slot="reference" size="mini" icon="el-icon-delete" circle style="margin-left: 72%"></el-button>
            </template>
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item v-for="(domain, index) in dataMsg.domains" :label="domain.label" :key="domain.key" :prop="'domains.' + index + '.value'" style="margin-left: 20px;margin-bottom: 10px">
                <el-input v-model="domain.desc" size="small" style="width: 120px" placeholder="备注"></el-input>
                <el-input v-model="domain.value" size="small" style="width: 120px" placeholder="参数"></el-input>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Message',
  mounted: function() {



  },
  props: {

  },
  data() {
    return {
      
      inputValue: '',
      textarea3: '<?xml version="1.0" encoding="ISO-8859-1"?><shiporder><orderperson>George Bush</orderperson><shipto><name>Johndams</name><address>Oxford Street</address><city>London</city><country>UK</country><name1>123456</name1><name2>12345678</name2></shipto><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder>',
      activeNames: ['1'],
      formInline: {
        dataMsgs: [{
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
        },{
          title: '数据2',
          inputVisible: true,
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
        }]


      },

    }
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
    showInput(val) {
        val.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
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
