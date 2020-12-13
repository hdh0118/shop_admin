<template>
  <div>
    <el-card>
      <el-form :model="category" inline>
        <el-form-item label="一级分类">
          <el-select
            v-model="category.category1Id"
            placeholder="请选择"
            @change="handleSelectChange1"
            :disabled="disabled"
          >
            <el-option
              :label="category1.name"
              :value="category1.id"
              :key="category1.id"
              v-for="category1 in category1List"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category.category2Id"
            placeholder="请选择"
            @change="handleSelectChange2"
            :disabled="disabled"
          >
            <el-option
              v-for="category2 in category2List"
              :label="category2.name"
              :value="category2.id"
              :key="category2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="category.category3Id"
            placeholder="请选择"
            @change="handleSelectChange3"
            :disabled="disabled"
          >
            <el-option
              :label="category3.name"
              :value="category3.id"
              :key="category3.id"
              v-for="category3 in category3List"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "",
  props: ["disabled"],
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },

  methods: {
    async handleSelectChange1(category1Id) {
      this.category2List = [];
      this.category3List = [];
      this.category.category2Id = "";
      this.category.category3Id = "";
      const result = await this.$API.attrs.getCategorys2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    async handleSelectChange2(category2Id) {
      this.category3List = [];
      this.category.category3Id = "";
      const result = await this.$API.attrs.getCategorys3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      } else {
        this.$message.error(result.message);
      }
    },

    async handleSelectChange3(category3Id) {
      const category = {
        ...this.category,
        category3Id,
      };

      this.$emit("change", category);
    },
  },
  async mounted() {
    const result = await this.$API.attrs.getCategorys1();
    if (result.code === 200) {
      this.category1List = result.data;
    } else {
      this.$message.error(result.message);
    }

    //  async handleSelectChange2(category2Id) {
    //    const result = await this.$API.attrs.getCategorys3(category2Id)
    //    if(result.code === 200){
    //      this.category3List = result.data
    //    }else{
    //      this.$message.error(result.message)
    //    }
    //  },

    //  async handleSelectChange3(category3Id) {
    //    const category = {
    //      ...this.category,
    //      category3Id
    //    };
    //    const result = await this.$API.attrs.getCategorys3(category3Id)
    //    if(result.code === 200){
    //      this.category3List = result.data
    //    }else{
    //      this.$message.error(result.message)
    //    }
    //  },
  },
};
</script>

<style lang="less" scoped>
</style>
