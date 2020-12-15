<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form label-width="80px" :model="spu" :rules="rules" ref="spuForm">
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
        <el-form-item label="SPU图片" prop="imageList">
          <el-upload
            accept="image/*"
            class="avatar-uploader"
            list-type="picture-card"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :file-list="formatImageList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>

        <el-form-item label="销售属性" prop="saleAttrList">
          <el-select
            :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
            value=""
            v-model="spu.sale"
          >
            <el-option
              v-for="sale in filterSaleAttrList"
              :label="sale.name"
              :value="`${sale.id}-${sale.name}`"
              :key="sale.id"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            class="el-icon-plus"
            :disabled="!spu.sale"
            @click="addSpuSaleAttr"
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
          <template v-slot="{ row, $index }">
            <el-tag
              @close="delTag(i, row)"
              closable
              style="margin-right: 5px"
              v-for="(attrVal, i) in row.spuSaleAttrValueList"
              :key="attrVal.id"
              >{{ attrVal.saleAttrValueName }}</el-tag
            >

            <el-input
              class="input-new-tag"
              v-if="row.edit"
              size="mini"
              style="width: 100px"
              ref="input"
              autofocus
              v-model="saleAttrValueText"
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="editCompleted(row, $index)"
            ></el-input>

            <el-button
              class="button-new-tag"
              v-else
              size="mini"
              style="width: 100px"
              icon="el-icon-plus"
              @click="edit(row)"
              >添加</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row, $index }">
            <el-popconfirm
              @onConfirm="delSpuSaleAttr($index)"
              :title="`确定删除 ${row.saleAttrName} 吗？`"
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
      saleAttrValueText: "",
      rules: {
        spuName: [{ required: true, message: "请输入SPU名称" }],
        tmId: [{ required: true, message: "请选择品牌" }],
        description: [{ required: true, message: "请输入spu描述" }],
        imageList: [{ required: true, validator: this.imageListValidator }],
        sale: [{ validator: this.saleValidator, required: true }],
      },
    };
  },

  computed: {
    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        return !this.spuSaleAttrList.find(
          (spuSale) => spuSale.baseSaleAttrId === sale.id
        );
      });
    },

    formatImageList() {
      return this.imageList.map((img) => {
        return {
          name: img.imgName,
          url: img.imgUrl,
          uid: img.uid || img.id,
        };
      });
    },
  },

  methods: {
    imageListValidator(rule, value, callback) {
      const { imageList } = this;
      if (imageList.length > 0) {
        callback();
        return;
      }
      callback(new Error("请上传至少一张照片"));
    },

    saleValidator(rule, value, callback) {
      if (this.spuSaleAttrList.length === 0) {
        callback(new Error("请选择至少一个销售属性"));
        return;
      }

      const isNotOk = this.spuSaleAttrList.some(
        (sale) => sale.saleAttrValueText.length === 0
      );

      if (isNotOk) {
        callback(new Error("销售属性至少添加一个销售属性值，请添加"));
        return;
      }

      callback();
    },

    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },

    editCompleted(row, index) {
      console.log(row.spuSaleAttrValueList, 99990000);
      if (this.saleAttrValueText) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.saleAttrValueText,
          spuId: row.spuId,
        });
        this.saleAttrValueText = "";
      }
      row.edit = false;
    },

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
      console.log(file, 12345);
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
        this.imageList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },

    handleRemove(file, fileList) {
      this.imageList = this.imageList.filter(
        (img) =>
          // console.log(img);
          img.imgUrl !== file.url
      );
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

    handleAvatarSuccess(res, file) {
      this.imageList.push({
        imgName: file.name,
        imgUrl: res.data,
        spuId: this.spu.id,
      });
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

    addSpuSaleAttr() {
      const { sale, id } = this.spu;

      console.log(this.spuSaleAttrList, 3445566);
      const [baseSaleAttrId, saleAttrName] = sale.split("-");
      this.spuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId,
        saleAttrName,
        spuId: id,
        spuSaleAttrValueList: [],
      });
      this.spu.sale = "";
    },

    delSpuSaleAttr(index) {
      this.spuSaleAttrList.splice(index, 1);
    },

    delTag(index, row) {
      row.spuSaleAttrValueList.splice(index, 1);
    },

    save() {
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          console.log("校验通过~");
          const spu = {
            ...this.spu,
            spuImageList: this.imageList,
            spuSaleAttrList: this.spuSaleAttrList,
          };

          const result = await this.$API.spu.updateSpu(spu);
          if (result.code === 200) {
            this.$emit("showList", this.spu.category3Id);
            this.$message.success("更新spu成功~");
          } else {
            this.$message.error(result.message);
          }
        }
      });
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
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
