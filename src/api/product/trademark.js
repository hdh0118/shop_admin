import request from "@/utils/request";

const api_name = "/admin/product/baseTrademark";

export default {
  /*
  获取订单分页列表(带搜索)
  */
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET"
    });
  },

  addTrademark(data) {
    return request({
      url: `${api_name}/save`,
      method: "POST",
      data
    });
  },

  updateTrademark(data) {
    return request({
      url: `${api_name}/update`,
      method: "PUT",
      data
    });
  },

  deleteTrademark(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: "DELETE"
    });
  }
};
