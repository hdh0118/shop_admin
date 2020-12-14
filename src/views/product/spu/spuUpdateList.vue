<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form label-width="80px" :model="spu">
        <el-form-item label="SPU名称" prop="spuName">
          <el-input
            placeholder="请输入spu名称"
            v-model="spu.spuName"
          ></el-input>
        </el-form-item>

        <el-form-item label="品牌" prop="tmId">
          <el-select placeholder="请选择品牌" v-model="spu.tmId">
            <el-option
              v-for="trademark in trademarkList"
              :value="trademark.id"
              :label="trademark.tmName"
              :key="trademark.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="SPU描述" prop="description">
          <el-input
            placeholder="请输入spu描述"
            v-model="spu.description"
          ></el-input>
        </el-form-item>

        <!--
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
 -->
        <el-form-item label="SPU图片">
          <el-upload
            class="avatar-uploader"
            list-type="picture-card"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :file-list="imageList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>

        <el-form-item label="销售属性" prop="saleAttrList">
          <el-select
            :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
            value=""
            v-model="spu.saleAttrId"
          >
            <el-option
              v-for="sale in filterSaleAttrList"
              :label="sale.name"
              :value="sale.id"
              :key="sale.id"
            ></el-option>
          </el-select>
          <el-button type="primary" class="el-icon-plus"
            >添加销售属性</el-button
          >
        </el-form-item>
      </el-form>

      <el-table
        :data="spuSaleAttrList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80px"
          align="center"
          prop="id"
        ></el-table-column>
        <el-table-column
          prop="saleAttrName"
          label="属性名称"
          width="150"
        ></el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              style="margin-right: 5px"
              v-for="attrVal in row.spuSaleAttrValueList"
              :key="attrVal.id"
              >{{ attrVal.saleAttrValueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-popconfirm>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary">保存</el-button>
      <el-button>取消</el-button>

      <el-dialog :visible.sync="visible">
        <img width="100%" :src="previewImageUrl" alt="img" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuUpdateList",
  props: {
    item: Object,
  },
  data() {
    return {
      spu: this.item,
      trademarkList: [], //所有品牌数据
      imageList: [], //所有图片列表
      previewImageUrl: "",
      visible: false,
      saleAttrList: [], //所有销售属性列表
      spuSaleAttrList: [], //当前spu销售属性列表
    };
  },

  computed: {
    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        return !this.spuSaleAttrList.find((spuSale) => {
          spuSale.baseSaleAttrId === sale.id;
        });
      });
    },
  },

  methods: {
    //获取所有品牌数据
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.$message.success("请求品牌数据成功~~~");
        this.trademarkList = result.data;
        // console.log(this.trademarkList);
      } else {
        this.$message.error(result.message);
      }
    },

    //处理图片预览
    handlePictureCardPreview(file) {
      this.previewImageUrl = file.url;
      this.visible = true;
    },

    //获取所有图片的数据
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      // console.log(result, 555556);
      if (result.code === 200) {
        this.$message.success("获取所有图片成功~~~");
        this.imageList = result.data.map((img) => {
          return {
            id: img.id,
            name: img.imgName,
            url: img.imgUrl,
          };
        });
      } else {
        this.$message.error(result.message);
      }
    },

    handleRemove(file, fileList) {
      this.imageList = this.imageList.filter((img) => img.id !== file.id);
    },

    //获取销售列表数据
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList();
      if (result.code === 200) {
        this.$message.success("获取所有销售列表数据成功~~");
        this.saleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },

    //获取当前spu销售列表
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("获取当前spu销售列表~~");
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },

  async mounted() {
    this.getTrademarkList();
    this.getSpuImageList();
    this.getSaleAttrList();
    this.getSpuSaleAttrList();
  },
};
</script>
