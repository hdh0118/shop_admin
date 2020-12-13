import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*
  获取一级分页列表(带搜索)
  */
  getCategorys1() {
    return request({
      url: `${api_name}/getCategory1`,
      method: "GET"
    });
  },

  getCategorys2(category1Id) {
    return request({
      url: `${api_name}/getCategory2/${category1Id}`,
      method: "GET"
    });
  },

  getCategorys3(category2Id) {
    return request({
      url: `${api_name}/getCategory3/${category2Id}`,
      method: "GET"
    });
  },

  getAttrList({ category1Id, category2Id, category3Id }) {
    return request({
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: "GET"
    });
  },

  delAttr(attrId) {
    return request({
      url: `${api_name}/deleteAttr/${attrId}`,
      method: "DELETE"
    });
  },

  getAttrValueList(attrId) {
    return request({
      url: `${api_name}/getAttrValueList/${attrId}`,
      method: "GET"
    });
  },

  saveAttrInfo(attr) {
    return request({
      url: `${api_name}/saveAttrInfo`,
      method: "POST",
      data: attr
    });
  }
};
