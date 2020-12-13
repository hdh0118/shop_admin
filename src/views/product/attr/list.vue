<template>
  <div>
    <category @change="getAttrList" :disabled="!isShowList" />

    <el-card v-show="isShowList" style="margin-top: 20px">
      <el-button type="primary" class="el-icon-plus">添加属性</el-button>
      <el-table :data="attrList" border style="width: 100%; margin: 20px 0">
        <el-table-column
          type="index"
          label="序号"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="attrName"
          label="属性名称"
          width="150"
        ></el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              style="margin-right: 5px"
              v-for="attr in row.attrValueList"
              :key="attr.id"
              >{{ attr.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row, $index }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="update(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="del(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-show="!isShowList" style="margin-top: 20px">
      <el-form :model="attr" inline>
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="el-icon-plus" @click="addAttrValue"
        >添加属性</el-button
      >
      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column
          type="index"
          label="序号~~~"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column prop="attrName" label="属性名称~~~~">
          <template v-slot="{ row, $index }">
            <el-input
              ref="input"
              v-model="row.valueName"
              v-if="row.edit"
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="editCompleted(row, $index)"
            ></el-input>
            <span v-else @click="edit(row)">{{ row.valueName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <el-popconfirm
              @onConfirm="delAttrValue($index)"
              :title="`确定删除 ${row.valueName} 吗？`"
              ><el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></el-button
            ></el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="isShowList = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Index from "@/components/Breadcrumb/index.vue";
import category from "./category";

export default {
  name: "AttrList",
  data() {
    return {
      attrList: [],
      isShowList: true,
      attr: {
        attrName: "",
        attrValueList: [],
      },
    };
  },
  methods: {
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    async getAttrList(category) {
      this.category = category;
      const result = await this.$API.attrs.getAttrList(category);
      if (result.code === 200) {
        // console.log(result.data);
        // 子组件给父组件传递参数 自定义事件
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    update(attr) {
      // this.attr = {
      //   ...attr,
      // };
      this.attr = JSON.parse(JSON.stringify(attr));
      this.isShowList = false;
    },
    editCompleted(row, index) {
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1);
        return;
      }
      row.edit = false;
    },
    addAttrValue() {
      this.attr.attrValueList.push({ edit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },

    async save() {
      const result = await this.$API.attrs.saveAttrInfo(this.attr);
      if (result.code === 200) {
        this.$message.success("更新数据成功~~~");
        this.isShowList = true;
        this.getAttrList(this.category);
      } else {
        this.$message.error(result.message);
      }
    },

    delAttrValue(index) {
      this.attr.attrValueList.splice(index, 1);
    },

    async del(row) {
      console.log(row);
      const result = await this.$API.attrs.delAttr(row.id);
      if (result.code === 200) {
        this.getAttrList(this.category);
      } else {
        this.$message.error(result.message);
      }
    },
  },
  components: {
    category,
  },
};
</script>
