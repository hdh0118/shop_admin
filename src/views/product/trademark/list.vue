<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="visible = true"
      >添加</el-button
    >

    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column
        prop="id"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img class="trademark-img" :src="scope.row.logoUrl" alt="logo" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="warning" class="el-icon-edit">修改</el-button>
        <el-button type="danger" class="el-icon-delete">删除</el-button>
      </el-table-column>
    </el-table>

    <el-pagination
      class="trademark-pagination"
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>

    <el-dialog title="添加品牌" :visible.sync="visible" width="50%">
      <el-form
        :model="trademarkForm"
        :rules="rules"
        ref="trademarkForm"
        label-width="100px"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Test from "./test";

export default {
  name: "TrademarkList",
  data() {
    return {
      trademarkList: [],
      total: 0,
      page: 1,
      limit: 3,
      visible: false,
      trademarkForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          {
            required: true,
            message: "请输入品牌名称",
            trigger: "blur",
          },
        ],
        logoUrl: [{ required: true, message: "请上传品牌LOGO" }],
      },
    };
  },
  methods: {
    async getPageList(page, limit) {
      try {
        const result = await this.$API.trademark.getPageList(page, limit);
        console.log(result);
        if (result.code === 200) {
          this.$message.success("获取品牌分页列表成功");
          this.limit = result.data.size; //每页显示的条数
          this.page = result.data.current; //代表当前页码
          this.trademarkList = result.data.records;
          this.total = result.data.total;
        } else {
          this.$message.error("获取品牌分页列表失败");
        }
      } catch (e) {
        console.log(e);
        this.$message.error("获取品牌分页列表失败");
      }
    },

    submitForm(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          const result = await this.$API.trademark.addTrademark(
            this.trademarkForm
          );

          if (result.code === 200) {
            this.$message.success("添加品牌数据成功。。。。。");
            this.visible = false;
            this.getPageList(this.page, this.limit);
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },

    handleAvatarSuccess(res) {
      this.trademarkForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const imgTypes = ["image/jpg", "image/png", "image/jpeg"];
      const isValidType = imgTypes.indexOf(file.type) > -1;
      const isLt = file.size / 1024 < 50;
      if (!isValidType) {
        this.$message.error("上传品牌LOGO只能是 JPG 或 PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传品牌LOGO只能是 JPG 或 PNG 格式!");
      }
      return isValidType && isLt;
    },
  },
  mounted() {
    this.getPageList(this.page, this.limit);
  },
  components: {
    Test,
  },
};
</script>

<style lang="sass" scoped>
.trademark-pagination
  text-align: center
.trademark-img
  width: 150px
.el-pagination__sizes
  margin-left: 250px

.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden

  &:hover
    border-color: #409EFF

  .avatar-uploader-icon
    font-size: 28px
    color: #8c939d
    width: 178px
    height: 178px
    line-height: 178px
    text-align: center

  .avatar
    width: 178px
    height: 178px
    display: block
</style>
