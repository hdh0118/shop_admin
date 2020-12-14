<template>
  <div>
    <Category />
    <SpuShowList v-if="isShowList" @showUpdateList="showUpdateList" />
    <SpuUpdateList v-else :item="item" />
  </div>
</template>

<script>
import Category from "../../../components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {},
    };
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },
  methods: {
    showUpdateList(row) {
      this.isShowList = false;
      this.item = { ...row };
      console.log(this.item, "item~~~~");
    },
  },
};
</script>
