<template>
  <div class="wax-item">
    <template v-for="(table, k) in _tables">
      <component :is="k" :prop-key="k" :rows="table.rows" :key="k"></component>
    </template>
  </div>
</template>
<script>
import WaxTools from './tools.vue';
export default {
  components: {
    tools: WaxTools
  },
  props: {
    tables: {
      type: Object,
      required: true
    }
  },
  computed: {
    _tables() {
      const ret = {};
      for (const key in this.tables) {
        if (Object.hasOwnProperty.call(this.tables, key)) {
          const item = this.tables[key];
          if (item.rows.length) {
            ret[key] = item;
          }
        }
      }
      return ret;
    }
  }
};
</script>
<style lang="scss" scoped>
.wax-item {
  h3 {
    display: inline-block;
    font-size: 24px;
    margin-right: 16px;
  }
  > div:not(.wax-header) {
    margin-top: 8px;
    margin-left: 8px;
  }
}
</style>
