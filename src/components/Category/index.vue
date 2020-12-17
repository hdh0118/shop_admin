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
import { mapState, mapMutations, mapActions } from "vuex";
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
      // category1List: [],
      // category2List: [],
      // category3List: [],
    };
  },

  computed: {
    ...mapState({
      category1List: (state) => state.category.category1List,
      category2List: (state) => state.category.category2List,
      category3List: (state) => state.category.category3List,
    }),
  },

  methods: {
    ...mapActions([
      "category/getCategory1List",
      "category/getCategory2List",
      "category/getCategory3List",
    ]),

    ...mapMutations(["category/SET_CATEGORY3_ID"]),

    async handleSelectChange1(category1Id) {
      this.category.category2Id = "";
      this.category.category3Id = "";
      this["category/getCategory2List"](category1Id);
    },
    async handleSelectChange2(category2Id) {
      this.category.category3Id = "";
      this["category/getCategory3List"](category2Id);
    },

    async handleSelectChange3(category3Id) {
      this["category/SET_CATEGORY3_ID"](category3Id);
      this.$bus.$emit("change", this.category);
      this.$bus.$emit("clearList");
    },
  },
  async mounted() {
    this["category/getCategory1List"]();
  },
};
</script>

<style lang="less" scoped>
</style>
